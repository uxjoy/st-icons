"use client";

import { useMemo, useState } from "react";
import IconCard from "./IconCard";
import SearchIcon from "./SearchIcon";

export default function IconsTabView({ iconsByCategory }) {
  const categoryNames = Object.keys(iconsByCategory);
  const allIcons = useMemo(() => categoryNames.flatMap((category) => iconsByCategory[category]), [iconsByCategory]);

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const currentIcons = activeTab === "all" ? allIcons : iconsByCategory[activeTab] || [];
  const filteredIcons = currentIcons.filter((iconPath) => iconPath.toLowerCase().includes(search.toLowerCase()));
  const tabs = ["all", ...categoryNames];

  return (
    <div className="flex h-full">
      <div className="sidebar min-w-[248px] bg-white border-r border-slate-100 overflow-y-auto no-scrollbar">
        <div className="logo flex items-end gap-2 px-4 py-6 sticky top-0 z-10 bg-gradient-to-b from-white to-white/20 backdrop-blur-sm ">
          <img src="logo.svg" alt="ShareTrip" className="h-10 w-auto" />
          <p className="text-slate-600">Icons</p>
        </div>

        <div className="flex flex-col gap-0.5 p-4 pt-2 w-full">
          {tabs.map((category) => (
            <button
              key={category}
              onClick={() => {
                setActiveTab(category);
                setSearch("");
              }}
              className={`px-4 py-2 text-left capitalize rounded text-sm cursor-pointer ease-in-out duration-200 hover:pl-6 ${
                activeTab === category ? "bg-black text-white" : " text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span> {category} </span>
              {/* <span className="text-slate-400 font-normal"> ({filteredIcons.length}) </span> */}
            </button>
          ))}
        </div>
      </div>

      <div className="main-area w-full h-full overflow-y-auto">
        <div className="sticky top-0 z-10 bg-gradient-to-b from-white to-white/20 px-5 py-4">
          <SearchIcon
            searchVlaue={search}
            iconLength={filteredIcons.length}
            changeHandler={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="p-5 pt-2">
          {filteredIcons.length > 0 ? (
            <div className="grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-12 gap-3">
              {filteredIcons.map((iconPath) => (
                <IconCard key={iconPath} iconName={iconPath} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No icons found in "{activeTab}"</p>
          )}
        </div>
      </div>
    </div>
  );
}
