export function EnvelopeIllustration() {
  return (
    <div className="relative flex items-center justify-center">
      {/* Blob background */}
      <div
        className="absolute w-48 h-48 bg-[#edeeef] rounded-[60%_40%_55%_45%/50%_60%_40%_50%]"
        style={{ filter: "blur(2px)" }}
      />

      {/* SVG envelope */}
      <svg
        viewBox="0 0 180 150"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-36 h-36 drop-shadow-xl"
      >
        {/* Back flap (light gray) */}
        <polygon points="10,140 90,70 170,140" fill="#9ca3af" opacity="0.7" />
        {/* Envelope body (dark navy) */}
        <rect x="10" y="50" width="160" height="90" rx="8" fill="#1e293b" />
        {/* Front flap fold */}
        <polygon points="10,50 90,115 170,50" fill="#0f172a" opacity="0.85" />
        {/* Blue accent fold line */}
        <line
          x1="10"
          y1="50"
          x2="90"
          y2="115"
          stroke="#3b82f6"
          strokeWidth="2"
          strokeLinecap="round"
        />
        {/* Dashed line decoration on top face */}
        <path
          d="M 55 62 Q 75 55 95 62"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.6"
        />
        {/* Small person icon */}
        <circle cx="75" cy="58" r="4" fill="white" opacity="0.5" />
        <path
          d="M 68 70 Q 75 65 82 70"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />
        {/* Left gray triangle */}
        <polygon points="10,50 10,140 60,95" fill="#6b7280" opacity="0.5" />
        {/* Right gray triangle */}
        <polygon points="170,50 170,140 120,95" fill="#6b7280" opacity="0.4" />
      </svg>
    </div>
  );
}
