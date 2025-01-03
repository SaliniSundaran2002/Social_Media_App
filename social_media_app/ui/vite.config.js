import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:process.env.PORT || 3001,
    proxy:{
      "/api":{
        target:`http://localhost:8000`,
        changeOrigin:true,
        rewrite:(path) => path.replace(/^\/api/,"")
      }
    }
  }
})
