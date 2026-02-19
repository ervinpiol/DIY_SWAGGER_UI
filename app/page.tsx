"use client";

import React, { useState } from "react";
import { apiSpec, ApiSection, ApiEndpoint, Method } from "@/lib/api-spec";
import {
  ChevronDown,
  ChevronRight,
  Search,
  Menu,
  Hash,
  Copy,
  Check,
  Server,
  Lock,
  Unlock,
} from "lucide-react";
import clsx from "clsx";

const methodStyles = {
  GET: {
    wrapper: "bg-blue-50/50 border-blue-200",
    badge: "bg-blue-600 text-white",
    text: "text-blue-700",
    accent: "border-blue-200 bg-blue-50 text-blue-900",
  },
  POST: {
    wrapper: "bg-green-50/50 border-green-200",
    badge: "bg-green-600 text-white",
    text: "text-green-700",
    accent: "border-green-200 bg-green-50 text-green-900",
  },
  PUT: {
    wrapper: "bg-orange-50/50 border-orange-200",
    badge: "bg-orange-500 text-white",
    text: "text-orange-700",
    accent: "border-orange-200 bg-orange-50 text-orange-900",
  },
  DELETE: {
    wrapper: "bg-red-50/50 border-red-200",
    badge: "bg-red-600 text-white",
    text: "text-red-700",
    accent: "border-red-200 bg-red-50 text-red-900",
  },
  PATCH: {
    wrapper: "bg-yellow-50/50 border-yellow-200",
    badge: "bg-yellow-500 text-white",
    text: "text-yellow-700",
    accent: "border-yellow-200 bg-yellow-50 text-yellow-900",
  },
};

const EndpointCard = ({ endpoint }: { endpoint: ApiEndpoint }) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = methodStyles[endpoint.method] || methodStyles.GET;

  const copyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(endpoint.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={clsx(
        "rounded-lg border overflow-hidden transition-all duration-200",
        styles.wrapper,
      )}
    >
      <div
        className="flex items-center gap-4 p-3 cursor-pointer hover:bg-white/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span
          className={clsx(
            "px-5 py-1.5 rounded text-sm font-bold min-w-[80px] text-center shadow-sm",
            styles.badge,
          )}
        >
          {endpoint.method}
        </span>

        <span className="font-mono text-sm font-semibold text-zinc-700">
          {endpoint.path}
        </span>

        <span className="text-sm text-zinc-600 font-medium flex-1 truncate">
          {endpoint.summary}
        </span>

        <div className="flex items-center gap-2">
          <button
            className="p-1.5 text-zinc-400 hover:text-zinc-600 transition-colors"
            onClick={copyPath}
            title="Copy path"
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-600" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
          <Lock className="w-4 h-4 text-zinc-400" />
        </div>
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="pt-4 border-t border-zinc-200/50 text-sm text-zinc-600 space-y-6">
            <p>{endpoint.description}</p>

            {/* Parameters Section */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 font-semibold text-xs uppercase tracking-wider text-zinc-500">
                  Parameters
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        <th className="px-4 py-2 font-medium text-zinc-700 w-32">
                          Name
                        </th>
                        <th className="px-4 py-2 font-medium text-zinc-700 w-24">
                          In
                        </th>
                        <th className="px-4 py-2 font-medium text-zinc-700 w-20">
                          Req
                        </th>
                        <th className="px-4 py-2 font-medium text-zinc-700">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.parameters.map((param, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50"
                        >
                          <td className="px-4 py-2 font-mono text-zinc-800">
                            {param.name}
                          </td>
                          <td className="px-4 py-2 text-zinc-500">
                            {param.in}
                          </td>
                          <td className="px-4 py-2">
                            {param.required ? (
                              <span className="text-red-500 font-bold text-xs">
                                Yes
                              </span>
                            ) : (
                              <span className="text-zinc-400 text-xs">No</span>
                            )}
                          </td>
                          <td className="px-4 py-2 text-zinc-600">
                            <div>{param.description}</div>
                            <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                              {param.type}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request Body Section */}
            {endpoint.requestBody && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-zinc-800">
                    Request Body
                  </span>
                  <span className="text-xs text-zinc-500 font-mono">
                    application/json
                  </span>
                </div>
                <div className="bg-zinc-900 rounded-lg p-4 overflow-x-auto shadow-sm">
                  <pre className="text-xs font-mono text-zinc-100">
                    {JSON.stringify(
                      endpoint.requestBody.content["application/json"].example,
                      null,
                      2,
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* Responses Section */}
            {endpoint.responses && endpoint.responses.length > 0 && (
              <div className="bg-white rounded-lg border border-zinc-200 overflow-hidden">
                <div className="px-4 py-2 bg-zinc-50 border-b border-zinc-200 font-semibold text-xs uppercase tracking-wider text-zinc-500">
                  Responses
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-100">
                        <th className="px-4 py-2 font-medium text-zinc-700 w-24">
                          Code
                        </th>
                        <th className="px-4 py-2 font-medium text-zinc-700">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.responses.map((resp, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-zinc-50 last:border-0 hover:bg-zinc-50/50"
                        >
                          <td className="px-4 py-2">
                            <span
                              className={clsx(
                                "px-2 py-0.5 rounded text-xs font-bold",
                                resp.status >= 200 && resp.status < 300
                                  ? "bg-green-100 text-green-700"
                                  : resp.status >= 400 && resp.status < 500
                                    ? "bg-orange-100 text-orange-700"
                                    : "bg-red-100 text-red-700",
                              )}
                            >
                              {resp.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-zinc-600">
                            {resp.description}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {endpoint.tags && endpoint.tags.length > 0 && (
              <div className="flex gap-2 pt-2">
                {endpoint.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-zinc-500 flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-zinc-200"
                  >
                    <Hash className="w-3 h-3" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function ApiDocumentation() {
  const [activeSection, setActiveSection] = useState<string>(apiSpec[0].title);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const filteredSpec = apiSpec
    .map((section) => ({
      ...section,
      endpoints: section.endpoints.filter(
        (ep) =>
          ep.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ep.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ep.description?.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    }))
    .filter((section) => section.endpoints.length > 0);

  const scrollToSection = (title: string) => {
    setActiveSection(title);
    const element = document.getElementById(title);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-zinc-200 z-50 flex items-center px-4 lg:px-8 justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 text-zinc-500 hover:text-zinc-900"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-zinc-800">
            <span className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <Server className="w-5 h-5" />
            </span>
            Mitsui Financial API
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search endpoints..."
              className="w-full pl-10 pr-4 py-2 bg-zinc-100 border border-zinc-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-green-600 text-green-600 rounded-md font-bold text-sm hover:bg-green-50 transition-colors">
            Authorize
            <Unlock className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="pt-16 flex">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-72 p-6 lg:p-12 max-w-6xl mx-auto">
          {filteredSpec.length === 0 ? (
            <div className="text-center py-20 text-zinc-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <p className="text-lg">
                No endpoints found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredSpec.map((section) => (
                <section
                  key={section.title}
                  id={section.title}
                  className="scroll-mt-24"
                >
                  <div className="mb-6 flex items-baseline gap-4 border-b border-zinc-200 pb-2">
                    <h2 className="text-2xl font-bold text-zinc-800">
                      {section.title}
                    </h2>
                    <p className="text-zinc-500 text-sm">
                      {section.description}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {section.endpoints.map((endpoint, idx) => (
                      <EndpointCard
                        key={`${endpoint.method}-${endpoint.path}-${idx}`}
                        endpoint={endpoint}
                      />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}

          <footer className="mt-20 pt-8 border-t border-zinc-200 text-center text-zinc-400 text-sm">
            <p>
              © {new Date().getFullYear()} Mitsui Financial Bank API
              Documentation
            </p>
          </footer>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
