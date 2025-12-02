import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { FiChevronDown } from 'react-icons/fi'
import { showUnderConstruction } from './Toast'
import { barChartData, donutChartData } from '../data/mockRCMData'

// Convert bar chart data to array format
const creditorData = Object.entries(barChartData).map(([name, value]) => ({
  name: name.replace(' Hospital', ''),
  value: Math.round(value),
})).sort((a, b) => b.value - a.value).slice(0, 6) // Top 6 creditors

// Convert query type data to array format
const queryTypeData = Object.entries(donutChartData.queryType).map(([name, value]) => ({
  name: name.length > 15 ? name.substring(0, 15) + '...' : name,
  fullName: name,
  value: value,
  color: name === 'Level of Care LOC' ? '#8B5CF6' :
         name === 'No Authorization' ? '#10B981' :
         name === 'No Service' ? '#F97316' :
         name === 'Tariff Issue' ? '#3B82F6' :
         '#EC4899'
}))

// Convert medical aid data to array format
const medicalAidData = Object.entries(donutChartData.medicalAid).map(([name, value]) => ({
  name: name,
  value: value,
  color: name === 'GEMS' ? '#8B5CF6' :
         name === 'Discovery' ? '#10B981' :
         name === 'Sizwe' ? '#F97316' :
         '#3B82F6'
}))

function ChartsSection() {

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
          <p className="font-semibold text-gray-800">{payload[0].payload.name || payload[0].payload.period}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'Outstanding Value' ? formatCurrency(entry.value) : entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Outstanding Value by Creditor */}
      <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Outstanding Value by Creditor</h3>
          <div className="relative">
            <select 
              onClick={(e) => {
                e.stopPropagation()
                showUnderConstruction()
              }}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
            >
              <option>Top 6 Creditors</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div onClick={() => showUnderConstruction()} className="cursor-pointer">
          <ResponsiveContainer width="100%" height={300}>
          <BarChart data={creditorData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              dy={10}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9CA3AF', fontSize: 12 }}
              tickFormatter={(value) => `R${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              cursor={false}
              contentStyle={{ 
                borderRadius: '8px', 
                border: 'none', 
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                backgroundColor: 'white'
              }}
              formatter={(value) => formatCurrency(value)}
            />
            <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={8} />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Query Type Distribution */}
      <div 
        onClick={() => showUnderConstruction()}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Query Type Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={queryTypeData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {queryTypeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} queries`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {queryTypeData.slice(0, 3).map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-xs text-gray-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Medical Aid Distribution */}
      <div 
        onClick={() => showUnderConstruction()}
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 cursor-pointer"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Medical Aid Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={medicalAidData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {medicalAidData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${value} accounts`} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {medicalAidData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-xs text-gray-600">{entry.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChartsSection

