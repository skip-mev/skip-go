import { Camel, Snake, toCamel, toSnake } from "src/utils/convert";

describe("Case Conversion Functions", function () {
  describe("toSnake", function () {
    it("should convert simple camelCase keys to snake_case", function () {
      const input = { camelCaseKey: "value" };
      const expected: Snake<typeof input> = { camel_case_key: "value" };
      expect(toSnake(input)).toEqual(expected);
    });

    it("should convert nested objects with camelCase keys to snake_case", function () {
      const input = { outerKey: { innerKey: "value" } };
      const expected: Snake<typeof input> = {
        outer_key: { inner_key: "value" },
      };
      expect(toSnake(input)).toEqual(expected);
    });

    it("should convert arrays of objects with camelCase keys to snake_case", function () {
      const input = [{ arrayKey: "value" }, { anotherArrayKey: "anotherValue" }];
      const expected: Snake<typeof input> = [
        { array_key: "value" },
        { another_array_key: "anotherValue" },
      ];
      expect(toSnake(input)).toEqual(expected);
    });

    it("should leave keys that are already snake_case unchanged", function () {
      const input = { snake_case_key: "value" };
      const expected: Snake<typeof input> = { snake_case_key: "value" };
      expect(toSnake(input)).toEqual(expected);
    });

    it("should handle empty objects", function () {
      const input = {};
      const expected: Snake<typeof input> = {};
      expect(toSnake(input)).toEqual(expected);
    });

    it("should handle complex nested objects and arrays", function () {
      const input = {
        camelCaseKey: {
          nestedArray: [{ innerCamelCaseKey: "value" }],
        },
      };
      const expected: Snake<typeof input> = {
        camel_case_key: {
          nested_array: [{ inner_camel_case_key: "value" }],
        },
      };
      expect(toSnake(input)).toEqual(expected);
    });
  });

  describe("toCamel", function () {
    it("should convert simple snake_case keys to camelCase", function () {
      const input = { snake_case_key: "value" };
      const expected: Camel<typeof input> = { snakeCaseKey: "value" };
      expect(toCamel(input)).toEqual(expected);
    });

    it("should convert nested objects with snake_case keys to camelCase", function () {
      const input = { outer_key: { inner_key: "value" } };
      const expected: Camel<typeof input> = { outerKey: { innerKey: "value" } };
      expect(toCamel(input)).toEqual(expected);
    });

    it("should convert arrays of objects with snake_case keys to camelCase", function () {
      const input = [{ array_key: "value" }, { another_array_key: "anotherValue" }];
      const expected: Camel<typeof input> = [
        { arrayKey: "value" },
        { anotherArrayKey: "anotherValue" },
      ];
      expect(toCamel(input)).toEqual(expected);
    });

    it("should leave keys that are already camelCase unchanged", function () {
      const input = { camelCaseKey: "value" };
      const expected: Camel<typeof input> = { camelCaseKey: "value" };
      expect(toCamel(input)).toEqual(expected);
    });

    it("should convert chainID to chainId", function () {
      const input = { chainID: "value" };
      const expected = { chainId: "value" };
      expect(toCamel(input)).toEqual(expected);
    });

    it("should not mutate eth addresses", function () {
      const input = { "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359": "value" };
      const expected = { "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359": "value" };
      expect(toCamel(input)).toEqual(expected);
    });

    it("should handle empty objects", function () {
      const input = {};
      const expected: Camel<typeof input> = {};
      expect(toCamel(input)).toEqual(expected);
    });

    it("should handle complex nested objects and arrays", function () {
      const input = {
        snake_case_key: {
          nested_array: [{ inner_snake_case_key: "value" }],
        },
      };
      const expected: Camel<typeof input> = {
        snakeCaseKey: {
          nestedArray: [{ innerSnakeCaseKey: "value" }],
        },
      };
      expect(toCamel(input)).toEqual(expected);
    });
  });
});
