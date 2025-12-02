import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import Flows from './components/Flows'
import FlowDetail from './components/FlowDetail'
import Patients from './components/Patients'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/flows" element={<Flows />} />
        <Route path="/flows/:id" element={<FlowDetail />} />
      </Routes>
    </Router>
  )
}

export default App

