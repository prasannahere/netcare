import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import SummaryCards from './SummaryCards'
import ChartsSection from './ChartsSection'
import PatientsByDivision from './PatientsByDivision'
import MonthlyPatientsCard from './MonthlyPatientsCard'
import TimeAdmittedChart from './TimeAdmittedChart'
import Toast from './Toast'

function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toast />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <SummaryCards />
          <ChartsSection />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            <div className="lg:col-span-1">
              <TimeAdmittedChart />
            </div>
            <div className="lg:col-span-1">
              <PatientsByDivision />
            </div>
            <div className="lg:col-span-1">
              <MonthlyPatientsCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

