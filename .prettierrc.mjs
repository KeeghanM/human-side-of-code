/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [
    {
      semi: false,
      files: ["*.astro", "*.tsx"],
      options: {
        parser: "astro",
      },
    },
  ],
};
