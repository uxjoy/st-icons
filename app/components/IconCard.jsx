// components/IconCard.tsx
"use client";

import { useState } from "react";

export default function IconCard({ iconName }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      const res = await fetch(`/icons/${iconName}`);
      const svgText = await res.text();
      await navigator.clipboard.writeText(svgText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy SVG:", err);
    }
  };

  // Extract just the filename
  const shortName = iconName
    .split("/")
    .pop()
    ?.replace(".svg", "")
    .replace(/[\s-]+/g, "-") // replace multiple spaces/hyphens with single dash
    .replace(/^-+|-+$/g, "") // trim leading/trailing dashes;
    .toLowerCase();

  return (
    <div
      className="flex flex-col min-h-[120px] gap-2 items-center justify-center text-center bg-slate-100 p-4 rounded-lg cursor-pointer border border-slate-100 hover:bg-blue-50 hover:border-blue-200 ease-in-out duration-300 group"
      onClick={handleCopy}
    >
      <img src={`/icons/${iconName}`} alt={shortName} className="w-auto h-7" />
      <p
        className={`text-xs leading-tight text-slate-800 mt-1 group-hover:text-blue-500 ${
          copied && "text-emerald-600 group-hover:text-emerald-600 ease-in-out duration-300"
        }`}
      >
        {copied ? "✅ Copied!" : shortName}
      </p>
    </div>
  );
}
