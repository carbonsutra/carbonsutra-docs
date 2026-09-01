import { useMemo, useState } from "react";
import "../styles.css";

type Tab = "params" | "authorization" | "body" | "headers";

type ApiField = {
  name: string;
  type?: "text" | "number" | "select";
  fieldType?: "query" | "path" | "form";
  required?: boolean;
  defaultValue?: string;
  options?: string[];
};

type ApiDefinition = {
  name: string;
  method: string;
  endpoint: string;
  description?: string;
  requiresAuth?: boolean;
  fields?: ApiField[];
};

const APIs: ApiDefinition[] = [
  {
    name: "Flight Estimation",
    method: "POST",
    endpoint: "/api/v1/flight_estimate",
    description: "Calculate business flight emissions.",
    requiresAuth: true,
    fields: [
      {
        name: "iata_airport_from",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: "",
      },
      {
        name: "iata_airport_to",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: "",
      },
      {
        name: "flight_class",
        fieldType: "query",
        type: "select",
        defaultValue: "Economy",
        options: ["Economy", "Premium", "Business", "First"],
      },
      {
        name: "round_trip",
        fieldType: "query",
        type: "select",
        defaultValue: "false",
        options: ["true", "false"],
      },
      {
        name: "number_of_passengers",
        fieldType: "query",
        type: "number",
        defaultValue: "1",
      },
      {
        name: "add_rf",
        fieldType: "query",
        type: "select",
        defaultValue: "false",
        options: ["true", "false"],
      },
      {
        name: "include_wtt",
        fieldType: "query",
        type: "select",
        defaultValue: "false",
        options: ["true", "false"],
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },

  {
    name: "Hotel Estimation",
    method: "POST",
    endpoint: "/api/v1/hotel_estimate",
    description: "Calculate hotel-stay emissions.",
    requiresAuth: true,
    fields: [
      {
        name: "country_code",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: "JP",
      },
      {
        name: "city_name",
        fieldType: "query",
        type: "text",
        defaultValue: "Tokyo",
      },
      {
        name: "hotel_rating",
        fieldType: "query",
        type: "select",
        defaultValue: "4",
        options: ["2", "3", "4", "5"],
      },
      {
        name: "number_of_nights",
        fieldType: "query",
        type: "number",
        defaultValue: "1",
      },
      {
        name: "number_of_rooms",
        fieldType: "query",
        type: "number",
        defaultValue: "1",
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },

  {
    name: "Vehicle Estimation by Type",
    method: "POST",
    endpoint: "/api/v1/vehicle_estimate_by_type",
    description: "Calculate vehicle emissions by vehicle type.",
    requiresAuth: false,
    fields: [
      {
        name: "vehicle_type",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: "Car-Type-Supermini",
      },
      {
        name: "distance_unit",
        fieldType: "query",
        type: "select",
        defaultValue: "km",
        options: ["km", "mi"],
      },
      {
        name: "distance_value",
        fieldType: "query",
        type: "number",
        defaultValue: "1",
      },
      {
        name: "fuel_type",
        fieldType: "query",
        type: "select",
        defaultValue: "Unknown",
        options: ["Diesel", "Petrol", "PHEV", "BEV", "Unknown"],
      },
      {
        name: "include_wtt",
        fieldType: "query",
        type: "select",
        defaultValue: "false",
        options: ["true", "false"],
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },

  {
    name: "Vehicle Estimation by Model",
    method: "POST",
    endpoint: "/api/v1/vehicle_estimate_by_model",
    description: "Calculate vehicle emissions by make and model.",
    requiresAuth: true,
    fields: [
      {
        name: "vehicle_make",
        fieldType: "query",
        type: "text",
        required: true,
      },
      {
        name: "vehicle_model",
        fieldType: "query",
        type: "text",
        required: true,
      },
      {
        name: "distance_unit",
        fieldType: "query",
        type: "select",
        defaultValue: "km",
        options: ["km", "mi"],
      },
      {
        name: "distance_value",
        fieldType: "query",
        type: "number",
        defaultValue: "1",
      },
      {
        name: "fuel_type",
        fieldType: "query",
        type: "select",
        defaultValue: "Unknown",
        options: ["Diesel", "Petrol", "PHEV", "BEV", "Unknown"],
      },
      {
        name: "include_wtt",
        fieldType: "query",
        type: "select",
        defaultValue: "false",
        options: ["true", "false"],
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },

  {
    name: "Electricity Estimation",
    method: "POST",
    endpoint: "/api/v1/electricity_estimate",
    description: "Calculate electricity-consumption emissions.",
    requiresAuth: true,
    fields: [
      {
        name: "country_code",
        fieldType: "query",
        type: "text",
        required: true,
      },
      {
        name: "consumption_unit",
        fieldType: "query",
        type: "select",
        defaultValue: "kwh",
        options: ["kwh", "mwh"],
      },
      {
        name: "consumption_value",
        fieldType: "query",
        type: "number",
        defaultValue: "1",
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },

  {
    name: "Fuel Estimation",
    method: "POST",
    endpoint: "/api/v1/fuel_estimate",
    description: "Calculate fuel-consumption emissions.",
    requiresAuth: true,
    fields: [
      {
        name: "fuel_type",
        fieldType: "query",
        type: "text",
        required: true,
      },
      {
        name: "fuel_unit",
        fieldType: "query",
        type: "text",
        required: true,
      },
      {
        name: "fuel_value",
        fieldType: "query",
        type: "number",
        required: true,
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },

  {
    name: "Freight Estimation",
    method: "POST",
    endpoint: "/api/v1/freight_estimate",
    description: "Calculate freight and shipment emissions.",
    requiresAuth: true,
    fields: [],
  },

  {
    name: "eCommerce Estimation",
    method: "POST",
    endpoint: "/api/v1/ecommerce_estimate",
    description: "Calculate eCommerce shipment emissions.",
    requiresAuth: true,
    fields: [],
  },

  {
    name: "SEFR Estimation",
    method: "POST",
    endpoint: "/api/v1/sefr_estimation",
    description:
      "Calculate emissions using the Singapore Emission Factors Registry.",
    requiresAuth: true,
    fields: [
      {
        name: "category",
        fieldType: "form",
        type: "text",
        required: true,
        defaultValue: "Land Transport",
      },
      {
        name: "activity",
        fieldType: "form",
        type: "text",
        required: true,
        defaultValue: "Hybrid Car",
      },
      {
        name: "value",
        fieldType: "form",
        type: "number",
        required: true,
        defaultValue: "8",
      },
    ],
  },

  {
    name: "Vehicle Makes",
    method: "GET",
    endpoint: "/api/v1/vehicle_makes",
    description: "List supported vehicle manufacturers.",
    requiresAuth: true,
    fields: [],
  },

  {
    name: "Vehicle Models",
    method: "GET",
    endpoint: "/api/v1/vehicle_makes/{vehicle_make}/vehicle_models",
    description: "List models for a vehicle manufacturer.",
    requiresAuth: true,
    fields: [
      {
        name: "vehicle_make",
        fieldType: "path",
        type: "text",
        required: true,
      },
    ],
  },

  {
    name: "Nearest Airport from Airport",
    method: "GET",
    endpoint: "/api/v1/nearest-airport-from-another-airport",
    description: "Find the nearest airport from another airport.",
    requiresAuth: false,
    fields: [],
  },

  {
    name: "Nearest Airport",
    method: "GET",
    endpoint: "/api/v1/nearest-airport",
    description: "Find the nearest airport from a postal code.",
    requiresAuth: false,
    fields: [],
  },

  {
    name: "Distance Between Airports",
    method: "GET",
    endpoint: "/api/v1/distance-between-airports",
    description: "Calculate distance between two airports.",
    requiresAuth: false,
    fields: [],
  },

  {
    name: "Airports by Keyword",
    method: "GET",
    endpoint: "/api/v1/airports-by-keyword",
    description: "Search airports by keyword.",
    requiresAuth: false,
    fields: [],
  },

  {
    name: "Estimated Flight Time",
    method: "GET",
    endpoint: "/api/v1/estimated-flight-time",
    description: "Estimate flight time between airports.",
    requiresAuth: false,
    fields: [],
  },

  {
    name: "Register API Key",
    method: "POST",
    endpoint: "/api/v1/register_key",
    description: "Register for a CarbonSutra API key.",
    requiresAuth: false,
    fields: [],
  },

  {
    name: "Retrieve API Key",
    method: "POST",
    endpoint: "/api/v1/retrieve_key",
    description: "Retrieve an existing CarbonSutra API key.",
    requiresAuth: false,
    fields: [],
  },

  {
    name: "Cluster Data",
    method: "GET",
    endpoint: "/api/v1/cluster_data",
    description: "Retrieve emissions grouped under an emission cluster.",
    requiresAuth: true,
    fields: [],
  },
];

export default function ApiPlayground() {
  const [selectedApi, setSelectedApi] = useState(0);
  const [endpoint, setEndpoint] = useState(APIs[0].endpoint);
  const [values, setValues] = useState<Record<string, string>>(
    getInitialValues(APIs[0]),
  );

  const [token, setToken] = useState("");
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
    setResponse("");
    setStatus("");
    setResponseTime("");
    setActiveTab("params");
  };

  const updateValue = (name: string, value: string) => {
    setValues((previous) => ({
      ...previous,
      [name]: value,
    }));
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
    const baseUrl = import.meta.env.VITE_API_URL;

    if (!baseUrl) {
      throw new Error("VITE_API_URL is not configured.");
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

    const start = performance.now();

    try {
      const url = buildUrl();

      const headers: Record<string, string> = {};

      if (api.requiresAuth && token.trim()) {
        headers.Authorization = token.startsWith("Bearer ")
          ? token
          : `Bearer ${token}`;
      }

      let requestBody: BodyInit | undefined;

      if (formFields.length > 0) {
        const formData = new FormData();

        formFields.forEach((field) => {
          const value = values[field.name];

          if (value !== undefined) {
            formData.append(field.name, value);
          }
        });

        requestBody = formData;
      }

      const res = await fetch(url, {
        method: api.method,
        headers,
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
              <p className="m-0 truncate text-xs opacity-60">
                {api.description}
              </p>
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
                Configure credentials for this request.
              </p>

              {!api.requiresAuth ? (
                <div className="mt-4 rounded-md border p-4 text-xs opacity-60">
                  This endpoint does not require authentication.
                </div>
              ) : (
                <div className="mt-4 rounded-md border">
                  <div className="flex items-center border-b bg-muted/20 px-3 py-2">
                    <span className="text-xs font-medium">Bearer Token</span>
                  </div>

                  <div className="p-3">
                    <label className="mb-1.5 block text-[11px] font-medium opacity-70">
                      Token
                    </label>

                    <input
                      type="password"
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      placeholder="Enter API key"
                      className="h-9 w-full rounded-md border bg-background px-3 font-mono text-xs outline-none focus:ring-1"
                    />

                    <p className="mt-2 text-[10px] opacity-50">
                      The token will be sent as:
                      <span className="ml-1 font-mono">
                        Authorization: Bearer &lt;token&gt;
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "body" && (
            <div>
              <div className="mb-3">
                <h3 className="m-0 text-xs font-semibold">Request Body</h3>

                <p className="m-0 mt-1 text-[11px] opacity-50">
                  {formFields.length
                    ? "multipart/form-data"
                    : api.method === "GET"
                      ? "This request does not use a body."
                      : "No request body parameters are defined."}
                </p>
              </div>

              {formFields.length === 0 ? (
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
                      onChange={(value) => updateValue(field.name, value)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "headers" && (
            <div>
              <h3 className="m-0 text-xs font-semibold">Request Headers</h3>

              <p className="mt-1 text-[11px] opacity-50">
                Headers generated automatically for this request.
              </p>

              <div className="mt-4 overflow-hidden rounded-md border">
                {api.requiresAuth && (
                  <div className="grid grid-cols-2 border-b px-3 py-2.5 font-mono text-xs">
                    <span className="opacity-60">Authorization</span>

                    <span className="truncate opacity-60">
                      {token ? "Bearer •••••••••" : "Not configured"}
                    </span>
                  </div>
                )}

                {formFields.length > 0 && (
                  <div className="grid grid-cols-2 px-3 py-2.5 font-mono text-xs">
                    <span className="opacity-60">Content-Type</span>

                    <span className="opacity-60">multipart/form-data</span>
                  </div>
                )}

                {!api.requiresAuth && formFields.length === 0 && (
                  <div className="px-3 py-4 text-xs opacity-50">
                    No additional headers are required.
                  </div>
                )}
              </div>
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
  onChange,
}: {
  field: ApiField;
  value: string;
  onChange: (value: string) => void;
}) {
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
      </div>

      <div className="px-3 py-1.5">
        {field.type === "select" ? (
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-full rounded border-0 bg-transparent px-1 text-xs outline-none"
          >
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={field.type ?? "text"}
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

  api.fields?.forEach((field) => {
    values[field.name] = field.defaultValue ?? "";
  });

  return values;
}
