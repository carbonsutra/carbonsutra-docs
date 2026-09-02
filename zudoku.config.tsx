import type { ZudokuConfig } from "zudoku";
import { LandingPage } from "zudoku/components";
import ApiPlayground from "./src/components/ApiPlayground";

const config: ZudokuConfig = {
  mdx: {
    components: {
      ApiPlayground,
    },
  },
  metadata: {
    title: "CarbonSutra | Carbon Footprint & Emissions API",
    description:
      "CarbonSutra provides APIs for calculating and estimating carbon emissions across business travel, flights, hotels, vehicles, fuel, electricity, freight, eCommerce, and other activities.",
    favicon: "/favicon.jpeg",
  },
  site: {
    logo: {
      src: {
        light: "/images/logo_on_white_background.jpeg",
        dark: "/images/logo_on_dark_background.jpeg",
      },
      alt: "CarbonSutra",
      width: "120px",
    },
    showPoweredBy: false,
  },

  docs: {
    defaultOptions: {
      toc: false,
      fullWidth: true,
    },
  },
  search: {
    type: "pagefind",
    maxSubResults: 3,
    ranking: {
      termFrequency: 0.8,
      pageLength: 0.6,
      termSimilarity: 1.2,
      termSaturation: 1.2,
    },
  },

  navigation: [
    {
      type: "custom-page",
      path: "/",
      element: (
        <>
          <LandingPage
            variant="split"
            eyebrow="Carbon Emissions API Platform"
            title="Carbon Footprint Estimation APIs for Organizations"
            description="CarbonSutra provides developer-friendly APIs to calculate carbon emissions for flights, hotels, vehicles, fuel, electricity, freight, eCommerce shipments, and other business activities. Estimate Scope 1, Scope 2, and Scope 3 emissions using transparent algorithms and up-to-date emission factors."
            actions={[
              {
                label: "Try Now",
                href: "/api-playground",
              },
              {
                label: "API Reference",
                href: "/api",
                variant: "outline",
              },
              {
                label: "Get started",
                href: "https://rapidapi.com/carbonsutra/api/carbonsutra1",
              },
            ]}
            aside={
              <div className="overflow-hidden rounded-xl border bg-card aspect-video">
                <iframe
                  className="h-full w-full"
                  src="https://www.youtube.com/embed/jfkx9DD5uaI?si=lkBWusYHH-PnhQXV"
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            }
          />
        </>
      ),
    },

    {
      type: "category",
      label: "Documentation",
      link: "/audience_and_intent",
      collapsible: false,
      items: [
        {
          type: "doc",
          file: "audience_and_intent",
          label: "Audience and Intent",
        },

        {
          type: "category",
          label: "Special Features",
          collapsible: true,
          collapsed: false,
          items: [
            {
              type: "doc",
              file: "special_features/clustering",
              label: "Clustering",
            },
            {
              type: "doc",
              file: "special_features/dynamic_explanations",
              label: "Dynamic Explanations",
            },
            {
              type: "doc",
              file: "special_features/smart_match",
              label: "Smart Match",
            },
          ],
        },

        {
          type: "category",
          label: "Estimation APIs",
          collapsible: true,
          collapsed: false,
          items: [
            {
              type: "doc",
              file: "estimation_apis/flights",
              label: "Flights",
            },

            {
              type: "doc",
              file: "estimation_apis/hotels",
              label: "Hotels",
            },

            {
              type: "category",
              label: "Vehicles",
              collapsible: true,
              collapsed: false,
              items: [
                {
                  type: "doc",
                  file: "estimation_apis/vehicle/vehicle_by_type",
                  label: "By Type",
                },
                {
                  type: "doc",
                  file: "estimation_apis/vehicle/vehicles_by_model",
                  label: "By Model",
                },
              ],
            },

            {
              type: "doc",
              file: "estimation_apis/freight_and_shipments",
              label: "Freight & Shipments",
            },

            {
              type: "doc",
              file: "estimation_apis/ecommerce",
              label: "eCommerce",
            },

            {
              type: "doc",
              file: "estimation_apis/fuel",
              label: "Fuel",
            },

            {
              type: "doc",
              file: "estimation_apis/electricity",
              label: "Electricity",
            },
          ],
        },

        {
          type: "category",
          label: "Supplementary APIs",
          collapsible: true,
          collapsed: false,
          items: [
            {
              type: "category",
              label: "Airports",
              collapsible: true,
              collapsed: false,
              items: [
                {
                  type: "doc",
                  file: "supplementary_apis/Airports/airport_search_by_keyword",
                  label: "Airport Search by Keyword",
                },
                {
                  type: "doc",
                  file: "supplementary_apis/Airports/distance_between_two_airports",
                  label: "Distance Between Two Airports",
                },
                {
                  type: "doc",
                  file: "supplementary_apis/Airports/nearest_airport_from_another_airport",
                  label: "Nearest Airport from Another Airport",
                },
                {
                  type: "doc",
                  file: "supplementary_apis/Airports/nearest_airport_from_postal_code",
                  label: "Nearest Airport from Postal Code",
                },
              ],
            },

            {
              type: "category",
              label: "Vehicles",
              collapsible: true,
              collapsed: false,
              items: [
                {
                  type: "doc",
                  file: "supplementary_apis/Vehicles/list_of_models_of_vehicle_maker",
                  label: "List of Models by Vehicle Maker",
                },
                {
                  type: "doc",
                  file: "supplementary_apis/Vehicles/list_of_vehicle_makers",
                  label: "List of Vehicle Makers",
                },
              ],
            },
          ],
        },

        {
          type: "category",
          label: "Special APIs",
          collapsible: true,
          collapsed: false,
          items: [
            {
              type: "doc",
              file: "special_apis/singapore_emission_factor_registry",
              label: "Singapore Emission Factors Registry",
            },
            {
              type: "doc",
              file: "special_apis/ghg_equivalencies.mdx",
              label: "GHG Equivalencies",
            },
            {
              type: "doc",
              file: "special_apis/estimated_flight_time.mdx",
              label: "Estimated Flight Time Between Airports",
            },
          ],
        },

        {
          type: "doc",
          file: "google_sheet_functions",
          label: "Google Sheet Functions",
        },

        {
          type: "doc",
          file: "mcp_server",
          label: "MCP Server",
        },

        {
          type: "doc",
          file: "pricing",
          label: "Pricing",
        },

        {
          type: "doc",
          file: "updates_and_roadmap",
          label: "Updates & Roadmap",
        },
        {
          type: "doc",
          file: "contact",
          label: "Contact",
        },

        {
          type: "doc",
          file: "about",
          label: "About",
        },
      ],
    },

    {
      type: "link",
      label: "Getting Started",
      to: "https://rapidapi.com/carbonsutra/api/carbonsutra1",
    },

    {
      type: "link",
      label: "API Reference",
      to: "/api",
    },
    {
      type: "link",
      label: "Playground",
      to: "/api_playground",
    },
  ],

  apis: [
    {
      type: "file",
      input: "./apis/carbonsutra-openapi.yaml",
      path: "/api",
    },
  ],
};

export default config;
