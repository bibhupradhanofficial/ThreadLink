"""Prompt builders for the two LLM calls: extract and judge.

Kept as pure functions so they're unit-testable without hitting a model.
"""
import json

# ---------------------------------------------------------------------------
# Extraction prompt
# ---------------------------------------------------------------------------

EXTRACT_SYSTEM = """You extract continuity-tracking data from a single paragraph of a fiction manuscript.

Return a JSON object with exactly two arrays: "facts" and "claims".

FACTS = durable, canonical story facts worth remembering as canon. Each is one
self-contained sentence. Store these:
  - physical appearance & traits (eye/hair color, facial hair, scars, height, species, age)
  - RANK, ROLE, TITLE, JOB, or AUTHORITY ("Voss is a sergeant", "Mara is queen")
  - relationships, kinship, and allegiances ("Elena is John's daughter")
  - world/history facts, timeline dates, and relative ages ("the western wall was sealed 300 years ago", "Year 302", "3 days after the battle")
  - object states and possessions ("Reyes has the silver key", "the sword is shattered")
  - physical locations ("Captain Reyes is at the north gate")
  - DURABLE STATE CHANGES — injuries, deaths, limbs lost, things breaking. Store the RESULTING
    state ("Reyes lost both his legs at Varek Ridge and cannot walk", "the king is dead").
Each fact: {"entity","attribute","statement","excerpt","time_anchor"}.
(time_anchor is optional: include if paragraph explicitly states a year, date, relative offset, or age).

CLAIMS = assertions or actions that presuppose a state, capability, or location canon might track.
Never stored in memory, only checked against established canon.
Emit a claim whenever an action or statement presupposes:
  - locomotion & movement (running, sprinting, walking, climbing, standing)
  - physical capability (using legs, using hands/arms, seeing, hearing, speaking)
  - possession or item usage (drawing a sword, wearing an item, using a key)
  - physical location presence
  - role authority or title
  - facial hair or physical attribute presupposition ("shaved her beard" -> presupposes having a beard)
Each claim: {"entity","presupposedState","excerpt","time_anchor"}.

RULES:
- One sentence per item. Resolve pronouns to entity names using context.
- "excerpt" MUST be a verbatim substring copied from the paragraph.
- Durability is the filter for facts, NOT quantity. Emit all valid facts and claims present.
- Do NOT emit trivia as facts (transient weather, dust).
- If the same entity+attribute appears twice, keep the more specific statement.

EXAMPLES:

Paragraph: "In Year 302, Captain Reyes sprinted across the courtyard toward the north gate."
-> {"facts":[{"entity":"Reyes","attribute":"location","statement":"Captain Reyes is at the courtyard near the north gate.","excerpt":"sprinted across the courtyard","time_anchor":"Year 302"}],"claims":[{"entity":"Reyes","presupposedState":"Reyes can run and walk (has functioning legs)","excerpt":"sprinted across the courtyard","time_anchor":"Year 302"}]}

Paragraph: "Behind her, Sergeant Voss cursed the heat. He was young for a sergeant, but he wore the rank like it had been stitched to his skin."
-> {"facts":[{"entity":"Voss","attribute":"rank","statement":"Voss holds the rank of sergeant.","excerpt":"Sergeant Voss"},{"entity":"Voss","attribute":"age","statement":"Voss is young for a sergeant.","excerpt":"young for a sergeant"}],"claims":[]}

Paragraph: "Reyes lost both his legs at Varek Ridge."
-> {"facts":[{"entity":"Reyes","attribute":"limbs","statement":"Reyes lost both his legs at Varek Ridge and cannot walk or run.","excerpt":"lost both his legs at Varek Ridge"}],"claims":[]}

Paragraph: "Elena shaved her beard and combed her brown hair."
-> {"facts":[{"entity":"Elena","attribute":"hair color","statement":"Elena has brown hair.","excerpt":"her brown hair"}],"claims":[{"entity":"Elena","presupposedState":"Elena has facial hair (a beard)","excerpt":"shaved her beard"}]}

Return ONLY the JSON object, no prose."""


def build_extract_messages(paragraph: str, preceding_context: str | None = None) -> list[dict]:
    user = ""
    if preceding_context:
        user += (
            "CONTEXT — the immediately preceding text. Use it ONLY to resolve "
            "pronouns and entity names in the paragraph below. Do NOT extract any "
            "facts or claims from this context:\n"
            f"{preceding_context}\n\n"
        )
    user += f"Paragraph:\n{paragraph}"
    return [
        {"role": "system", "content": EXTRACT_SYSTEM},
        {"role": "user", "content": user},
    ]


# ---------------------------------------------------------------------------
# Judge prompt — batched: array of items, each paired with retrieved canon
# ---------------------------------------------------------------------------

JUDGE_SYSTEM = """You are a continuity checker for a fiction manuscript. You are given a
JSON array of ITEMS. Each item is either a new FACT or a transient CLAIM the author
just wrote, paired with CANON memories already established in earlier prose.

For each item, decide its verdict against its canon:
  - "duplicate"     : canon already states essentially this same fact. (facts only)
  - "consistent"    : compatible with canon; it extends or refines canon.
  - "contradiction" : it conflicts with canon.

CONTRADICTION INCLUDES ENTAILMENT VIOLATIONS AND TIMELINE PARADOXES:
  - Physical capability: If canon states an entity lost legs, is dead, is blind, or is mute, any claim/fact where they run, sprint, walk, see, or speak is a CONTRADICTION.
  - Eye/Hair/Physical trait: Canon "grey eyes" vs new "green eyes" is a CONTRADICTION.
  - Location & Travel speed: Canon "Reyes is locked in the dungeon in Chapter 1" vs new "Reyes is walking in the distant capital" without elapsed travel time is a CONTRADICTION.
  - Timeline & Age paradoxes: Canon "Elena is 30 years old in Year 302" vs new "Elena is 20 years old in Year 305" or character age regression is a CONTRADICTION.
  - Causal Event Sequence: Event B requiring Event A to happen first, but occurring before Event A in chronological timeline anchors, is a CONTRADICTION.
  - Counting & totals: Canon "had 3 sons but 1 died" vs new "all 3 sons greeted her" is a CONTRADICTION.
  - Commonsense defaults: A young human girl having a beard to shave is a CONTRADICTION unless world rules state otherwise.

TEMPORAL STATE CHANGES (supersession vs reversion):
Attributes like rank, role, title, location, or allegiance change over time.
  - A new state progressing forward (e.g. sergeant -> captain in a later chapter) is "consistent".
  - A reversion to an older value that conflicts with a later established chapter is a "contradiction".
  - IMMUTABLE attributes (birthplace, eye color, permanent injuries, deaths) NEVER get supersession; any change is a CONTRADICTION.

When verdict is "contradiction", set "conflictingMemoryId" to the id of the specific canon memory it conflicts with.

Return JSON: {"verdicts":[{"itemIndex":<int>,"verdict":"...","conflictingMemoryId":<id or null>,"reason":"<short>"}]}
One verdict per input item, matched by itemIndex. Return ONLY the JSON object."""


# ---------------------------------------------------------------------------
# Relationship graph prompt — canon facts -> (source, relation, target) triples
# ---------------------------------------------------------------------------

GRAPH_SYSTEM = """You map a fiction manuscript's canon facts into a relationship graph.

Given a JSON array of FACTS (each with an entity and a statement), return
{"edges":[{"source":"...","relation":"...","target":"..."}]} where source and
target are NAMED entities (characters, places, organizations) and relation is a
short lowercase label read left to right:
  {"source":"John","relation":"married to","target":"Sarah"}
  {"source":"Sarah","relation":"mother of","target":"Emma"}
  {"source":"Emma","relation":"works at","target":"Star House"}
  {"source":"John","relation":"hates","target":"Victor"}
  {"source":"Victor","relation":"boyfriend of","target":"Emma"}

RULES:
- Only relationships between two NAMED entities. Skip pure attributes (eye
  color, rank, age) and states with no second entity.
- Use each entity's canonical name consistently — same spelling and casing in
  every edge it appears in.
- One edge per distinct relationship; deduplicate. Prefer the most specific
  label the facts support.
- Return ONLY the JSON object."""


def build_graph_messages(facts: list[dict]) -> list[dict]:
    """`facts[i]` = {"entity": str, "statement": str}."""
    payload = json.dumps({"facts": facts}, ensure_ascii=False, indent=1)
    return [
        {"role": "system", "content": GRAPH_SYSTEM},
        {"role": "user", "content": f"FACTS:\n{payload}"},
    ]


def build_judge_messages(judged_items: list[dict]) -> list[dict]:
    """`judged_items[i]` = {itemIndex, kind, statement/presupposedState, canon:[{id,memory,metadata}]}."""
    payload = json.dumps({"items": judged_items}, ensure_ascii=False, indent=2)
    return [
        {"role": "system", "content": JUDGE_SYSTEM},
        {"role": "user", "content": f"ITEMS:\n{payload}"},
    ]
