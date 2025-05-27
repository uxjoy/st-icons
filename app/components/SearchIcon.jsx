const SearchIcon = ({ searchVlaue, iconLength, changeHandler }) => {
  return (
    <div className="flex items-center gap-6 bg-white border border-slate-200 shadow-xl shadow-slate-900/5 rounded-lg">
      <input
        type="text"
        value={searchVlaue}
        onChange={changeHandler}
        placeholder={`Search ${iconLength} icons...`}
        className="w-full h-14 border px-5 py-2 font-normal placeholder:text-slate-400 border-none focus:outline-none focus:ring-0 focus:border-none"
      />

      <button className="flex-none text-sm px-4 py-3 mr-2 rounded text-slate-800 font-medium bg-slate-100 hover:bg-slate-200 ease-in-out duration-200 cursor-pointer hidden sm:block">
        Download All Icons
      </button>

      <img src="logo.svg" alt="ShareTrip" className="h-7 pr-3 mb-0.5" />
    </div>
  );
};

export default SearchIcon;
