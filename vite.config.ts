import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [sveltekit()],
  envPrefix: ["VITE_", "PUBLIC_"],
  envDir: ".",
  server: {
    hmr: {
      overlay: true,
    },
  },
});
