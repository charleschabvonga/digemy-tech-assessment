import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  preflight: true,
  include: [
    "./resources/js/**/*.{js,jsx,ts,tsx,vue}",
    "./resources/views/**/*.blade.php",
  ],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: "styled-system",
});
