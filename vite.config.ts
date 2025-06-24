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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor libraries
          if (id.includes("node_modules")) {
            if (id.includes("lucide-svelte")) return "vendor-ui";
            if (id.includes("stripe")) return "vendor-payments";
            if (id.includes("pdf-lib")) return "vendor-pdf";
            if (id.includes("supabase")) return "vendor-db";
            return "vendor";
          }

          // Feature-based chunks
          if (id.includes("src/routes/admin")) return "admin";
          if (id.includes("src/lib/components/conversational-wizard"))
            return "wizard";
          if (id.includes("src/lib/components/projects")) return "projects";
          if (id.includes("src/lib/components/proposals")) return "proposals";
          if (id.includes("src/lib/services")) return "services";
          if (id.includes("src/lib/utils")) return "utils";
        },
      },
    },
    // Performance budgets
    chunkSizeWarningLimit: 100, // Warn if chunks exceed 100KB
  },
  css: {
    devSourcemap: true,
  },
});
