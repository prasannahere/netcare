import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiUser, FiCalendar, FiDollarSign, FiAlertCircle, FiActivity, FiCreditCard } from 'react-icons/fi'
import Sidebar from './Sidebar'
import Header from './Header'
import Toast from './Toast'
import PatientDetailModal from './PatientDetailModal'
import { mockRCMData } from '../data/mockRCMData'

function Patients() {
  const navigate = useNavigate()
  const [selectedPatient, setSelectedPatient] = useState(null)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-700'
      case 'Closed':
        return 'bg-green-100 text-green-700'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'Escalated':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStaleRiskColor = (risk) => {
    return risk === 'Y' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toast />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Patients</h1>
            <p className="text-gray-500">All patient account details</p>
          </div>

          {/* Horizontal Stack Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {mockRCMData.map((patient, index) => (
              <div
                key={index}
                onClick={() => setSelectedPatient(patient)}
                className="min-w-[380px] bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <FiUser className="text-purple-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg">{patient["Account Holder"]}</h3>
                      <p className="text-sm text-gray-500">Account: {patient.Account}</p>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient["Query Status"])}`}>
                    {patient["Query Status"]}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStaleRiskColor(patient["Stale Claim Risk"])}`}>
                    {patient["Stale Claim Risk"] === 'Y' ? 'Stale Risk' : 'Active'}
                  </span>
                  {patient["No Service"] === 'Y' && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      No Service
                    </span>
                  )}
                </div>

                {/* Financial Info */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FiDollarSign className="text-blue-600" />
                      <span className="text-sm text-gray-600">Outstanding</span>
                    </div>
                    <span className="font-semibold text-blue-700">{formatCurrency(patient["Outstanding Value"])}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <FiCreditCard className="text-green-600" />
                      <span className="text-sm text-gray-600">Current Balance</span>
                    </div>
                    <span className="font-semibold text-green-700">{formatCurrency(patient["Current Balance"])}</span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Medical Aid</p>
                    <p className="text-sm font-medium text-gray-800">{patient["Medical Aid Name"]}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Query Type</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{patient["Query Type"]}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Creditor</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{patient.Creditor}</p>
                  </div>
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Team</p>
                    <p className="text-sm font-medium text-gray-800 truncate">{patient["Team Responsible"]}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <FiCalendar className="text-gray-400" />
                    <span className="text-gray-600">Date In:</span>
                    <span className="text-gray-800 font-medium">{formatDate(patient["Date In"])}</span>
                  </div>
                  {patient["Date Out"] && (
                    <div className="flex items-center space-x-2 text-sm">
                      <FiCalendar className="text-gray-400" />
                      <span className="text-gray-600">Date Out:</span>
                      <span className="text-gray-800 font-medium">{formatDate(patient["Date Out"])}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-sm">
                    <FiActivity className="text-gray-400" />
                    <span className="text-gray-600">Age Days:</span>
                    <span className="text-gray-800 font-medium">{patient["Age Days"]} days</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Division: {patient["Query Division"]}</span>
                    <span>Priority: {patient.Priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Patient Detail Modal */}
      {selectedPatient && (
        <PatientDetailModal
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  )
}

export default Patients

