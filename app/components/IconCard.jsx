// components/IconCard.tsx
"use client";

import { useState } from "react";
import IconModal from "./IconModal";

export default function IconCard({ iconName }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    try {
      const res = await fetch(`/icons/${iconName}`);
      const svgText = (await res.text()).toLowerCase();
      await navigator.clipboard.writeText(svgText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Failed to copy SVG:", err);
    }
  };

  // Extract just the filename
  const shortName = iconName.split("/").pop()?.replace(".svg", "");

  return (
    <>
      <div
        className="flex flex-col min-h-[120px] gap-2 items-center justify-center text-center bg-slate-100 p-4 rounded-lg cursor-pointer border border-slate-100 hover:bg-blue-50 hover:border-blue-200 ease-in-out duration-300 group"
        onClick={() => setOpen(true)}
      >
        <img src={`/icons/${iconName}`} alt={shortName} className="w-auto h-7" />
        <p className={`text-xs leading-tight text-slate-800 mt-1 group-hover:text-blue-500`}>{shortName}</p>
      </div>

      {/* <div className="text-center cursor-pointer hover:bg-gray-100 p-3 rounded" onClick={() => setOpen(true)}>
        <img
          src={`/icons/${iconName}`}
          alt={iconName}
          className="w-10 h-10 mx-auto pointer-events-none"
          onContextMenu={(e) => e.preventDefault()}
          draggable={false}
        />
        <p className="text-sm mt-2 truncate">{shortName}</p>
      </div> */}

      {open && <IconModal iconPath={iconName} onClose={() => setOpen(false)} />}
    </>
  );
}
