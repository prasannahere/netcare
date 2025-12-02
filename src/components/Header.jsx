import React from 'react'
import { FiSearch, FiBell, FiChevronDown } from 'react-icons/fi'
import { showUnderConstruction } from './Toast'

function Header() {
  const handleClick = () => {
    showUnderConstruction()
  }

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            onClick={handleClick}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all cursor-pointer"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          onClick={handleClick}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiBell className="text-gray-600 text-xl" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div 
          onClick={handleClick}
          className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg px-3 py-2 transition-colors"
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
            EK
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">Emma Kwan</span>
            <span className="text-xs text-gray-500">Admin</span>
          </div>
          <FiChevronDown className="text-gray-400" />
        </div>
      </div>
    </div>
  )
}

export default Header

