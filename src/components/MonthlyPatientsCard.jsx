import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { showUnderConstruction } from './Toast'
import { lineChartData, summaryStats } from '../data/mockRCMData'

// Get last 6 months of data
const recentMonths = lineChartData.slice(-6).map(item => ({
  month: item.period.split('-')[1] + '/' + item.period.split('-')[0].slice(2),
  value: item.value
}))

function MonthlyPatientsCard() {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].payload.month}</p>
          <p className="text-sm text-gray-800">
            Outstanding: {formatCurrency(payload[0].value)}
          </p>
        </div>
      )
    }
    return null
  }

  const totalOutstanding = formatCurrency(summaryStats.totalOutstandingValue)

  return (
    <div 
      onClick={() => showUnderConstruction()}
      className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg h-full text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
    >
      <div className="mb-6">
        <h2 className="text-4xl font-bold mb-2">{totalOutstanding}</h2>
        <p className="text-purple-100">Total Outstanding Value</p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={recentMonths}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="month" 
            stroke="rgba(255,255,255,0.7)" 
            fontSize={12}
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="rgba(255,255,255,0.7)" 
            fontSize={12}
            tick={{ fill: 'rgba(255,255,255,0.7)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(value) => `R${(value / 1000000).toFixed(1)}M`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#FFFFFF" 
            strokeWidth={3}
            dot={{ fill: '#FFFFFF', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MonthlyPatientsCard

