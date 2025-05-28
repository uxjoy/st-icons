"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function IconModal({ iconPath, onClose }) {
  const [svgContent, setSvgContent] = useState("");
  const [copied, setCopied] = useState("");
  const svgWrapperRef = useRef(null);

  const iconName = iconPath.split("/").pop()?.replace(".svg", "") || "icon";

  useEffect(() => {
    fetch(`/icons/${iconPath}`)
      .then((res) => res.text())
      .then(setSvgContent);
  }, [iconPath]);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`Copied ${label}`);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const copyAsPNG = async () => {
    try {
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(svgBlob);
      const img = new Image();

      img.onload = async () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Set fixed output size
        const size = 512;
        canvas.width = size;
        canvas.height = size;

        // Clear canvas and draw SVG scaled to fit
        ctx.clearRect(0, 0, size, size);

        // Optionally center the image if it's small
        ctx.drawImage(img, 0, 0, size, size);

        canvas.toBlob(async (blob) => {
          try {
            await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
            setCopied("Copied PNG (512x512)");
            setTimeout(() => setCopied(""), 2000);
          } catch (err) {
            console.error("Clipboard error:", err);
            alert("Copy failed. Your browser may not support image clipboard writing.");
          }
        }, "image/png");
      };

      img.onerror = (err) => {
        console.error("Image load error:", err);
        alert("Failed to load image for conversion.");
      };

      img.src = url;
    } catch (err) {
      console.error("Failed to copy as PNG:", err);
    }
  };

  const downloadIcon = () => {
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${iconName}.png`;
    link.click();
  };

  const downloadAsPNG = () => {
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const size = 512;
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        const link = document.createElement("a");
        link.download = `${iconName}.png`;
        link.href = URL.createObjectURL(blob);
        link.click();
      }, "image/png");
    };

    img.onerror = (err) => {
      console.error("Image load error:", err);
      alert("Failed to render PNG.");
    };

    img.src = url;
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-[460px] p-8 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-12 h-12 inline-block text-slate-500 hover:text-black"
        >
          <span> ✕ </span>
        </button>

        <div className="modal-body space-y-6">
          <div className="flex items-center gap-4">
            <div
              className="w-18 h-18 bg-slate-50 flex items-center justify-center rounded-lg border border-slate-200 overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: svgContent
                  // Remove hardcoded width, height
                  .replace(/(width|height)="[^"]*"/g, "")
                  // Normalize stroke-width (or force it)
                  .replace(/stroke-width="[^"]*"/g, "")
                  // Inject viewBox, width, height, stroke-width
                  .replace(/<svg([^>]*)>/, (_match, attrs) => {
                    const hasViewBox = /viewBox="[^"]*"/.test(attrs);
                    const viewBoxAttr = hasViewBox ? "" : ' viewBox="0 0 24 24"';
                    return `<svg${attrs}${viewBoxAttr} width="60%" height="60%" preserveAspectRatio="xMidYMid meet" stroke-width="2">`;
                  }),
              }}
            />

            <div className="flex flex-col gap-1">
              <p className="text-slate-800 font-medium flex items-center gap-2">
                <span className="cursor-pointer" onClick={() => copyToClipboard(iconName, "Name")}>
                  {iconName} 📋
                </span>
                {copied && (
                  <span className="text-emerald-600 text-xs bg-emerald-100 p-0.5 px-1.5 rounded-full">{copied}</span>
                )}
              </p>
              <p className="text-sm text-slate-600"> {iconPath.split("/")[0]}</p>
            </div>
          </div>

          <div className="flex gap-2 items-center mt-2 text-slate-800" ref={svgWrapperRef}>
            {/* <button
                onClick={() => copyToClipboard(iconName, "name")}
                className="bg-slate-200 px-3 py-1.5 rounded-md hover:bg-slate-300 text-sm ease-in-out duration-200"
              >
                Copy Name
              </button> */}

            <button
              onClick={copyAsPNG}
              className="bg-slate-100 border border-slate-200 w-full px-3 py-1.5 rounded-md hover:bg-slate-200 text-sm ease-in-out duration-200"
            >
              Copy PNG
            </button>

            <button
              onClick={() => copyToClipboard(svgContent, "SVG")}
              className="bg-slate-100 border border-slate-200 w-full px-3 py-1.5 rounded-md hover:bg-slate-200 text-sm ease-in-out duration-200"
            >
              Copy SVG
            </button>

            <button
              onClick={downloadAsPNG}
              className="bg-slate-800 text-white w-full px-3 py-1.5 rounded-md w-grow hover:bg-slate-950 text-sm ease-in-out duration-200"
            >
              Download PNG
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
