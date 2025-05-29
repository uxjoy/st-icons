"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function IconModal({ iconPath, onClose }) {
  const [svgContent, setSvgContent] = useState("");
  const [copied, setCopied] = useState("");
  const svgWrapperRef = useRef(null);

  const iconName = iconPath.split("/").pop()?.replace(".svg", "") || "icon";
  const isStLogo = iconName.includes("st-logo");

  useEffect(() => {
    fetch(`/icons/${iconPath}`)
      .then((res) => res.text())
      .then(setSvgContent);
  }, [iconPath]);

  const copyToClipboard = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(`Copied as ${label}`);
      setTimeout(() => setCopied(""), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const defaultIconSize = 1080; // Default size for icons without specific dimensions

  /**
   * Parses SVG content to determine its natural dimensions or viewBox,
   * then calculates output dimensions based on a desired maximum size.
   * For 'st-logo' icons, it maintains aspect ratio. For others, it's square.
   * @param {string} svgString The SVG XML content.
   * @param {number} desiredSize The maximum width/height for the output PNG.
   * @returns {{outputWidth: number, outputHeight: number}} Calculated dimensions for the canvas.
   */
  const getSvgOutputDimensions = (svgString, desiredSize = defaultIconSize) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.querySelector("svg");

    let naturalWidth = 24; // Default if no viewBox/width
    let naturalHeight = 24; // Default if no viewBox/height

    const viewBox = svgElement?.getAttribute("viewBox");

    if (viewBox) {
      const parts = viewBox.split(" ").map(Number);
      if (parts.length === 4) {
        naturalWidth = parts[2];
        naturalHeight = parts[3];
      }
    } else {
      // Fallback to width/height attributes if viewBox is missing
      const widthAttr = svgElement?.getAttribute("width");
      const heightAttr = svgElement?.getAttribute("height");
      // Ensure attributes are valid numbers before parsing
      if (widthAttr && !isNaN(parseFloat(widthAttr)))
        naturalWidth = parseFloat(widthAttr);
      if (heightAttr && !isNaN(parseFloat(heightAttr)))
        naturalHeight = parseFloat(heightAttr);
    }

    const aspectRatio = naturalWidth / naturalHeight;

    let outputWidth = desiredSize;
    let outputHeight = desiredSize;

    if (isStLogo) {
      // Apply aspect ratio logic only for 'st-logo' icons
      if (aspectRatio > 1) {
        // Wider than tall (e.g., 2:1)
        outputHeight = Math.round(desiredSize / aspectRatio);
        outputWidth = desiredSize;
      } else {
        // Taller than wide or square (e.g., 1:2 or 1:1)
        outputWidth = Math.round(desiredSize * aspectRatio);
        outputHeight = desiredSize;
      }
    }

    // Ensure dimensions are at least 1px to prevent canvas issues
    if (outputWidth < 1) outputWidth = 1;
    if (outputHeight < 1) outputHeight = 1;

    return { outputWidth, outputHeight };
  };

  /**
   * Generates a PNG Blob from the SVG content at a specified resolution.
   * @param {string} svgContent The SVG XML content.
   * @param {number} desiredSize The target maximum dimension for the PNG.
   * @param {function(Blob): void} callback Function to call with the generated Blob.
   */
  const generatePngBlob = (svgContent, desiredSize, callback) => {
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob); // Create object URL for the SVG blob
    const img = new Image();

    img.onload = () => {
      const { outputWidth, outputHeight } = getSvgOutputDimensions(
        svgContent,
        desiredSize
      );

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // Set canvas dimensions based on calculated output size
      canvas.width = outputWidth;
      canvas.height = outputHeight;

      // Clear canvas and draw SVG scaled to fit the new dimensions
      ctx.clearRect(0, 0, outputWidth, outputHeight);
      ctx.drawImage(img, 0, 0, outputWidth, outputHeight);

      // CRITICAL FIX: Ensure that 'callback' is a function before passing it to toBlob
      if (typeof callback === "function") {
        canvas.toBlob(callback, "image/png"); // Generate PNG blob
      } else {
        console.error(
          "Error: generatePngBlob was called with an invalid callback type. Expected a function."
        );
        window.alert(
          "An internal error occurred during PNG generation. Please report this issue."
        );
      }
      // Clean up the object URL immediately after use
      URL.revokeObjectURL(url);
    };

    img.onerror = (err) => {
      console.error("Image load error for PNG conversion:", err);
      window.alert(
        "Failed to render image for conversion. Check console for details."
      );
      URL.revokeObjectURL(url); // Clean up the object URL on error too
    };

    img.src = url; // Set image source to the SVG object URL
  };

  /**
   * Copies the generated PNG to the clipboard at a default size (512px).
   * No size variable is passed to this function directly.
   */
  const copyAsPNG = async () => {
    // Define the default size for copying the PNG
    const defaultCopySize = defaultIconSize;

    try {
      generatePngBlob(svgContent, defaultCopySize, async (blob) => {
        if (blob) {
          try {
            // Use ClipboardItem for image data, which is the modern way to copy images
            await navigator.clipboard.write([
              new ClipboardItem({ "image/png": blob }),
            ]);
            const resolutionText = isStLogo
              ? "Aspect Ratio"
              : `${defaultCopySize}x${defaultCopySize}`;
            setCopied(`Copied as PNG (${resolutionText})`);
            setTimeout(() => setCopied(""), 2000);
          } catch (err) {
            console.error("Clipboard write error:", err);
            // Fallback for browsers that don't support navigator.clipboard.write in iframes
            window.alert(
              "Copy PNG failed. Your browser may not support image clipboard writing."
            );
          }
        } else {
          window.alert("Failed to generate PNG blob for copy.");
        }
      });
    } catch (err) {
      console.error("Error initiating PNG copy process:", err);
    }
  };

  /**
   * Downloads the generated PNG at a specified size.
   * The filename will reflect the actual output dimensions (including aspect ratio).
   * @param {number} size The desired maximum dimension for the PNG.
   */
  const downloadAsPNG = () => {
    // Define the default size for downloading the PNG
    const defaultDownloadSize = defaultIconSize;

    // Calculate the exact output dimensions based on the SVG and desired size.
    // This handles aspect ratio for 'st-logo' icons.
    const { outputWidth, outputHeight } = getSvgOutputDimensions(
      svgContent,
      defaultDownloadSize
    );

    generatePngBlob(svgContent, defaultDownloadSize, (blob) => {
      if (blob) {
        const link = document.createElement("a");
        // Use the calculated exact dimensions in the filename for clarity.
        link.download = `${iconName}-${outputWidth}x${outputHeight}.png`;
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link); // Append link to body to ensure it's clickable
        link.click(); // Programmatically click the link to trigger download
        document.body.removeChild(link); // Clean up the link element
        URL.revokeObjectURL(link.href); // Clean up the object URL
      } else {
        window.alert("Failed to generate PNG blob for download.");
      }
    });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-slate-950/60 z-50 flex items-center justify-center p-3"
      onClick={onClose}
    >
      <div
        className="bg-emerald-100 rounded-xl shadow-xl w-[460px] relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-12 h-12 inline-block text-slate-500 hover:text-black"
        >
          <span> ✕ </span>
        </button>

        <div className="modal-body space-y-6 p-8 bg-white rounded-xl shadow">
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
                    const viewBoxAttr = hasViewBox
                      ? ""
                      : ' viewBox="0 0 24 24"';
                    return `<svg${attrs}${viewBoxAttr} width="60%" height="60%" preserveAspectRatio="xMidYMid meet" stroke-width="2">`;
                  }),
              }}
            />

            <div className="flex flex-col gap-0.5">
              <p className="text-slate-800 font-semibold flex items-center gap-2">
                <span
                  className="cursor-pointer"
                  onClick={() => copyToClipboard(iconName, "Name")}
                >
                  {iconName} 📋
                </span>
                {/* {copied && (
                  <span className="text-emerald-600 text-xs bg-emerald-100 p-0.5 px-1.5 rounded-full">{copied}</span>
                )} */}
              </p>
              <p className="text-sm text-slate-600">
                {" "}
                {iconPath.split("/")[0]}
              </p>
            </div>
          </div>

          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-800"
            ref={svgWrapperRef}
          >
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
              className="bg-slate-800 col-span-2 sm:col-span-1 text-white w-full px-3 py-1.5 rounded-md hover:bg-slate-950 text-sm ease-in-out duration-200"
            >
              Download PNG
            </button>
          </div>
        </div>

        <div
          className={`font-medium text-emerald-600 text-xs text-center transition ease-in-out duration-300  ${
            copied && "py-1.5"
          }`}
        >
          {copied}
        </div>
      </div>
    </div>,
    document.body
  );
}
