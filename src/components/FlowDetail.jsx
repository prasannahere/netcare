import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiArrowLeft, FiPlay } from 'react-icons/fi'
import Sidebar from './Sidebar'
import Header from './Header'
import Toast from './Toast'

function FlowDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [activeNode, setActiveNode] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const nodes = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Node ${i + 1}`,
    type: i % 3 === 0 ? 'trigger' : i % 3 === 1 ? 'action' : 'condition',
  }))

  const handleAnimate = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setActiveNode(0)
    
    nodes.forEach((_, index) => {
      setTimeout(() => {
        setActiveNode(index)
        if (index === nodes.length - 1) {
          setTimeout(() => {
            setIsAnimating(false)
            setActiveNode(null)
          }, 1000)
        }
      }, index * 1000)
    })
  }

  const getNodeColor = (type) => {
    switch (type) {
      case 'trigger':
        return 'bg-green-500'
      case 'action':
        return 'bg-blue-500'
      case 'condition':
        return 'bg-orange-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Toast />
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          {/* Flow Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/flows')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="text-gray-600 text-xl" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Workflow {id}</h1>
                <p className="text-sm text-gray-500">10 nodes connected</p>
              </div>
            </div>
            <button
              onClick={handleAnimate}
              disabled={isAnimating}
              className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiPlay className="text-lg" />
              <span>Run Flow</span>
            </button>
          </div>

          {/* Flow Canvas */}
          <div className="p-8 bg-gray-50">
            <div className="relative mx-auto" style={{ width: '1400px', height: '500px' }}>
              {nodes.map((node, index) => {
                const isActive = activeNode === index
                const x = 50 + index * 130
                const y = 200
                
                return (
                  <React.Fragment key={node.id}>
                    {/* Arrow connecting to next node */}
                    {index < nodes.length - 1 && (
                      <svg
                        className="absolute pointer-events-none z-0"
                        style={{
                          left: `${x + 100}px`,
                          top: `${y + 30}px`,
                          width: '30px',
                          height: '4px',
                        }}
                      >
                        <line
                          x1="0"
                          y1="2"
                          x2="30"
                          y2="2"
                          stroke={activeNode !== null && activeNode > index ? '#8B5CF6' : '#D1D5DB'}
                          strokeWidth="3"
                          markerEnd={`url(#arrowhead-${index})`}
                          className={activeNode !== null && activeNode > index ? 'animate-pulse' : ''}
                        />
                        <defs>
                          <marker
                            id={`arrowhead-${index}`}
                            markerWidth="10"
                            markerHeight="10"
                            refX="9"
                            refY="2"
                            orient="auto"
                          >
                            <polygon
                              points="0 0, 10 2, 0 4"
                              fill={activeNode !== null && activeNode > index ? '#8B5CF6' : '#D1D5DB'}
                            />
                          </marker>
                        </defs>
                      </svg>
                    )}
                    
                    {/* Node Box */}
                    <div
                      className={`absolute transition-all duration-1000 ease-in-out ${
                        isActive
                          ? 'transform -translate-y-8 scale-110 z-20'
                          : 'transform translate-y-0 scale-100 z-10'
                      }`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        width: '100px',
                      }}
                    >
                      <div
                        className={`${getNodeColor(node.type)} rounded-lg p-4 shadow-lg cursor-pointer transition-all duration-1000 ${
                          isActive
                            ? 'ring-4 ring-purple-400 ring-opacity-75 shadow-2xl brightness-110'
                            : 'hover:shadow-xl'
                        }`}
                        onClick={() => {
                          if (!isAnimating) {
                            setActiveNode(index)
                            setTimeout(() => setActiveNode(null), 1000)
                          }
                        }}
                      >
                        <div className="text-white">
                          <div className="font-semibold text-sm mb-1">{node.name}</div>
                          <div className="text-xs opacity-90 capitalize">{node.type}</div>
                        </div>
                      </div>
                    </div>
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlowDetail

