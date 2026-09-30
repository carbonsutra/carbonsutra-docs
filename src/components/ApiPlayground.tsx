import { useMemo, useState } from "react";
import "../styles.css";

import {
  APIs,
  FUEL_NAMES_BY_USAGE,
  VEHICLE_MODELS_BY_MAKE,
  SEFR_ACTIVITIES_BY_CATEGORY,
} from "../libs/api-playground-data";

import type {
  ApiDefinition,
  ApiField,
  FieldDependency,
} from "../libs/api-playground-data";

type Tab = "params" | "authorization" | "body" | "headers";

type FuelUsage = keyof typeof FUEL_NAMES_BY_USAGE;
type VehicleMake = keyof typeof VEHICLE_MODELS_BY_MAKE;
type SefrCategory = keyof typeof SEFR_ACTIVITIES_BY_CATEGORY;

const isFuelUsage = (value: string): value is FuelUsage => {
  return value in FUEL_NAMES_BY_USAGE;
};

const getDependentOptions = (
  dependency: FieldDependency,
  values: Record<string, string>,
): readonly string[] => {
  switch (dependency) {
    case "fuel_usage": {
      const fuelUsage = values.fuel_usage;

      if (!fuelUsage || !isFuelUsage(fuelUsage)) {
        return [];
      }

      return FUEL_NAMES_BY_USAGE[fuelUsage];
    }

    case "vehicle_make": {
      const vehicleMake = values.vehicle_make;

      if (!vehicleMake || !(vehicleMake in VEHICLE_MODELS_BY_MAKE)) {
        return [];
      }

      return VEHICLE_MODELS_BY_MAKE[vehicleMake];
    }

    case "category": {
      const category = values.category;

      if (!category || !(category in SEFR_ACTIVITIES_BY_CATEGORY)) {
        return [];
      }

      return SEFR_ACTIVITIES_BY_CATEGORY[
        category as keyof typeof SEFR_ACTIVITIES_BY_CATEGORY
      ];
    }

    default:
      return [];
  }
};

export default function ApiPlayground() {
  const [selectedApi, setSelectedApi] = useState(0);
  const [endpoint, setEndpoint] = useState(APIs[0].endpoint);
  const [values, setValues] = useState<Record<string, string>>(
    getInitialValues(APIs[0]),
  );
  const [jsonBody, setJsonBody] = useState(APIs[0].bodyExample ?? "");

  const [token, setToken] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({
    Accept: "application/json",
  });
  const [activeTab, setActiveTab] = useState<Tab>("params");

  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [loading, setLoading] = useState(false);

  const api = APIs[selectedApi];

  const queryFields = useMemo(
    () =>
      api.fields?.filter(
        (field) => !field.fieldType || field.fieldType === "query",
      ) ?? [],
    [api],
  );

  const pathFields = useMemo(
    () => api.fields?.filter((field) => field.fieldType === "path") ?? [],
    [api],
  );

  const formFields = useMemo(
    () => api.fields?.filter((field) => field.fieldType === "form") ?? [],
    [api],
  );

  const handleApiChange = (index: number) => {
    setSelectedApi(index);
    setEndpoint(APIs[index].endpoint);
    setValues(getInitialValues(APIs[index]));
    setJsonBody(APIs[index].bodyExample ?? "");
    setResponse("");
    setStatus("");
    setResponseTime("");
    setActiveTab("params");

    setHeaders({
      Accept: "application/json",
    });
  };

  const updateValue = (name: string, value: string) => {
    setValues((previous) => {
      const updated = {
        ...previous,
        [name]: value,
      };

      const fields = api.fields ?? [];

      fields.forEach((field) => {
        if (field.dependsOn !== name) {
          return;
        }

        const options = getDependentOptions(field.dependsOn, updated);

        updated[field.name] = options[0] ?? "";
      });

      return updated;
    });
  };

  const buildEndpoint = () => {
    let finalEndpoint = endpoint;

    pathFields.forEach((field) => {
      finalEndpoint = finalEndpoint.replace(
        `{${field.name}}`,
        encodeURIComponent(values[field.name] ?? ""),
      );
    });

    return finalEndpoint;
  };

  const buildUrl = () => {
    const baseUrl = import.meta.env.ZUDOKU_PUBLIC_API_URL;

    if (!baseUrl) {
      throw new Error("ZUDOKU_PUBLIC_API_URL is not configured.");
    }

    const endpoint = buildEndpoint();
    const params = new URLSearchParams();

    queryFields.forEach((field) => {
      const value = values[field.name];

      if (value !== undefined && value !== "") {
        params.append(field.name, value);
      }
    });

    const query = params.toString();

    return (
      `${baseUrl.replace(/\/$/, "")}${endpoint}` + (query ? `?${query}` : "")
    );
  };

  const sendRequest = async () => {
    setLoading(true);
    setResponse("");
    setStatus("");
    setResponseTime("");

    if (!token.trim()) {
      setStatus("Authorization Required");
      setResponse(
        "An API token in the Authorization header is required to test this endpoint.",
      );
      setLoading(false);
      return;
    }

    const start = performance.now();

    try {
      const url = buildUrl();

      const requestHeaders: Record<string, string> = {
        Accept: "application/json",
        ...headers,
      };

      if (token.trim()) {
        requestHeaders.Authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      }

      let requestBody: BodyInit | undefined;

      if (api.jsonBody) {
        requestBody = jsonBody;
        requestHeaders["Content-Type"] = "application/json";
      } else if (formFields.length > 0) {
        const formData = new FormData();

        formFields.forEach((field) => {
          const value = values[field.name];

          if (value !== undefined) {
            formData.append(field.name, value);
          }
        });

        requestBody = formData;
        delete requestHeaders["Content-Type"];
      }

      const res = await fetch(url, {
        method: api.method,
        headers: requestHeaders,
        body: requestBody,
      });

      const elapsed = Math.round(performance.now() - start);

      setResponseTime(`${elapsed} ms`);
      setStatus(`${res.status} ${res.statusText}`);

      const contentType = res.headers.get("content-type") ?? "";

      if (contentType.includes("application/json")) {
        const data = await res.json();
        setResponse(JSON.stringify(data, null, 2));
      } else {
        setResponse(await res.text());
      }
    } catch (error) {
      const elapsed = Math.round(performance.now() - start);

      setResponseTime(`${elapsed} ms`);
      setStatus("Request Failed");

      setResponse(
        error instanceof Error
          ? error.message
          : "Something went wrong while sending the request.",
      );
    } finally {
      setLoading(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    {
      id: "params",
      label: `Params${queryFields.length ? ` (${queryFields.length})` : ""}`,
    },
    {
      id: "authorization",
      label: "Authorization",
    },
    {
      id: "body",
      label: `Body${formFields.length ? ` (${formFields.length})` : ""}`,
    },
    {
      id: "headers",
      label: "Headers",
    },
  ];

  return (
    <div className="not-prose my-6 api-playground-container w-screen max-w-none">
      <div className="w-full min-w-0 overflow-hidden rounded-lg border bg-background shadow-sm">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div>
            <h2 className="m-0 text-base font-semibold">API Playground</h2>

            <p className="m-0 mt-0.5 text-xs opacity-60">
              Send requests and inspect API responses
            </p>
          </div>
        </div>

        <div className="border-b bg-muted/20 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-full max-w-sm">
              <select
                value={selectedApi}
                onChange={(e) => handleApiChange(Number(e.target.value))}
                className="h-9 w-full rounded-md border bg-background px-3 text-sm font-medium outline-none focus:ring-1"
              >
                {APIs.map((item, index) => (
                  <option key={item.name} value={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden min-w-0 flex-1 md:block">
              <p className="m-0 text-xs opacity-60">{api.description}</p>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4">
          <div className="flex h-10">
            <div className="flex items-center rounded-l-md border border-r-0 bg-muted/30 px-3">
              <span
                className={`font-mono text-xs font-bold ${
                  api.method === "GET"
                    ? "text-green-600"
                    : api.method === "POST"
                      ? "text-blue-600"
                      : "text-orange-600"
                }`}
              >
                {api.method}
              </span>
            </div>

            <div className="min-w-0 flex-1 border">
              <input
                value={endpoint}
                onChange={(e) => setEndpoint(e.target.value)}
                className="h-full w-full bg-background px-3 font-mono text-xs outline-none"
                placeholder="/api/v1/example"
              />
            </div>

            <button
              onClick={sendRequest}
              disabled={loading}
              className="rounded-r-md border border-l-0 px-5 text-sm font-semibold transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        <div className="mt-4 border-b px-4">
          <div className="flex gap-5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative pb-2.5 text-xs font-medium transition ${
                  activeTab === tab.id
                    ? "opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                {tab.label}

                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-foreground" />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="min-h-[220px] px-4 py-4">
          {activeTab === "params" && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="m-0 text-xs font-semibold">
                    Query Parameters
                  </h3>

                  <p className="m-0 mt-1 text-[11px] opacity-50">
                    Parameters will be appended to the request URL.
                  </p>
                </div>
              </div>

              {queryFields.length === 0 ? (
                <EmptyState text="This endpoint does not have query parameters." />
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <div className="grid grid-cols-[24px_1fr_1fr] border-b bg-muted/30 px-3 py-2 text-[10px] font-medium uppercase tracking-wide opacity-60">
                    <span />
                    <span>Parameter</span>
                    <span>Value</span>
                  </div>

                  {queryFields.map((field) => (
                    <ParameterRow
                      key={field.name}
                      field={field}
                      value={values[field.name] ?? ""}
                      values={values}
                      onChange={(value) => updateValue(field.name, value)}
                    />
                  ))}
                </div>
              )}

              {pathFields.length > 0 && (
                <div className="mt-5">
                  <h3 className="mb-2 text-xs font-semibold">
                    Path Parameters
                  </h3>

                  <div className="overflow-hidden rounded-md border">
                    <div className="grid grid-cols-[24px_1fr_1fr] border-b bg-muted/30 px-3 py-2 text-[10px] font-medium uppercase tracking-wide opacity-60">
                      <span />
                      <span>Parameter</span>
                      <span>Value</span>
                    </div>

                    {pathFields.map((field) => (
                      <ParameterRow
                        key={field.name}
                        field={field}
                        value={values[field.name] ?? ""}
                        values={values}
                        onChange={(value) => updateValue(field.name, value)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "authorization" && (
            <div className="w-full min-w-0">
              <h3 className="m-0 text-xs font-semibold">Authorization</h3>

              <p className="mt-1 text-[11px] opacity-50">
                An API token in the Authorization header is required to test
                this endpoint.
              </p>

              <div className="mt-4 rounded-md border">
                <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2">
                  <span className="text-xs font-medium">Bearer Token</span>

                  {token && (
                    <span className="text-[10px] text-green-600">
                      Configured
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <label className="mb-1.5 block text-[11px] font-medium opacity-70">
                    Bearer Token
                  </label>

                  <input
                    type="input"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter your Bearer token"
                    className="h-9 w-full rounded-md border bg-background px-3 font-mono text-xs outline-none focus:ring-1"
                  />

                  <p className="mt-2 text-[10px] opacity-50">
                    Sent as:
                    <span className="ml-1 font-mono">
                      Authorization: Bearer &lt;token&gt;
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "body" && (
            <div>
              <div className="mb-3">
                <h3 className="m-0 text-xs font-semibold">Request Body</h3>

                <p className="m-0 mt-1 text-[11px] opacity-50">
                  {api.jsonBody
                    ? "application/json"
                    : formFields.length
                      ? "multipart/form-data"
                      : api.method === "GET"
                        ? "This request does not use a body."
                        : "No request body parameters are defined."}
                </p>
              </div>

              {api.jsonBody ? (
                <div className="overflow-hidden rounded-md border">
                  <textarea
                    value={jsonBody}
                    onChange={(e) => setJsonBody(e.target.value)}
                    className="min-h-[280px] w-full resize-y bg-background p-4 font-mono text-xs leading-relaxed outline-none"
                    spellCheck={false}
                  />
                </div>
              ) : formFields.length === 0 ? (
                <EmptyState
                  text={
                    api.method === "GET"
                      ? "GET requests do not use a request body."
                      : "This endpoint does not have body parameters."
                  }
                />
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <div className="grid grid-cols-[24px_1fr_1fr] border-b bg-muted/30 px-3 py-2 text-[10px] font-medium uppercase tracking-wide opacity-60">
                    <span />
                    <span>Key</span>
                    <span>Value</span>
                  </div>

                  {formFields.map((field) => (
                    <ParameterRow
                      key={field.name}
                      field={field}
                      value={values[field.name] ?? ""}
                      values={values}
                      onChange={(value) => updateValue(field.name, value)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "headers" && (
            <div>
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <h3 className="m-0 text-xs font-semibold">Request Headers</h3>

                  <p className="mt-1 text-[11px] opacity-50">
                    Headers will be sent with every request.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setHeaders((previous) => ({
                      ...previous,
                      "": "",
                    }))
                  }
                  className="rounded-md border px-2.5 py-1.5 text-[10px] font-medium transition hover:bg-muted"
                >
                  + Add Header
                </button>
              </div>

              <div className="overflow-hidden rounded-md border">
                {Object.entries(headers).map(([key, value], index) => (
                  <div
                    key={`${key}-${index}`}
                    className="grid grid-cols-[1fr_1fr_32px] border-b last:border-b-0"
                  >
                    <input
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;

                        setHeaders((previous) => {
                          const updated: Record<string, string> = {};

                          Object.entries(previous).forEach(
                            ([oldKey, oldValue]) => {
                              if (oldKey === key) {
                                updated[newKey] = oldValue;
                              } else {
                                updated[oldKey] = oldValue;
                              }
                            },
                          );

                          return updated;
                        });
                      }}
                      placeholder="Header name"
                      className="h-9 border-r bg-transparent px-3 font-mono text-xs outline-none"
                    />

                    <input
                      value={value}
                      onChange={(e) => {
                        setHeaders((previous) => ({
                          ...previous,
                          [key]: e.target.value,
                        }));
                      }}
                      placeholder="Header value"
                      className="h-9 bg-transparent px-3 font-mono text-xs outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        setHeaders((previous) => {
                          const updated = { ...previous };
                          delete updated[key];
                          return updated;
                        });
                      }}
                      className="flex items-center justify-center text-xs opacity-40 transition hover:text-red-500 hover:opacity-100"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {token.trim() && (
                <div className="mt-3 rounded-md border bg-muted/20 px-3 py-2">
                  <div className="grid grid-cols-2 font-mono text-xs">
                    <span className="opacity-60">Authorization</span>
                    <span className="truncate opacity-60">
                      Bearer •••••••••
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border-t">
          <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold">Response</span>

              {status && (
                <span
                  className={`font-mono text-[11px] ${
                    status.startsWith("2") ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {status}
                </span>
              )}

              {responseTime && (
                <span className="font-mono text-[10px] opacity-50">
                  {responseTime}
                </span>
              )}
            </div>

            {response && (
              <button
                onClick={() => {
                  setResponse("");
                  setStatus("");
                  setResponseTime("");
                }}
                className="text-[10px] opacity-50 hover:opacity-100"
              >
                Clear
              </button>
            )}
          </div>

          {!response ? (
            <div className="flex min-h-[180px] items-center justify-center px-4 py-10 text-center">
              <div>
                <div className="text-xs font-medium opacity-60">
                  No response yet
                </div>

                <div className="mt-1 text-[10px] opacity-40">
                  Configure your request and click Send.
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/[0.02] p-3 dark:bg-white/[0.02]">
              <pre className="max-h-[500px] overflow-auto rounded-md border bg-background p-4 font-mono text-[11px] leading-relaxed">
                {response}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ParameterRow({
  field,
  value,
  values,
  onChange,
}: {
  field: ApiField;
  value: string;
  values: Record<string, string>;
  onChange: (value: string) => void;
}) {
  const options = field.dependsOn
    ? getDependentOptions(field.dependsOn, values)
    : (field.options ?? []);

  return (
    <div className="grid grid-cols-[24px_1fr_1fr] border-b last:border-b-0">
      <div className="flex items-center justify-center">
        <input type="checkbox" defaultChecked className="h-3.5 w-3.5" />
      </div>

      <div className="border-r px-3 py-2.5">
        <div className="font-mono text-xs">{field.name}</div>

        {field.required && (
          <span className="text-[9px] text-red-500">required</span>
        )}

        {field.description && (
          <p className="mt-1 max-w-[34rem] text-[10px] leading-4 opacity-50">
            {field.description}
          </p>
        )}
      </div>

      <div className="px-3 py-1.5">
        {field.type === "select" ? (
          <select
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            disabled={Boolean(field.dependsOn && options.length === 0)}
            className="h-8 w-full rounded border-0 bg-transparent px-1 text-xs outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {options.length === 0 ? (
              <option value="">
                {field.dependsOn
                  ? "Select a dependency first"
                  : "No options available"}
              </option>
            ) : (
              options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))
            )}
          </select>
        ) : (
          <input
            type={
              field.type === "number"
                ? "number"
                : field.type === "email"
                  ? "email"
                  : "text"
            }
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter value"
            className="h-8 w-full border-0 bg-transparent px-1 font-mono text-xs outline-none"
          />
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-md border border-dashed px-4 py-8 text-center text-xs opacity-50">
      {text}
    </div>
  );
}

function getInitialValues(api: ApiDefinition) {
  const values: Record<string, string> = {};

  const fields = api.fields ?? [];

  fields.forEach((field) => {
    values[field.name] = field.defaultValue ?? "";
  });

  fields.forEach((field) => {
    if (field.type !== "select") {
      return;
    }

    if (field.dependsOn) {
      const options = getDependentOptions(field.dependsOn, values);

      if (options.length > 0) {
        const currentValue = values[field.name];

        if (currentValue && options.includes(currentValue)) {
          return;
        }

        values[field.name] = options[0];
      }

      return;
    }

    const options = field.options ?? [];

    if (options.length === 0) {
      return;
    }

    const currentValue = values[field.name];

    if (currentValue && options.includes(currentValue)) {
      return;
    }

    if (field.required) {
      values[field.name] = options[0];
    }
  });

  return values;
}
