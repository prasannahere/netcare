import React from 'react'
import { FiActivity, FiUsers, FiFolder, FiAlertCircle } from 'react-icons/fi'
import { FiMoreVertical } from 'react-icons/fi'
import { showUnderConstruction } from './Toast'
import { summaryStats } from '../data/mockRCMData'

function SummaryCards() {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const cards = [
    {
      icon: FiActivity,
      value: summaryStats.totalAccounts.toLocaleString(),
      label: 'Total Accounts',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      icon: FiFolder,
      value: formatCurrency(summaryStats.totalOutstandingValue),
      label: 'Outstanding Value',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      icon: FiAlertCircle,
      value: summaryStats.staleClaimCount.toLocaleString(),
      label: 'Stale Claims',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600',
    },
    {
      icon: FiUsers,
      value: summaryStats.openQueries.toLocaleString(),
      label: 'Open Queries',
      iconBg: 'bg-pink-100',
      iconColor: 'text-pink-600',
    },
  ]

  const handleClick = (e) => {
    e.stopPropagation()
    showUnderConstruction()
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div
            key={index}
            onClick={handleClick}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 group cursor-pointer"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`${card.iconBg} ${card.iconColor} p-3 rounded-full group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="text-2xl" />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  showUnderConstruction()
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiMoreVertical />
              </button>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{card.value}</h3>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SummaryCards

