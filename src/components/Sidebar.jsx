import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  FiUsers, 
  FiHome, 
  FiMapPin, 
  FiGitBranch,
  FiLayers, 
  FiUserPlus, 
  FiClipboard, 
  FiSettings,
  FiPlus
} from 'react-icons/fi'
import { showUnderConstruction } from './Toast'

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeItem, setActiveItem] = useState('Overview')
  
  const handleClick = () => {
    showUnderConstruction()
  }

  const menuItems = [
    { icon: FiUsers, label: 'Patients', path: '/patients' },
    { icon: FiHome, label: 'Overview', path: '/' },
    { icon: FiMapPin, label: 'Map', path: '/' },
    { icon: FiGitBranch, label: 'Flows', path: '/flows' },
    { icon: FiLayers, label: 'Departments', path: '/' },
    { icon: FiUserPlus, label: 'Doctors', path: '/' },
    { icon: FiClipboard, label: 'History', path: '/' },
    { icon: FiSettings, label: 'Settings', path: '/' },
  ]

  const isActive = (item) => {
    if (item.path === '/flows') {
      return location.pathname.startsWith('/flows')
    }
    if (item.path === '/patients') {
      return location.pathname === '/patients'
    }
    return location.pathname === item.path && item.label === 'Overview'
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">H</span>
          </div>
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ml-1">
            <FiPlus className="text-white text-xs" />
          </div>
          <span className="text-xl font-semibold text-gray-800 ml-2">EQuery
</span>
        </div>
      </div>

      {/* Register Patient Button */}
      <div className="p-6">
        <button 
          onClick={handleClick}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg active:scale-95"
        >
          <FiPlus className="text-lg" />
          <span>Register patient</span>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        {menuItems.map((item) => {
          const Icon = item.icon
          const itemIsActive = isActive(item)
          return (
            <button
              key={item.label}
              onClick={() => {
                if (item.label === 'Flows' || item.label === 'Patients') {
                  navigate(item.path)
                  setActiveItem(item.label)
                } else if (item.label === 'Overview') {
                  navigate(item.path)
                  setActiveItem(item.label)
                } else {
                  handleClick()
                }
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg mb-2 transition-all duration-200 ${
                itemIsActive
                  ? 'bg-purple-50 text-purple-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className={`text-xl ${itemIsActive ? 'text-purple-600' : ''}`} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Mobile App Section */}
      <div className="p-6 border-t border-gray-200">
        <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12"></div>
          <div className="relative z-10">
            <h3 className="font-semibold mb-2">Get mobile app</h3>
            <p className="text-sm text-purple-100 mb-4">Access your dashboard on the go</p>
            <div className="flex space-x-2">
              <div className="w-8 h-8 bg-white rounded opacity-20"></div>
              <div className="w-8 h-8 bg-white rounded opacity-20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar

