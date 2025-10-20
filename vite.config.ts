import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

const resolve = () => {
  return {
    "@": path.resolve(__dirname, "src")
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  plugins: [
    VueRouter({
      /* options */
    }),
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
      imports: ['vue', 'vue-router'],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
      directoryAsNamespace: true,
    }),
  ],
  resolve: {
    alias: resolve(),
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue']
  },
  base: '/',
  esbuild: {
    pure: ['console.log'], // 删除 console.log
    drop: ['debugger'], // 删除 debugger
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            const parts = id.split('node_modules/')[1].split('/');
            return parts.length > 1 ? parts[0] + '/' + parts[1] : parts[0];
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/SIPAIIS_Base/': {
        // target: 'http://132.120.136.10:9080',
        target: 'http://223.84.61.83:3033',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/SIPAIIS_Base/, '\/SIPAIIS_Base/'),
        bypass(req, res, options) {
          const proxyURL = options.target + options.rewrite!(req.url!);
          res?.setHeader('x-req-proxyURL', proxyURL) // 将真实请求地址设置到响应头中
        },
      }
    }
  }
})
