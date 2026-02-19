"use client";

import React, { useState } from "react";
import { apiSpec, ApiEndpoint } from "@/lib/api-spec";
import { Search, Menu, Server, Unlock } from "lucide-react";
import { getEndpointId } from "@/lib/utils";
import EndpointCard from "@/components/EndpointCard";
import Sidebar from "@/components/Sidebar";

export default function ApiDocumentation() {
  const [activeSection, setActiveSection] = useState<string>(apiSpec[0].title);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedEndpointId, setSelectedEndpointId] = useState<string | null>(
    null,
  );

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

  const handleEndpointClick = (endpoint: ApiEndpoint) => {
    setSearchQuery(""); // Clear search to ensure item is visible
    const id = getEndpointId(endpoint.method, endpoint.path);
    setSelectedEndpointId(id);
    setIsSidebarOpen(false);

    // Update active section based on the endpoint
    const section = apiSpec.find((s) => s.endpoints.includes(endpoint));
    if (section) {
      setActiveSection(section.title);
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
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
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeSection={activeSection}
          scrollToSection={scrollToSection}
          handleEndpointClick={handleEndpointClick}
        />

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
                        selectedEndpointId={selectedEndpointId}
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
