import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { img_proxy_addr} from "./target_config"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    // proxy: {
    //   "/api": {
    //     target: "http://192.168.190.224:8000",
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, "/"),
    //   },
    //   "/img-proxy": {
    //     target: img_proxy_addr,
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/img-proxy/, "/"),
    //   },
  },
  }, 
)
