import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiGitBranch } from 'react-icons/fi'
import Sidebar from './Sidebar'
import Header from './Header'
import Toast from './Toast'

function Flows() {
  const navigate = useNavigate()
  
  // Create duplicate flow cards
  const flowCards = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `Workflow ${i + 1}`,
    description: 'Automated patient data processing',
  }))

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toast />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Flows</h1>
            <p className="text-gray-500">Manage your automated workflows</p>
          </div>
          
          {/* Horizontal Stack Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {flowCards.map((flow) => (
              <div
                key={flow.id}
                onClick={() => navigate(`/flows/${flow.id}`)}
                className="min-w-[280px] bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <FiGitBranch className="text-purple-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{flow.name}</h3>
                    <p className="text-sm text-gray-500">{flow.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>10 nodes</span>
                  <span>Active</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Flows

