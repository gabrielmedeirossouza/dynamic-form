import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import unicornPlugin from "eslint-plugin-unicorn";
import sortClassMembersPlugin from "eslint-plugin-sort-class-members";
import customMemberAccessibility from "./custom/custom-member-accessibility.js";

export default defineConfig([
  { files: ["**/*.{s,mjs,cjs,ts}"], plugins: { js }, extends: ["js/recommended"] },
  { files: ["**/*.{s,mjs,cjs,ts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
  unicornPlugin.configs.recommended,
  sortClassMembersPlugin.configs["flat/recommended"],
  {
    "plugins": {
      "custom-member-accessibility": customMemberAccessibility
    },
    rules: {
      "custom-member-accessibility/add-public-modifier": "error",
      "unicorn/no-static-only-class": "off",
      "semi": [
        "error",
        "always"
      ],
      "space-before-function-paren": [
        "error",
        "never"
      ],
      "no-underscore-dangle": "off",
      "no-plusplus": "off",
      "no-multiple-empty-lines": [
        "error",
        {
          "max": 1
        }
      ],
      "newline-before-return": "error",
      "indent": [
        "error",
        2
      ],
      "padded-blocks": [
        "error",
        "never"
      ],
      "brace-style": [
        "error",
        "1tbs"
      ],
      "no-irregular-whitespace": "error",
      "no-trailing-spaces": "error",
      "eol-last": "error",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-array-reduce": "off",
      "unicorn/no-array-callback-reference": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "object-curly-spacing": [
        "error",
        "always"
      ],
      "@typescript-eslint/ban-types": "off",
      "space-in-parens": [
        "error",
        "never"
      ],
      "comma-spacing": "error",
      "comma-dangle": ["error", "never"],
      "quotes": [
        "error",
        "double"
      ],
      "unicorn/prevent-abbreviations": "off",
      "unicorn/numeric-separators-style": "off",
      "unicorn/no-useless-undefined": "off",
      "unicorn/error-message": "off",
      "unicorn/no-array-method-this-argument": "off",
      "unicorn/prefer-global-this": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-useless-constructor": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-shadow": "off",
      "@typescript-eslint/no-redeclare": "off",
      "unicorn/no-empty-file": "off",
      "unicorn/filename-case": [
        "error",
        {
          "case": "kebabCase"
        }
      ],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        {
          "accessibility": "explicit",
          "overrides": {
            "constructors": "off"
          }
        }
      ],
      "sort-class-members/sort-class-members": [
        2,
        {
          "order": [
            "[static-properties]",
            "[properties]",
            "[conventional-private-properties]",
            "constructor",
            "[static-methods]",
            "[methods]",
            "[conventional-private-methods]"
          ],
          "accessorPairPositioning": "getThenSet"
        }
      ],
      "@/lines-between-class-members": [
        "error",
        "always",
        {
          "exceptAfterSingleLine": true
        }
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          "selector": "classMethod",
          "format": [
            "camelCase"
          ],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": [
            "classMethod"
          ],
          "format": [
            "camelCase"
          ],
          "modifiers": [
            "private"
          ],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": [
            "classMethod"
          ],
          "format": [
            "camelCase"
          ],
          "modifiers": [
            "protected"
          ],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": [
            "classProperty"
          ],
          "format": [
            "camelCase",
            "UPPER_CASE"
          ],
          "modifiers": [
            "private"
          ],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": [
            "classProperty"
          ],
          "format": [
            "camelCase"
          ],
          "modifiers": [
            "protected"
          ],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": "parameterProperty",
          "modifiers": [
            "private"
          ],
          "format": [
            "camelCase"
          ],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        }
      ]
    }
  }
]);
