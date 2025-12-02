import React, { useState, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { FiChevronDown } from 'react-icons/fi'
import { showUnderConstruction } from './Toast'
import { mockRCMData } from '../data/mockRCMData'

function TimeAdmittedChart() {
  const [timeFilter, setTimeFilter] = useState('Today')

  // Group by Age Days ranges
  const ageDaysData = useMemo(() => {
    const ranges = [
      { range: '0-30', min: 0, max: 30 },
      { range: '31-60', min: 31, max: 60 },
      { range: '61-90', min: 61, max: 90 },
      { range: '91-180', min: 91, max: 180 },
      { range: '181-365', min: 181, max: 365 },
      { range: '365+', min: 366, max: 1200 },
    ]

    return ranges.map(range => {
      const count = mockRCMData.filter(
        row => row["Age Days"] >= range.min && row["Age Days"] <= range.max
      ).length
      return {
        range: range.range,
        count: count
      }
    })
  }, [])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{payload[0].payload.range} days</p>
          <p className="text-sm text-orange-500">
            Accounts: {payload[0].value}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-full hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Accounts by Age Days</h3>
        <div className="relative">
          <select 
            value={timeFilter}
            onClick={() => showUnderConstruction()}
            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
          >
            <option>By Range</option>
            <option>By Month</option>
            <option>By Quarter</option>
          </select>
          <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
      </div>
      <div onClick={() => showUnderConstruction()} className="cursor-pointer">
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={ageDaysData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="range" 
            stroke="#6B7280" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            stroke="#6B7280" 
            fontSize={12}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="count" 
            stroke="#F97316" 
            strokeWidth={3}
            dot={{ fill: '#F97316', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default TimeAdmittedChart

