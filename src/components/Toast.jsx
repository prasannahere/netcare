import React, { useState, useEffect } from 'react'

export const showUnderConstruction = () => {
  const event = new CustomEvent('showToast', { 
    detail: { message: 'This feature is under construction' } 
  })
  window.dispatchEvent(event)
}

function Toast() {
  const [show, setShow] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleToast = (e) => {
      setMessage(e.detail.message)
      setShow(true)
      setTimeout(() => {
        setShow(false)
      }, 3000)
    }

    window.addEventListener('showToast', handleToast)
    return () => window.removeEventListener('showToast', handleToast)
  }, [])

  if (!show) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-3">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <span className="font-medium">{message}</span>
      </div>
    </div>
  )
}

export default Toast

