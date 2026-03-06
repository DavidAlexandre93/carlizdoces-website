import { Route, Routes } from 'react-router-dom'
import SplashEnterCircus from '../../components/SplashEnterCircus'
import { HomePage } from '../../features/home/pages/HomePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashEnterCircus />} />
      <Route path="/home" element={<HomePage skipIntroCurtain />} />
    </Routes>
  )
}
