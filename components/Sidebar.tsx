"use client";

import React from "react";
import { Search } from "lucide-react";
import clsx from "clsx";
import { apiSpec, ApiEndpoint } from "@/lib/api-spec";
import { methodStyles } from "@/lib/utils";

interface SidebarProps {
  isSidebarOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeSection: string;
  scrollToSection: (title: string) => void;
  handleEndpointClick: (endpoint: ApiEndpoint) => void;
}

const Sidebar = ({
  isSidebarOpen,
  searchQuery,
  setSearchQuery,
  activeSection,
  scrollToSection,
  handleEndpointClick,
}: SidebarProps) => {
  return (
    <aside
      className={clsx(
        "fixed inset-y-0 left-0 pt-16 w-72 bg-zinc-50 border-r border-zinc-200 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="p-6">
        <div className="md:hidden mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 border border-zinc-200 rounded-lg text-sm outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <nav className="space-y-6">
          {apiSpec.map((section) => (
            <div key={section.title}>
              <button
                onClick={() => scrollToSection(section.title)}
                className={clsx(
                  "text-xs font-bold uppercase tracking-wider mb-3 w-full text-left transition-colors flex items-center gap-2",
                  activeSection === section.title
                    ? "text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 p-1",
                )}
              >
                {section.title}
              </button>
              <ul className="space-y-px">
                {section.endpoints.map((ep, idx) => (
                  <li key={`${ep.method}-${ep.path}-${idx}`}>
                    <a
                      href={`#`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEndpointClick(ep);
                      }}
                      className={clsx(
                        "text-[13px] block px-3 py-1.5 rounded-md truncate transition-colors border-l-2 border-transparent",
                        "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100",
                      )}
                    >
                      <span
                        className={clsx(
                          "text-[10px] font-bold mr-2 inline-block w-10 text-right",
                          methodStyles[ep.method]?.text || "text-zinc-500",
                        )}
                      >
                        {ep.method}
                      </span>
                      {ep.summary}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
