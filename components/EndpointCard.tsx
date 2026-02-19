"use client";

import React, { useState, useEffect } from "react";
import { ApiEndpoint } from "@/lib/api-spec";
import { Copy, Check, Lock, Hash } from "lucide-react";
import clsx from "clsx";
import { getEndpointId, methodStyles } from "@/lib/utils";

const EndpointCard = ({
  endpoint,
  selectedEndpointId,
}: {
  endpoint: ApiEndpoint;
  selectedEndpointId: string | null;
}) => {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const styles = methodStyles[endpoint.method] || methodStyles.GET;
  const id = getEndpointId(endpoint.method, endpoint.path);

  useEffect(() => {
    if (selectedEndpointId === id) {
      setIsExpanded(true);
    }
  }, [selectedEndpointId, id]);

  const copyPath = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(endpoint.path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={id}
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

export default EndpointCard;
