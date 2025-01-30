import { defineConfig } from 'vite' 
import react from '@vitejs/plugin-react'  

export default defineConfig({   
  plugins: [react()],   
  server: {     
    port: 3000,     // กำหนด port ของ frontend
    proxy: {       
      '/api': {         
        target: 'http://localhost:8080',  // ชี้ไปที่ Spring Boot server         
        changeOrigin: true,         
        secure: false       
      }     
    }   
  }, 
})