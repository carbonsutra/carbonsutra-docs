import { useMemo, useState } from "react";
import "../styles.css";

type Tab = "params" | "authorization" | "body" | "headers";

type ApiField = {
  name: string;
  type?: "text" | "number" | "select";
  fieldType?: "query" | "path" | "form";
  required?: boolean;
  defaultValue?: string;
  description?: string;
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
    name: "Singapore Emission Factor Registry",
    method: "POST",
    endpoint: "/api/v1/sefr_estimation",
    description: "Estimate emissions using Singapore emission factors.",
    requiresAuth: true,
    fields: [
      {
        name: "category",
        type: "text",
        fieldType: "form",
        required: true,
      },
      {
        name: "activity",
        type: "text",
        fieldType: "form",
        required: true,
      },
      {
        name: "value",
        type: "number",
        fieldType: "form",
        required: true,
      },
      {
        name: "cluster_name",
        type: "text",
        fieldType: "form",
        required: false,
      },
    ],
  },
  {
    name: "Flight Estimation",
    method: "POST",
    endpoint: "/api/v1/flight_estimate",
    description:
      "# Emissions from Business Flight Travel\n\nReturns estimated greenhouse gas emissions (CO2e) in multiple units (grams, kilograms, metric tons, pounds) for business travel through flights/air, based on airport codes of arrival and departure, class of flight and number of passengers.\n\nThis calculation is used for reporting Scope 3 emissions for individuals flying for work purposes.",
    requiresAuth: true,
    fields: [
      {
        name: "iata_airport_from",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "iata_airport_to",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "flight_class",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Economy", "Premium", "Business", "First"],
      },
      {
        name: "round_trip",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Y", "N"],
      },
      {
        name: "number_of_passengers",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "add_rf",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Y", "N"],
      },
      {
        name: "include_wtt",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Y", "N"],
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
    description:
      "# Emissions from Hotel Stay\n\nReturns estimated greenhouse gas emissions (CO2e) in grams, kilograms, metric tons, and pounds for a hotel stay. The estimate is based on the hotel's country, city, Expedia star rating, number of nights, and number of rooms.\n\nCarbonSutra calculates hotel-stay emissions using the Cornell Hotel Sustainability Benchmark Index 2026 (CHSB2026) and UK government GHG conversion factors published in 2026. If city-specific regional data is unavailable, the API may apply country-level fallback or proxy data according to CarbonSutra's methodology.\n\noperationId: calculate_emissions_from_hotel_stay",
    requiresAuth: true,
    fields: [
      {
        name: "country_code",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
        description:
          "Two-letter ISO 3166-1 alpha-2 country code where the hotel is located (for example, US, GB, JP).",
      },
      {
        name: "city_name",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
        description:
          "Name of the city where the hotel is located. Leave empty when city-specific data is not available and country-level estimation is appropriate.",
      },
      {
        name: "hotel_rating",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["2", "3", "4", "5"],
        description:
          "Expedia star classification of the hotel. Allowed values are 2, 3, 4, or 5 stars; the API documentation specifies 4 as the default.",
      },
      {
        name: "number_of_nights",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
        description:
          "Total length of the hotel stay measured in nights. The API documentation specifies 1 night as the default.",
      },
      {
        name: "number_of_rooms",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
        description:
          "Number of hotel rooms booked, regardless of how many people stay in each room. The API documentation specifies 1 room as the default.",
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
        description:
          "Optional identifier used to log and aggregate this hotel-emission result through the Cluster Data API.",
      },
    ],
  },
  {
    name: "Vehicle Estimation by Type",
    method: "POST",
    endpoint: "/api/v1/vehicle_estimate_by_type",
    description:
      "# Emissions from Vehicle Usage based on its type\n\nReturns estimated greenhouse gas emissions (CO2e) in grams, kilograms, metric tons, and pounds for travel using a specified vehicle type. The estimate is based on vehicle type, distance travelled, fuel type, and whether Well-to-Tank (WTT) emissions are included.\n\nUse this endpoint when the vehicle make and model are not required or are unknown. CarbonSutra provides vehicle-type-based factors and supports petrol, diesel, plug-in hybrid (PHEV), battery electric (BEV), and unknown fuel categories.\n\noperationId: calculate_emissions_from_vehicle_usage_based_on_type",
    requiresAuth: false,
    fields: [
      {
        name: "vehicle_type",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
        description:
          "Type or size category of the vehicle used for the journey (for example, Car-Type-Supermini).",
      },
      {
        name: "distance_unit",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["km", "mi"],
        description:
          "Unit used for the distance travelled. Use km for kilometers or mi for miles; the API documentation specifies km as the default.",
      },
      {
        name: "distance_value",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
        description:
          "Total distance travelled by the vehicle in the selected distance unit. If undefined, the API sets the value to 1.00.",
      },
      {
        name: "fuel_type",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Diesel", "Petrol", "PHEV", "BEV", "Unknown"],
        description:
          "Fuel or powertrain used by the vehicle. Allowed values are Diesel, Petrol, PHEV, BEV, or Unknown; use Unknown when the fuel type is not known.",
      },
      {
        name: "include_wtt",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Y", "N"],
        description:
          "Controls whether Well-to-Tank (WTT) upstream emissions are included in the estimate. Use Y to include WTT factors or N to exclude them; the API documentation specifies Y as the default.",
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
        description:
          "Optional identifier used to log and aggregate this vehicle-emission result through the Cluster Data API.",
      },
    ],
  },
  {
    name: "Vehicle Estimation by Model",
    method: "POST",
    endpoint: "/api/v1/vehicle_estimate_by_model",
    description:
      "# Emissions from Vehicle Usage based on its Make/Model\n\nReturns estimated greenhouse gas emissions (CO2e) in multiple units (grams, kilograms, metric tons, pounds) for travel in vehicles based on its make and model.\n\n145 Makes and 5,000 models are covered.",
    requiresAuth: true,
    fields: [
      {
        name: "vehicle_make",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "vehicle_model",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "distance_unit",
        fieldType: "query",
        type: "select",
        options: ["km", "mi"],
      },
      {
        name: "distance_value",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
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
    description:
      "# Emissions from Electricity Usage\n\nReturns estimated greenhouse gas emissions (CO2e) in multiple units (grams, kilograms, metric tons, pounds) from electricity usage based on coutnry name and units of electricity consumed.\n\nData from nearly 90 countries for years 2020, 2024 and 2026, from multiple sources has been compiled.\n\noperationId: calculate_emissions_from_electricity_usage",
    requiresAuth: true,
    fields: [
      {
        name: "country_name",
        fieldType: "query",
        type: "text",
      },
      {
        name: "electricity_unit",
        fieldType: "query",
        type: "select",
        options: ["KWh", "MWh", "kwh", "mwh"],
      },
      {
        name: "electricity_value",
        fieldType: "query",
        type: "text",
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
    description:
      "# Emissions from Fuel Consumption\n\nReturns estimated greenhouse gas emissions (CO2e) in multiple units (grams, kilograms, metric tons, pounds) based on usage, fuel name and its value in tonnes.\n\nCarbonSutra computes the emissions from stationary combustion fuels which are burnt in a fixed unit or asset owned or controlled by the reporting organization, and usually reported as a Scope 1 direct emission.",
    requiresAuth: true,
    fields: [
      {
        name: "fuel_usage",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["gas", "liquid", "solid"],
      },
      {
        name: "fuel_name",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "fuel_value",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
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
    description:
      "# Emissions from Freight Shipping\n\nReturns estimated greenhouse gas emissions (CO2e) in multiple units (grams, kilograms, metric tons, pounds) for freight shipments through Road, Rail, Air and Sea (categorized into Short Sea and Deep Sea).\n\nTwo additional calculations for Intermodal shipping are available: 1) Road with Rail and 2) Road with Short Sea.",
    requiresAuth: false,
    fields: [
      {
        name: "transport_mode",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "freight_weight",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "distance_value",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },
  {
    name: "eCommerce Estimation",
    method: "POST",
    endpoint: "/api/v1/ecommerce_estimate",
    description:
      "# Emissions from eCommerce Shipments\n\nReturns estimated greenhouse gas emissions (CO2e) in multiple units (grams, kilograms, metric tons, pounds) for eCommerce shipments.\n\nThis is an advanced algorithm to estimate the emissions of a package's journey from its shipment location to the collection point.",
    requiresAuth: false,
    fields: [
      {
        name: "origin_country_code",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "origin_postal_code",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "destination_country_code",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "destination_postal_code",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "package_weight",
        fieldType: "query",
        type: "text",
        required: true,
        defaultValue: " ",
      },
      {
        name: "add_rf",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Y", "N"],
      },
      {
        name: "include_wtt",
        fieldType: "query",
        type: "select",
        required: true,
        defaultValue: " ",
        options: ["Y", "N"],
      },
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
  },
  {
    name: "Nearest Airport from Airport",
    method: "GET",
    endpoint: "/api/v1/nearest-airport-from-another-airport",
    description:
      "# Airport to Nearest Airport\n\nReturns the distance in kilometers of the closest airport from a given airport code, along with name and IATA code, using Haversine function.\n\noperationId: find_nearest_airport_from_another_airport",
    requiresAuth: false,
    fields: [
      {
        name: "iata_airport_code",
        fieldType: "query",
        type: "text",
      },
      {
        name: "same_country",
        fieldType: "query",
        type: "select",
        options: ["Y", "N"],
      },
    ],
  },
  {
    name: "Nearest Airport",
    method: "GET",
    endpoint: "/api/v1/nearest-airport",
    description:
      "# Postal Code to Nearest Airport\n\nReturns the distance in kilometers bewteen a postal code and the nearlest airport to it, using Haversine function.\n\nThis is an advanced algorithm which takes a postal code and country code as input and returns the nearest airport its latitude/longitude value.",
    requiresAuth: false,
    fields: [
      {
        name: "country_code",
        fieldType: "query",
        type: "text",
      },
      {
        name: "postal_code",
        fieldType: "query",
        type: "text",
      },
    ],
  },
  {
    name: "Distance Between Airports",
    method: "GET",
    endpoint: "/api/v1/distance-between-airports",
    description:
      "# Distance between Two Airports\n\nReturns the distance between two IATA airport codes in kilometers, using Haversine function.\n\noperationId: find_distance_between_two_airports",
    requiresAuth: false,
    fields: [
      {
        name: "iata_airport_from",
        fieldType: "query",
        type: "text",
      },
      {
        name: "iata_airport_to",
        fieldType: "query",
        type: "text",
      },
    ],
  },
  {
    name: "Airports by Keyword",
    method: "GET",
    endpoint: "/api/v1/airports-by-keyword",
    description:
      "# Airports Keywords Search\n\nReturns the lists of airport names and Airport IATA code which matches the keyword.",
    requiresAuth: false,
    fields: [
      {
        name: "keyword",
        fieldType: "query",
        type: "text",
      },
    ],
  },
  {
    name: "Vehicle Makes",
    method: "GET",
    endpoint: "/api/v1/vehicle_makes",
    description:
      "## List of all Vehicle Makes\n\nReturns a list of all vehicle makers and their number of models, which can be used in getting list of models and then estimating footprints.\n\nThis API is primarily used by application developers.",
    requiresAuth: true,
    fields: [],
  },
  {
    name: "Vehicle Models",
    method: "GET",
    endpoint: "/api/v1/vehicle_makes/{vehicle_make}/vehicle_models",
    description:
      "## List of all Models for a specific Vehicle Make\n\nReturns a list of all models for a specific vehicle maker's name.",
    requiresAuth: false,
    fields: [
      {
        name: "vehicle_make",
        fieldType: "query",
        type: "text",
      },
      {
        name: "vehicle_make",
        fieldType: "path",
        type: "text",
        required: true,
      },
    ],
  },
  {
    name: "Estimated Flight Time",
    method: "GET",
    endpoint: "/api/v1/estimated-flight-time",
    description:
      "# Estimated Flight Times between Airports\n\nReturns the estimated travel time through flight between two airports.\n\noperationId: estimate_flight_time_between_airports",
    requiresAuth: false,
    fields: [
      {
        name: "iata_airport_from",
        fieldType: "query",
        type: "text",
      },
      {
        name: "iata_airport_to",
        fieldType: "query",
        type: "text",
      },
    ],
  },
  {
    name: "Register API Key",
    method: "POST",
    endpoint: "/api/v1/register_key",
    description:
      "Registration enables you to get the key and use the function to cluster emissions, using self-defined labels.",
    requiresAuth: false,
    fields: [
      {
        name: "email",
        fieldType: "query",
        type: "text",
      },
      {
        name: "password",
        fieldType: "query",
        type: "text",
      },
      {
        name: "company",
        fieldType: "query",
        type: "text",
      },
      {
        name: "email",
        fieldType: "form",
        type: "text",
        required: true,
        defaultValue: "janice22@contactous.com",
      },
      {
        name: "password",
        fieldType: "form",
        type: "text",
        required: true,
        defaultValue: "A Quick Brown Fox",
      },
      {
        name: "company_name",
        fieldType: "form",
        type: "text",
        required: true,
        defaultValue: "Kruger-Brent Inc.",
      },
    ],
  },
  {
    name: "Retrieve API Key",
    method: "POST",
    endpoint: "/api/v1/retrieve_key",
    description: "This retrieves an already registered key.",
    requiresAuth: false,
    fields: [
      {
        name: "email",
        fieldType: "query",
        type: "text",
      },
      {
        name: "password",
        fieldType: "query",
        type: "text",
      },
      {
        name: "email",
        fieldType: "form",
        type: "text",
        required: true,
        defaultValue: "janice22@contactous.com",
      },
      {
        name: "password",
        fieldType: "form",
        type: "text",
        required: true,
        defaultValue: "A Quick Brown Fox",
      },
    ],
  },
  {
    name: "Cluster Data",
    method: "GET",
    endpoint: "/api/v1/cluster_data",
    description:
      "Emissions can be grouped into self-defined clusters and retrieved using those labels.",
    requiresAuth: true,
    fields: [
      {
        name: "cluster_name",
        fieldType: "query",
        type: "text",
      },
    ],
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
