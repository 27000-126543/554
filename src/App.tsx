import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from '@/store'
import Layout from '@/components/Layout'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Dashboard from '@/pages/Dashboard'
import Carbon from '@/pages/Carbon'
import Environment from '@/pages/Environment'
import Social from '@/pages/Social'
import Governance from '@/pages/Governance'
import Report from '@/pages/Report'
import Audit from '@/pages/Audit'
import Membership from '@/pages/Membership'
import Admin from '@/pages/Admin'
import Prediction from '@/pages/Prediction'
import ExportPage from '@/pages/ExportPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/carbon" element={<Carbon />} />
          <Route path="/environment" element={<Environment />} />
          <Route path="/social" element={<Social />} />
          <Route path="/governance" element={<Governance />} />
          <Route path="/report" element={<Report />} />
          <Route path="/audit" element={<Audit />} />
          <Route path="/membership" element={<Membership />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/prediction" element={<Prediction />} />
          <Route path="/export" element={<ExportPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  )
}

export default App
