import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const port = parseInt(env.VITE_PORT) || 8080;
  return {
    base: "/",
    plugins: [react()],
    preview: {
      port,
      strictPort: true,
    },
    server: {
      port,
      strictPort: true,
      host: true,
      origin: `http://0.0.0.0:${port}`,
      allowedHosts: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});