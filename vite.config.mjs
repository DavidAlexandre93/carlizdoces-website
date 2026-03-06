import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@mui/icons-material/Share': path.resolve('src/mui-icons/Share.jsx'),
        '@mui/icons-material/KeyboardArrowLeft': path.resolve('src/mui-icons/KeyboardArrowLeft.jsx'),
        '@mui/icons-material/KeyboardArrowRight': path.resolve('src/mui-icons/KeyboardArrowRight.jsx'),
        'material-ui-carousel': path.resolve('src/mui-components/material-ui-carousel.jsx'),
        'react-swipeable-views': path.resolve('src/mui-components/react-swipeable-views.jsx'),
        'motion/react': path.resolve('src/motion/react.js'),
        'framer-motion': path.resolve('src/framer-motion.js'),
        'react-router-dom': path.resolve('src/react-router-dom.js'),
      },
    },
    define: {
      'process.env.REACT_APP_SUPABASE_URL': JSON.stringify(env.REACT_APP_SUPABASE_URL || ''),
      'process.env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY': JSON.stringify(env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT_KEY || env.REACT_APP_SUPABASE_PUBLISHABLE_DEFAULT || ''),
    },
    server: {
      port: 3000,
      open: true,
    },
  }
})
