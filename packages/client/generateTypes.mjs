import { generateApi } from "swagger-typescript-api";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import _ from "lodash";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

generateApi({
  fileName: "swaggerTypes.ts",
  output: path.resolve(__dirname, "./client-v2/types"),
  input: path.resolve(__dirname, "../../docs/swagger.yml"),
  modular: false,
  moduleNameIndex: -1,
  hooks: {
    onCreateComponent: (component) => {
      function mapEntries(object, mapCallbackFn) {
        return Object.fromEntries(Object.entries(object).map(mapCallbackFn));
      }
      function camelCaseProperties(object) {
        if (Array.isArray(object)) {
          return object.map(camelCaseProperties);
        } else if (typeof object === "object" && object !== null) {
          if (object.properties) {
            object.properties = camelCaseProperties(object.properties);
          }

          if (object.items) {
            object.items = camelCaseProperties(object.items);
          }

          ["allOf", "anyOf", "oneOf"].forEach((keyword) => {
            if (object[keyword]) {
              object[keyword] = camelCaseProperties(object[keyword]);
            }
          });

          if (
            object.additionalProperties &&
            typeof object.additionalProperties === "object"
          ) {
            object.additionalProperties = camelCaseProperties(
              object.additionalProperties,
            );
          }

          if (object.required && Array.isArray(object.required)) {
            object.required = object.required.map(_.camelCase);
          }

          return mapEntries(object, ([key, value]) => {
            return [
              /**
               * Transforming key into camel case format needs to be done like follow
               * because camelCase method from lodash removes special characters while
               * performing transformation into camel case format.
               * e.g., $ref key, that is introduced in OpenAPI 3.0,
               * will be converted into ref if camelCase method itself is used
               * @see https://swagger.io/docs/specification/using-ref/
               */
              key.replace(/\w+/g, _.camelCase),
              camelCaseProperties(value),
            ];
          });
        } else {
          return object;
        }
      }
      component.rawTypeData = camelCaseProperties(component.rawTypeData);
      return component;
    },
  },
});
