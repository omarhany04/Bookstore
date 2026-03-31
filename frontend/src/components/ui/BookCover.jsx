import { useEffect, useState } from "react";

const palettes = [
  { gradient: "from-amber-300 via-orange-500 to-rose-600", accent: "rgba(255,255,255,0.18)" },
  { gradient: "from-cyan-300 via-sky-500 to-indigo-700", accent: "rgba(255,255,255,0.16)" },
  { gradient: "from-emerald-300 via-teal-500 to-cyan-700", accent: "rgba(255,255,255,0.18)" },
  { gradient: "from-fuchsia-300 via-pink-500 to-rose-700", accent: "rgba(255,255,255,0.18)" },
  { gradient: "from-lime-300 via-emerald-500 to-teal-700", accent: "rgba(255,255,255,0.16)" },
];

function hashValue(value = "") {
  return [...String(value)].reduce((total, char) => total + char.charCodeAt(0), 0);
}

export default function BookCover({ title, subtitle, category, imageUrl, className = "" }) {
  const palette = palettes[hashValue(title) % palettes.length];
  const initial = title?.trim()?.[0]?.toUpperCase() || "B";
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(imageUrl) && !imageFailed;

  useEffect(() => {
    setImageFailed(false);
  }, [imageUrl]);

  return (
    <div
      className={`relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${palette.gradient} ${className}`}
    >
      {hasImage ? (
        <>
          <img
            src={imageUrl}
            alt={title ? `${title} cover` : "Book cover"}
            loading="lazy"
            onError={() => setImageFailed(true)}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,18,0.08),rgba(8,10,18,0.58))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.18),transparent_32%)]" />
        </>
      ) : (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.28),transparent_34%)]" />
          <div className="absolute -right-10 top-6 h-28 w-28 rounded-full border border-white/20" />
          <div
            className="absolute left-4 top-4 h-14 w-14 rounded-[1.25rem] border border-white/20 backdrop-blur"
            style={{ background: palette.accent }}
          />
          <div
            className="absolute right-6 top-16 h-24 w-24 rounded-full border border-white/20 backdrop-blur"
            style={{ background: "rgba(255,255,255,0.08)" }}
          />
          <div className="absolute left-6 top-6 text-6xl font-black leading-none text-white/92">{initial}</div>
        </>
      )}

      <div className="absolute inset-x-4 bottom-4 rounded-[1.35rem] border border-white/16 bg-black/30 px-4 py-4 backdrop-blur-md">
        <div className="text-[0.65rem] font-black uppercase tracking-[0.24em] text-white/72">
          {category || "Curated read"}
        </div>
        <div className="mt-2 font-display text-xl font-semibold leading-tight text-white">{title}</div>
        {subtitle && <div className="mt-2 text-xs leading-relaxed text-white/78">{subtitle}</div>}
      </div>
    </div>
  );
}
