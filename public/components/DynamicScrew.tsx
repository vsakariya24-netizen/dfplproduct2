// --- NEW COMPONENT: Clean Wireframe vs. Solid Screw ---
const CleanScrew = ({ lengthMm, isSelected }: { lengthMm: number, isSelected: boolean }) => {
  // CONFIGURATION
  const scaleMultiplier = 3; // How much pixel height per mm
  const headHeight = 12;
  const tipHeight = 6;
  const totalWidth = 32;
  
  const bodyHeight = lengthMm * scaleMultiplier; 
  const totalHeight = headHeight + bodyHeight + tipHeight;

  return (
    <div 
      className="flex flex-col items-center justify-start transition-all duration-300 ease-out" 
      style={{ height: `${totalHeight}px` }}
    >
      <svg 
        width={totalWidth} 
        height={totalHeight} 
        viewBox={`0 0 ${totalWidth} ${totalHeight}`} 
        className="overflow-visible"
      >
        <defs>
          {/* DEFINING THE HATCH PATTERN (The "Blueprint" Look) */}
          <pattern 
            id="blueprintHatch" 
            patternUnits="userSpaceOnUse" 
            width="4" 
            height="4" 
            patternTransform="rotate(45)"
          >
            <line x1="0" y1="0" x2="0" y2="4" stroke="#cbd5e1" strokeWidth="1" />
          </pattern>
        </defs>

        <g className="transition-all duration-300">
            {/* 1. SCREW HEAD */}
            <path 
                d={`M2,2 L${totalWidth-2},2 L${totalWidth-6},${headHeight} L6,${headHeight} Z`} 
                className={`transition-colors duration-300 ${
                    isSelected 
                    ? 'fill-amber-500 stroke-amber-600' 
                    : 'fill-white stroke-slate-300'
                }`}
                strokeWidth="1.5"
            />
            {/* Head Slot Detail */}
            <rect 
                x={totalWidth/2 - 5} y="4" width="10" height="2" rx="1" 
                className={`transition-colors duration-300 ${isSelected ? 'fill-amber-700' : 'fill-slate-200'}`} 
            />

            {/* 2. SCREW BODY (Main Shaft) */}
            <rect 
                x={totalWidth/2 - 6} 
                y={headHeight} 
                width="12" 
                height={bodyHeight} 
                className={`transition-colors duration-300 ${
                    isSelected 
                    ? 'fill-amber-500 stroke-amber-600' 
                    : 'fill-[url(#blueprintHatch)] stroke-slate-300' // Apply Pattern here
                }`}
                strokeWidth="1.5"
            />

            {/* 3. SCREW TIP */}
            <path 
                d={`
                    M${totalWidth/2 - 6},${headHeight + bodyHeight} 
                    L${totalWidth/2 + 6},${headHeight + bodyHeight} 
                    L${totalWidth/2},${headHeight + bodyHeight + tipHeight} 
                    Z
                `}
                className={`transition-colors duration-300 ${
                    isSelected 
                    ? 'fill-amber-500 stroke-amber-600' 
                    : 'fill-white stroke-slate-300'
                }`}
                strokeWidth="1.5"
            />
            
            {/* 4. SHINE EFFECT (Only visible when selected) */}
            {isSelected && (
                <path 
                    d={`M${totalWidth/2 - 2},${headHeight + 2} L${totalWidth/2 - 2},${headHeight + bodyHeight - 2}`} 
                    stroke="rgba(255,255,255,0.3)" 
                    strokeWidth="2" 
                    strokeLinecap="round"
                />
            )}
        </g>
      </svg>
    </div>
  );
};