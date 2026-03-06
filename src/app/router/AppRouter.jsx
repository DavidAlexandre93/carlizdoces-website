import { Route, Routes } from 'react-router-dom'
import SplashEnterCircus from '../../components/SplashEnterCircus'
import { Error404Page } from '../../features/error/pages/Error404Page'
import { HomePage } from '../../features/home/pages/HomePage'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<SplashEnterCircus />} />
      <Route path="/home" element={<HomePage skipIntroCurtain />} />
      <Route path="/entrada" element={<SplashEnterCircus />} />
      <Route path="/404" element={<Error404Page />} />
      <Route path="*" element={<Error404Page />} />
    </Routes>
  )
}
