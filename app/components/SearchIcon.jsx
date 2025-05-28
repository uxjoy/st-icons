import { useState } from "react";

const SearchIcon = ({ searchVlaue, iconLength, changeHandler }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/download-icons");

      if (!res.ok) {
        console.error("Download failed");
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "ST_Icons.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to download icons.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-6 bg-white border border-slate-200 shadow-xl shadow-slate-900/5 rounded-lg">
      <input
        type="text"
        value={searchVlaue}
        onChange={changeHandler}
        placeholder={`Search ${iconLength} icons...`}
        className="w-full h-14 border px-5 py-2 font-normal placeholder:text-slate-400 border-none focus:outline-none focus:ring-0 focus:border-none"
      />

      <button
        className={`min-w-[148px] flex-none text-sm py-2 mr-2.5 rounded font-medium ease-in-out duration-200 cursor-pointer hidden sm:block ${
          loading
            ? "bg-slate-300 text-slate-600 cursor-not-allowed"
            : "bg-blue-100 hover:bg-blue-500 text-blue-500 hover:text-white"
        }`}
        disabled={loading}
        onClick={handleDownload}
      >
        {loading ? "Preparing ZIP..." : "Download All Icons"}
      </button>

      <img
        src="logo.svg"
        alt="ShareTrip"
        className="h-7 pr-3 mb-0.5  sm:hidden"
      />
    </div>
  );
};

export default SearchIcon;
