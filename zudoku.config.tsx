import type { ZudokuConfig } from "zudoku";
import { LandingPage } from "zudoku/components";
import ApiPlayground from "./src/components/ApiPlayground";
import googleAnalyticsPlugin from "./src/plugins/googleAnalytics";

const config: ZudokuConfig = {
  plugins: [googleAnalyticsPlugin],

  mdx: {
    components: {
      ApiPlayground,
    },
  },
  metadata: {
    title: "Carbon Emission Estimation API and Calculators for Organizations",
    description:
      "Carbon footprint estimation for business travel, global hotel stays, vehicles usage, freight, eCommerce, shipments, fuel and electricity with supplementary APIs on airports and clustering results.",
    favicon: "/favicon.jpeg",
    applicationName: "CarbonSutra Carbon Emission Estimation API",
    keywords: [
      "api",
      "climate",
      "carbon",
      "emission",
      "footprint",
      "estimation",
      "accounting",
      "SEFR",
      "travel",
      "hotel",
      "electricity",
      "vehicles",
      "ecommerce",
      "fuel",
      "freight",
      "shipment",
      "airports",
    ],
    creator: "Manish Sharma",
  },
  canonicalUrlOrigin: "https://carbonsutra.com",

  sitemap: {
    siteUrl: "https://carbonsutra.com",
  },
  site: {
    logo: {
      src: {
        light: "/images/logo.png",
        dark: "/images/logo.png",
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
            title="Simplified Carbon Footprint Estimation for Organizations"
            description="Carbon footprint estimation for business travel, global hotel stays, vehicles usage, freight and shipments, eCommerce, fuel combustion and electricity consumption using transparent algorithms and emission factors of 2026 through APIs, Google Sheet functions and MCP servers."
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
      link: "/audience-and-intent",
      collapsible: false,
      items: [
        {
          type: "doc",
          file: "audience-and-intent",
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
              file: "special-features/clustering",
              label: "Clustering",
            },
            {
              type: "doc",
              file: "special-features/dynamic-explanations",
              label: "Dynamic Explanations",
            },
            {
              type: "doc",
              file: "special-features/smart-match",
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
              file: "estimation-apis/flights",
              label: "Flights",
            },

            {
              type: "doc",
              file: "estimation-apis/hotels",
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
                  file: "estimation-apis/vehicle/vehicle-by-type",
                  label: "By Type",
                },
                {
                  type: "doc",
                  file: "estimation-apis/vehicle/vehicles-by-model",
                  label: "By Model",
                },
              ],
            },

            {
              type: "doc",
              file: "estimation-apis/freight-and-shipments",
              label: "Freight & Shipments",
            },

            {
              type: "doc",
              file: "estimation-apis/ecommerce",
              label: "eCommerce",
            },

            {
              type: "doc",
              file: "estimation-apis/fuel",
              label: "Fuel",
            },

            {
              type: "doc",
              file: "estimation-apis/electricity",
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
                  file: "supplementary-apis/Airports/airport-search-by-keyword",
                  label: "Airport Search by Keyword",
                },
                {
                  type: "doc",
                  file: "supplementary-apis/Airports/distance-between-two-airports",
                  label: "Distance Between Two Airports",
                },
                {
                  type: "doc",
                  file: "supplementary-apis/Airports/nearest-airport-from-another-airport",
                  label: "Nearest Airport from Another Airport",
                },
                {
                  type: "doc",
                  file: "supplementary-apis/Airports/nearest-airport-from-postal-code",
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
                  file: "supplementary-apis/Vehicles/list-of-models-of-vehicle-maker",
                  label: "List of Models by Vehicle Maker",
                },
                {
                  type: "doc",
                  file: "supplementary-apis/Vehicles/list-of-vehicle-makers",
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
              file: "special-apis/singapore-emission-factor-registry",
              label: "Singapore Emission Factors Registry",
            },
            {
              type: "doc",
              file: "special-apis/ghg-equivalencies.mdx",
              label: "GHG Equivalencies",
            },
            {
              type: "doc",
              file: "special-apis/estimated-flight-time.mdx",
              label: "Estimated Flight Time Between Airports",
            },
          ],
        },

        {
          type: "doc",
          file: "google-sheet-functions",
          label: "Google Sheet Functions",
        },

        {
          type: "doc",
          file: "mcp-server",
          label: "MCP Server",
        },

        {
          type: "doc",
          file: "pricing",
          label: "Pricing",
        },

        {
          type: "doc",
          file: "updates-and-roadmap",
          label: "Updates & Roadmap",
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
      label: "Get Started",
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
      to: "/api-playground",
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
