import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  build: {
    target: "esnext",
  },
  server: {
    fs: {
      allow: ["form-validation/pkg/"],
    },
  },
});
