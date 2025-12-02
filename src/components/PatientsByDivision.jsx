import React from 'react'
import { FiActivity, FiUsers, FiAlertCircle } from 'react-icons/fi'
import { showUnderConstruction } from './Toast'
import { donutChartData } from '../data/mockRCMData'

function PatientsByDivision() {
  // Convert team responsible data to array and get top 3
  const teamData = Object.entries(donutChartData.teamResponsible)
    .map(([name, count]) => ({
      name: name.replace('Team ', ''),
      count: count,
      icon: name.includes('Collections') ? FiUsers :
            name.includes('Billing') ? FiActivity :
            FiAlertCircle,
      color: name.includes('Collections') ? 'text-blue-500' :
             name.includes('Billing') ? 'text-green-500' :
             'text-orange-500'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Teams by Accounts</h3>
      <div className="space-y-4">
        {teamData.map((team, index) => {
          const Icon = team.icon
          return (
            <div
              key={index}
              onClick={() => showUnderConstruction()}
              className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center space-x-4">
                <div className={`${team.color} p-2 rounded-lg bg-gray-50 group-hover:scale-110 transition-transform`}>
                  <Icon className="text-xl" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{team.name}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-800">{team.count}</p>
                <p className="text-xs text-gray-500">Accounts</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PatientsByDivision

