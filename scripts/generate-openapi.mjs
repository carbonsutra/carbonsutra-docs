import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const input = "./apis/carbonsutra-openapi.yaml";
const output = "./apis/generated-openapi.yaml";

const apiUrl = process.env.API_URL;

if (!apiUrl) {
  throw new Error("API_URL is not defined in .env");
}

let yaml = fs.readFileSync(input, "utf8");

yaml = yaml.replace(
  /servers:\s*\n\s*- url:.*\n\s*description: Production API/,
  `servers:
  - url: ${apiUrl}
    description: Production API`,
);

fs.writeFileSync(output, yaml);

console.log(`OpenAPI generated with API_URL: ${apiUrl}`);
