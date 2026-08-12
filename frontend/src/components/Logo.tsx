"use client";

export function ThreadLinkLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      fill="none"
      className={className}
    >
      <defs>
        {/* Dark Obsidian Paper Background (ThreadLink Theme) */}
        <linearGradient id="tl4BgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0b0d11" />
          <stop offset="50%" stopColor="#131720" />
          <stop offset="100%" stopColor="#07080b" />
        </linearGradient>

        {/* Container Border - Literary Gold & Slate Indigo */}
        <linearGradient id="tl4BorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#e5a93c" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#212734" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#5a8bd8" stopOpacity="0.8" />
        </linearGradient>

        {/* Thread Ribbon Gradient (Terracotta Crimson -> Gold -> Slate Indigo -> Muted Sage) */}
        <linearGradient id="tl4ThreadGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ea7a47" />
          <stop offset="28%" stopColor="#e5a93c" />
          <stop offset="65%" stopColor="#5a8bd8" />
          <stop offset="100%" stopColor="#63b378" />
        </linearGradient>

        {/* Gold Accent Gradient */}
        <linearGradient id="tl4GoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="40%" stopColor="#e5a93c" />
          <stop offset="100%" stopColor="#c28e2b" />
        </linearGradient>

        {/* Soft Ambient Light Radial Glow */}
        <radialGradient id="tl4AmbientGlow" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#e5a93c" stopOpacity="0.18" />
          <stop offset="55%" stopColor="#5a8bd8" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0b0d11" stopOpacity="0" />
        </radialGradient>

        {/* Container Soft Drop Shadow */}
        <filter id="tl4Shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="20" floodColor="#000000" floodOpacity="0.65" />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#5a8bd8" floodOpacity="0.15" />
        </filter>

        {/* Thread Neon Glow Filter */}
        <filter id="tl4ThreadGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="14" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Squircle Emblem Container */}
      <rect x="25" y="25" width="450" height="450" rx="92" fill="url(#tl4BgGrad)" stroke="url(#tl4BorderGrad)" strokeWidth="2.5" filter="url(#tl4Shadow)" />
      <rect x="27" y="27" width="446" height="446" rx="90" fill="url(#tl4AmbientGlow)" pointerEvents="none" />

      {/* Subtle Background Constellation Rings */}
      <g opacity="0.1" stroke="#f0f2f7" strokeWidth="1">
        <circle cx="250" cy="250" r="165" strokeDasharray="4 8" fill="none" />
        <circle cx="250" cy="250" r="105" strokeDasharray="3 6" fill="none" />
        <line x1="250" y1="70" x2="250" y2="430" strokeDasharray="2 8" />
        <line x1="70" y1="250" x2="430" y2="250" strokeDasharray="2 8" />
      </g>

      {/* Iconic Threads '@' Continuous Fluid Loop */}
      <g filter="url(#tl4ThreadGlow)">
        {/* Main Glowing Ribbon Stroke */}
        <path d="M 270 205
                 C 230 205, 200 230, 200 260
                 C 200 290, 230 310, 265 310
                 C 295 310, 315 290, 315 260
                 C 315 210, 275 160, 220 160
                 C 155 160, 130 220, 130 270
                 C 130 340, 185 375, 260 375
                 C 325 375, 375 330, 375 260
                 C 375 200, 345 170, 315 170"
              fill="none"
              stroke="url(#tl4ThreadGradient)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round" />

        {/* Pure Core White Shine Accent */}
        <path d="M 270 205
                 C 230 205, 200 230, 200 260
                 C 200 290, 230 310, 265 310
                 C 295 310, 315 290, 315 260
                 C 315 210, 275 160, 220 160
                 C 155 160, 130 220, 130 270
                 C 130 340, 185 375, 260 375
                 C 325 375, 375 330, 375 260
                 C 375 200, 345 170, 315 170"
              fill="none"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.65" />
      </g>

      {/* Interactive Story Connection Nodes (ThreadLink Signature) */}
      {/* Inner Loop Node: Gold Star Spark */}
      <g transform="translate(270, 205)" filter="url(#tl4ThreadGlow)">
        <circle cx="0" cy="0" r="11" fill="#fef08a" />
        <circle cx="0" cy="0" r="6" fill="#e5a93c" />
        <circle cx="0" cy="0" r="2.5" fill="#ffffff" />
      </g>

      {/* Bottom Core Node: Terracotta Crimson Dot */}
      <g transform="translate(260, 375)" filter="url(#tl4ThreadGlow)">
        <circle cx="0" cy="0" r="8" fill="#ea7a47" />
        <circle cx="0" cy="0" r="3.5" fill="#ffffff" />
      </g>

      {/* Terminating Outer Node: Slate Indigo Sparkle */}
      <g transform="translate(315, 170)" filter="url(#tl4ThreadGlow)">
        <circle cx="0" cy="0" r="10" fill="#5a8bd8" />
        <circle cx="0" cy="0" r="5" fill="#ffffff" />
        {/* 4-point Diamond Sparkle */}
        <path d="M 0 -8 L 2 -2 L 8 0 L 2 2 L 0 8 L -2 2 L -8 0 L -2 -2 Z" fill="#ffffff" />
      </g>
    </svg>
  );
}

export function ThreadLinkLogo4(props: { className?: string }) {
  return <ThreadLinkLogo {...props} />;
}

export function ThreadLinkLogo2({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="l2LightBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#F8FAFC" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>

        <linearGradient id="l2BorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="50%" stopColor="#CBD5E1" />
          <stop offset="100%" stopColor="#E2E8F0" />
        </linearGradient>

        <radialGradient id="l2AmbientLightGlow" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#EEF2FF" stopOpacity="0.8" />
          <stop offset="60%" stopColor="#FEF3C7" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="l2GoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient id="l2IndigoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#818CF8" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        <linearGradient id="l2ThreadRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="30%" stopColor="#F59E0B" />
          <stop offset="65%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>

        <linearGradient id="l2PageLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#EEF2FF" />
          <stop offset="100%" stopColor="#E0E7FF" />
        </linearGradient>

        <linearGradient id="l2PageRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>

        <filter id="l2SoftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#0F172A" floodOpacity="0.07" />
          <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#475569" floodOpacity="0.05" />
        </filter>

        <filter id="l2RibbonShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#312E81" floodOpacity="0.15" />
        </filter>

        <filter id="l2ThreadGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="20" y="20" width="460" height="460" rx="96" fill="url(#l2LightBg)" stroke="url(#l2BorderGrad)" strokeWidth="2.5" filter="url(#l2SoftShadow)" />
      <rect x="22" y="22" width="456" height="456" rx="94" fill="url(#l2AmbientLightGlow)" pointerEvents="none" />

      <g opacity="0.06" stroke="#475569" strokeWidth="1">
        <line x1="100" y1="60" x2="100" y2="440" strokeDasharray="4 8" />
        <line x1="250" y1="60" x2="250" y2="440" strokeDasharray="4 8" />
        <line x1="400" y1="60" x2="400" y2="440" strokeDasharray="4 8" />
        <line x1="60" y1="100" x2="440" y2="100" strokeDasharray="4 8" />
        <line x1="60" y1="250" x2="440" y2="250" strokeDasharray="4 8" />
        <line x1="60" y1="400" x2="440" y2="400" strokeDasharray="4 8" />
      </g>

      <g filter="url(#l2SoftShadow)">
        <path d="M 120 330 C 170 305, 230 312, 250 326 L 250 174 C 230 160, 170 153, 120 178 Z" fill="url(#l2PageLeftGrad)" stroke="#C7D2FE" strokeWidth="2" />
        <path d="M 380 330 C 330 305, 270 312, 250 326 L 250 174 C 270 160, 330 153, 380 178 Z" fill="url(#l2PageRightGrad)" stroke="#FDE68A" strokeWidth="2" />
        <path d="M 124 336 C 172 312, 230 318, 250 332" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.7" />
        <path d="M 376 336 C 328 312, 270 318, 250 332" stroke="#FCD34D" strokeWidth="1.5" fill="none" opacity="0.7" />
      </g>

      <line x1="250" y1="165" x2="250" y2="335" stroke="url(#l2IndigoGrad)" strokeWidth="4" strokeLinecap="round" />
      <path d="M 140 200 L 250 250 L 360 200 L 250 300 Z" fill="none" stroke="#6366F1" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.35" />

      <g filter="url(#l2RibbonShadow)">
        <path
          d="M 150 250 C 150 195, 215 190, 250 235 C 285 280, 350 275, 350 225 C 350 175, 285 185, 250 235 C 215 285, 150 295, 150 250 Z"
          fill="none"
          stroke="url(#l2ThreadRibbonGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 150 250 C 150 195, 215 190, 250 235 C 285 280, 350 275, 350 225 C 350 175, 285 185, 250 235 C 215 285, 150 295, 150 250 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.45"
        />
      </g>

      <g transform="translate(150, 250)">
        <circle cx="0" cy="0" r="14" fill="#FFE4E6" />
        <circle cx="0" cy="0" r="9" fill="#F43F5E" />
        <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
      </g>

      <g transform="translate(350, 225)">
        <circle cx="0" cy="0" r="14" fill="#FEF3C7" />
        <circle cx="0" cy="0" r="9" fill="#F59E0B" />
        <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
      </g>

      <g transform="translate(250, 235)" filter="url(#l2ThreadGlow)">
        <circle cx="0" cy="0" r="18" fill="#FFFFFF" opacity="0.9" />
        <circle cx="0" cy="0" r="12" fill="url(#l2GoldMetallic)" />
        <path d="M 0 -15 L 4 -4 L 15 0 L 4 4 L 0 15 L -4 4 L -15 0 L -4 -4 Z" fill="#FFFFFF" />
      </g>

      <g transform="translate(190, 282)">
        <circle cx="0" cy="0" r="6" fill="#0EA5E9" />
        <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
      </g>

      <path d="M 350 225 L 368 210 L 358 238 Z" fill="url(#l2GoldMetallic)" filter="url(#l2SoftShadow)" />

      <g opacity="0.25" stroke="url(#l2IndigoGrad)" strokeWidth="2" strokeLinecap="round">
        <path d="M 70 95 L 95 70" />
        <circle cx="70" cy="70" r="4" fill="#6366F1" stroke="none" />
        <path d="M 430 95 L 405 70" />
        <circle cx="430" cy="70" r="4" fill="#F59E0B" stroke="none" />
        <path d="M 70 405 L 95 430" />
        <circle cx="70" cy="430" r="4" fill="#F43F5E" stroke="none" strokeLinecap="round" />
        <path d="M 430 405 L 405 430" />
        <circle cx="430" cy="430" r="4" fill="#4F46E5" stroke="none" />
      </g>
    </svg>
  );
}

export function ThreadLinkLogo3({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 500"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient id="l3DarkBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0B0F19" />
          <stop offset="50%" stopColor="#111827" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        <linearGradient id="l3DarkBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.8" />
          <stop offset="35%" stopColor="#334155" stopOpacity="0.4" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.8" />
        </linearGradient>

        <radialGradient id="l3DarkAmbientGlow" cx="50%" cy="45%" r="60%">
          <stop offset="0%" stopColor="#4338CA" stopOpacity="0.35" />
          <stop offset="50%" stopColor="#B45309" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#0B0F19" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="l3DarkGoldMetallic" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="30%" stopColor="#FBBF24" />
          <stop offset="70%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="l3ElectricIndigo" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A5B4FC" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>

        <linearGradient id="l3DarkThreadRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FF2D55" />
          <stop offset="25%" stopColor="#FF9500" />
          <stop offset="55%" stopColor="#FFCC00" />
          <stop offset="80%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#00C7BE" />
        </linearGradient>

        <linearGradient id="l3DarkPageLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#312E81" stopOpacity="0.5" />
        </linearGradient>

        <linearGradient id="l3DarkPageRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#451A03" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#78350F" stopOpacity="0.5" />
        </linearGradient>

        <filter id="l3DarkSoftShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="16" stdDeviation="24" floodColor="#000000" floodOpacity="0.7" />
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#4338CA" floodOpacity="0.25" />
        </filter>

        <filter id="l3NeonRibbonGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="6" result="blur1" />
          <feGaussianBlur stdDeviation="14" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="l3CoreStarGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect x="20" y="20" width="460" height="460" rx="96" fill="url(#l3DarkBg)" stroke="url(#l3DarkBorderGrad)" strokeWidth="2.5" filter="url(#l3DarkSoftShadow)" />
      <rect x="22" y="22" width="456" height="456" rx="94" fill="url(#l3DarkAmbientGlow)" pointerEvents="none" />

      <g opacity="0.12" stroke="#6366F1" strokeWidth="1">
        <line x1="100" y1="60" x2="100" y2="440" strokeDasharray="4 8" />
        <line x1="250" y1="60" x2="250" y2="440" strokeDasharray="4 8" />
        <line x1="400" y1="60" x2="400" y2="440" strokeDasharray="4 8" />
        <line x1="60" y1="100" x2="440" y2="100" strokeDasharray="4 8" />
        <line x1="60" y1="250" x2="440" y2="250" strokeDasharray="4 8" />
        <line x1="60" y1="400" x2="440" y2="400" strokeDasharray="4 8" />
      </g>

      <g filter="url(#l3DarkSoftShadow)">
        <path d="M 120 330 C 170 305, 230 312, 250 326 L 250 174 C 230 160, 170 153, 120 178 Z" fill="url(#l3DarkPageLeftGrad)" stroke="#818CF8" strokeWidth="1.8" strokeOpacity="0.6" />
        <path d="M 380 330 C 330 305, 270 312, 250 326 L 250 174 C 270 160, 330 153, 380 178 Z" fill="url(#l3DarkPageRightGrad)" stroke="#FBBF24" strokeWidth="1.8" strokeOpacity="0.6" />
        <path d="M 124 336 C 172 312, 230 318, 250 332" stroke="#6366F1" strokeWidth="1.5" fill="none" opacity="0.8" />
        <path d="M 376 336 C 328 312, 270 318, 250 332" stroke="#F59E0B" strokeWidth="1.5" fill="none" opacity="0.8" />
      </g>

      <line x1="250" y1="165" x2="250" y2="335" stroke="url(#l3DarkGoldMetallic)" strokeWidth="4.5" strokeLinecap="round" filter="url(#l3NeonRibbonGlow)" />
      <path d="M 140 200 L 250 250 L 360 200 L 250 300 Z" fill="none" stroke="#818CF8" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.4" />

      <g filter="url(#l3NeonRibbonGlow)">
        <path
          d="M 150 250 C 150 195, 215 190, 250 235 C 285 280, 350 275, 350 225 C 350 175, 285 185, 250 235 C 215 285, 150 295, 150 250 Z"
          fill="none"
          stroke="url(#l3DarkThreadRibbonGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 150 250 C 150 195, 215 190, 250 235 C 285 280, 350 275, 350 225 C 350 175, 285 185, 250 235 C 215 285, 150 295, 150 250 Z"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.7"
        />
      </g>

      <g transform="translate(150, 250)" filter="url(#l3NeonRibbonGlow)">
        <circle cx="0" cy="0" r="14" fill="#881337" opacity="0.8" />
        <circle cx="0" cy="0" r="9" fill="#FF2D55" />
        <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
      </g>

      <g transform="translate(350, 225)" filter="url(#l3NeonRibbonGlow)">
        <circle cx="0" cy="0" r="14" fill="#78350F" opacity="0.8" />
        <circle cx="0" cy="0" r="9" fill="#FF9500" />
        <circle cx="0" cy="0" r="4" fill="#FFFFFF" />
      </g>

      <g transform="translate(250, 235)" filter="url(#l3CoreStarGlow)">
        <circle cx="0" cy="0" r="22" fill="#6366F1" opacity="0.35" />
        <circle cx="0" cy="0" r="14" fill="url(#l3DarkGoldMetallic)" />
        <path d="M 0 -16 L 5 -5 L 16 0 L 5 5 L 0 16 L -5 5 L -16 0 L -5 -5 Z" fill="#FFFFFF" />
      </g>

      <g transform="translate(190, 282)" filter="url(#l3NeonRibbonGlow)">
        <circle cx="0" cy="0" r="7" fill="#00C7BE" />
        <circle cx="0" cy="0" r="3" fill="#FFFFFF" />
      </g>

      <path d="M 350 225 L 368 210 L 358 238 Z" fill="url(#l3DarkGoldMetallic)" filter="url(#l3NeonRibbonGlow)" />

      <g stroke="url(#l3DarkGoldMetallic)" strokeWidth="2" strokeLinecap="round" opacity="0.65">
        <path d="M 70 95 L 95 70" />
        <circle cx="70" cy="70" r="4" fill="#FF2D55" stroke="none" />
        <path d="M 430 95 L 405 70" />
        <circle cx="430" cy="70" r="4" fill="#FF9500" stroke="none" />
        <path d="M 70 405 L 95 430" />
        <circle cx="70" cy="430" r="4" fill="#6366F1" stroke="none" />
        <path d="M 430 405 L 405 430" />
        <circle cx="430" cy="430" r="4" fill="#00C7BE" stroke="none" />
      </g>
    </svg>
  );
}


