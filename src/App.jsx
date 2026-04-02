import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Public Components
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import CurrentlyBuilding from './components/CurrentlyBuilding'
import GuestBook from './components/GuestBook'
import Contact from './components/Contact'
import Navbar from './components/Navbar'

// Admin Components (To be created)
import AdminLogin from './pages/admin/AdminLogin'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './layouts/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import GuestbookAdmin from './pages/admin/GuestbookAdmin'
import ProjectsAdmin from './pages/admin/ProjectsAdmin'
import SkillsAdmin from './pages/admin/SkillsAdmin'
import BuildingAdmin from './pages/admin/BuildingAdmin'
import ContactAdmin from './pages/admin/ContactAdmin'
import MessagesAdmin from './pages/admin/MessagesAdmin'

function Portfolio() {
  return (
    <div className="portfolio-app">
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <CurrentlyBuilding />
      <GuestBook />
      <Contact />
    </div>
  )
}

function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Portfolio />} />

      {/* Admin Login */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Protected Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="inbox" element={<MessagesAdmin />} />
        <Route path="guestbook" element={<GuestbookAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="building" element={<BuildingAdmin />} />
        <Route path="contact" element={<ContactAdmin />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
