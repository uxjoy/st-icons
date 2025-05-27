"use client";

import { useState } from "react";
import IconCard from "./IconCard";

export default function IconsTabView({ iconsByCategory }) {
  const categories = Object.keys(iconsByCategory);
  const [activeTab, setActiveTab] = useState(categories[0]);

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`flex-gro px-4 py-2 text-sm rounded-lg cursor-pointer ease-in-out duration-200 ${
              activeTab === category
                ? "bg-black text-white"
                : "bg-slate-200 text-slate-700 hover:bg-slate-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Icons Grid */}
      <div className="grid grid-cols-8 gap-3">
        {iconsByCategory[activeTab].map((iconPath) => (
          <IconCard key={iconPath} iconName={iconPath} />
        ))}
      </div>
    </div>
  );
}
