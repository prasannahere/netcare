import React, { useState } from 'react'
import { FiX, FiUser, FiCalendar, FiDollarSign, FiCreditCard, FiActivity, FiAlertCircle, FiFileText, FiHome, FiUsers, FiTag, FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function PatientDetailModal({ patient, onClose }) {
  const [showFlow, setShowFlow] = useState(false)
  const [currentNodeIndex, setCurrentNodeIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  if (!patient) return null

  // Agent nodes representing the workflow
  const nodes = [
    {
      id: 1,
      name: 'Query Detection Agent',
      agentName: 'QueryDetector',
      type: 'monitoring',
      status: 'completed',
      result: {
        queryType: 'No Authorization',
        priority: 'High',
        outstandingAmount: 'R 125,450.00',
        queryAge: '3 days',
        caseNumber: patient.Account || 'CASE-2024-001',
        action: 'Triggered AuthorizationResolutionAgent'
      }
    },
    {
      id: 2,
      name: 'Authorization Resolution Agent',
      agentName: 'AuthorizationResolver',
      type: 'orchestration',
      status: 'completed',
      result: {
        workflowState: 'Active',
        subAgentsTriggered: ['CaseInvestigator', 'AuthorizationSearcher'],
        decision: 'Authorization search initiated',
        estimatedTime: '5-10 minutes'
      }
    },
    {
      id: 3,
      name: 'Case Investigation Agent',
      agentName: 'CaseInvestigator',
      type: 'data-retrieval',
      status: 'completed',
      result: {
        patientName: patient["Account Holder"] || 'John Doe',
        admissionDate: '2024-01-15',
        dischargeDate: '2024-01-22',
        levelOfCare: 'ICU',
        outstandingItems: 8,
        totalOutstanding: 'R 125,450.00',
        rejectionReason: 'No Authorization'
      }
    },
    {
      id: 4,
      name: 'Authorization Search Agent',
      agentName: 'AuthorizationSearcher',
      type: 'integration',
      status: 'completed',
      result: {
        searchStatus: 'Authorization Found',
        authorizationNumber: 'AUTH-2024-78945',
        searchMethod: 'B2B System',
        searchTime: '2.3 seconds',
        schemesSearched: ['Discovery', 'MedScheme', 'Bonitas']
      }
    },
    {
      id: 5,
      name: 'Validation Agent',
      agentName: 'DataValidator',
      type: 'validation',
      status: 'completed',
      result: {
        validationStatus: 'Passed',
        confidenceScore: '98%',
        matchedFields: ['Name', 'DOB', 'Member Number', 'ICD-10', 'Dates'],
        mismatchedFields: [],
        decision: 'Auto-attach authorization approved'
      }
    },
    {
      id: 6,
      name: 'Attachment Agent',
      agentName: 'AuthorizationAttacher',
      type: 'action',
      status: 'completed',
      result: {
        attachmentStatus: 'Success',
        authorizationLinked: true,
        sapUpdateStatus: 'Confirmed',
        auditLogCreated: true,
        timestamp: new Date().toISOString()
      }
    },
    {
      id: 7,
      name: 'Discrepancy Analyzer Agent',
      agentName: 'DiscrepancyAnalyzer',
      type: 'analysis',
      status: 'completed',
      result: {
        authorizedDays: 7,
        actualDays: 7,
        losDiscrepancy: 0,
        levelOfCareMatch: true,
        discrepancySeverity: 'None',
        action: 'Ready for resubmission'
      }
    },
    {
      id: 8,
      name: 'Confirmation Agent',
      agentName: 'ConfirmationRequestor',
      type: 'communication',
      status: 'skipped',
      result: {
        reason: 'No discrepancy detected',
        confirmationRequired: false,
        status: 'Not applicable'
      }
    },
    {
      id: 9,
      name: 'Response Handler Agent',
      agentName: 'ResponseHandler',
      type: 'routing',
      status: 'skipped',
      result: {
        reason: 'No confirmation request sent',
        responseStatus: 'N/A',
        routingDecision: 'Proceed to resubmission'
      }
    },
    {
      id: 10,
      name: 'Escalation Agent',
      agentName: 'EscalationManager',
      type: 'communication',
      status: 'skipped',
      result: {
        escalationRequired: false,
        reason: 'Full approval received',
        emailStatus: 'Not sent'
      }
    },
    {
      id: 11,
      name: 'Retry Agent',
      agentName: 'RetryScheduler',
      type: 'scheduling',
      status: 'skipped',
      result: {
        retryRequired: false,
        reason: 'Authorization found on first attempt',
        scheduledRetries: 0
      }
    },
    {
      id: 12,
      name: 'Query Tracker Agent',
      agentName: 'QueryTracker',
      type: 'tracking',
      status: 'active',
      result: {
        currentStatus: 'Authorization Attached',
        statusHistory: ['Query Identified', 'Investigation Complete', 'Authorization Found', 'Validation Passed', 'Authorization Attached'],
        timeElapsed: '8 minutes 45 seconds',
        nextStep: 'Resubmission'
      }
    },
    {
      id: 13,
      name: 'Audit Logger Agent',
      agentName: 'AuditLogger',
      type: 'logging',
      status: 'active',
      result: {
        eventsLogged: 12,
        actionsRecorded: ['Query Detection', 'Case Investigation', 'Authorization Search', 'Validation', 'Attachment'],
        complianceStatus: 'Compliant',
        auditTrailId: 'AUDIT-2024-001234'
      }
    },
    {
      id: 14,
      name: 'Follow-Up Agent',
      agentName: 'FollowUpManager',
      type: 'scheduling',
      status: 'pending',
      result: {
        followUpRequired: false,
        reason: 'Query progressing normally',
        nextReviewDate: 'N/A'
      }
    },
    {
      id: 15,
      name: 'Human Supervisor Agent',
      agentName: 'HumanSupervisor',
      type: 'supervision',
      status: 'monitoring',
      result: {
        humanIntervention: false,
        exceptionCount: 0,
        approvalRequired: false,
        status: 'Autonomous processing'
      }
    },
    {
      id: 16,
      name: 'Dashboard Agent',
      agentName: 'DashboardAggregator',
      type: 'analytics',
      status: 'active',
      result: {
        metricsUpdated: true,
        queriesResolvedToday: 47,
        averageResolutionTime: '12 minutes',
        agentActivity: 'High',
        systemHealth: 'Optimal'
      }
    },
    {
      id: 17,
      name: 'Resubmission Agent',
      agentName: 'ClaimResubmitter',
      type: 'action',
      status: 'pending',
      result: {
        resubmissionStatus: 'Ready',
        claimPrepared: true,
        authorizationAttached: true,
        estimatedResubmissionTime: '2 minutes',
        expectedOutcome: 'Successful resubmission'
      }
    }
  ]

  const handleAnimate = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setCurrentNodeIndex(0)
    
    nodes.forEach((_, index) => {
      if (index === 0) return
      setTimeout(() => {
        setCurrentNodeIndex(index)
        if (index === nodes.length - 1) {
          setTimeout(() => {
            setIsAnimating(false)
          }, 1000)
        }
      }, index * 1500)
    })
  }

  const handleNext = () => {
    if (currentNodeIndex < nodes.length - 1 && !isAnimating) {
      setCurrentNodeIndex(currentNodeIndex + 1)
    }
  }

  const handlePrev = () => {
    if (currentNodeIndex > 0 && !isAnimating) {
      setCurrentNodeIndex(currentNodeIndex - 1)
    }
  }

  const getAgentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-300'
      case 'active':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'skipped':
        return 'bg-gray-100 text-gray-700 border-gray-300'
      case 'monitoring':
        return 'bg-purple-100 text-purple-700 border-purple-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return '✓ Completed'
      case 'active':
        return '⟳ Active'
      case 'pending':
        return '⏳ Pending'
      case 'skipped':
        return '⊘ Skipped'
      case 'monitoring':
        return '👁 Monitoring'
      default:
        return status
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'Closed':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'Escalated':
        return 'bg-purple-100 text-purple-700 border-purple-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <FiUser className="text-purple-600 text-xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{patient["Account Holder"]}</h2>
              <p className="text-sm text-gray-500">Account: {patient.Account}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {!showFlow && (
              <button
                onClick={() => setShowFlow(true)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <FiPlay className="text-lg" />
                <span>Process</span>
              </button>
            )}
            {showFlow && (
              <button
                onClick={() => {
                  setShowFlow(false)
                  setCurrentNodeIndex(0)
                  setIsAnimating(false)
                }}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                <span>Back to Details</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="text-gray-600 text-2xl" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {showFlow ? (
            /* Flow Visualization - Card Carousel */
            <div className="py-4">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Processing Workflow</h3>
                <p className="text-sm text-gray-500">Account: {patient.Account} - {patient["Account Holder"]}</p>
              </div>
              
              <div className="mb-4 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Step {currentNodeIndex + 1} of {nodes.length}
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

              {/* Card Carousel */}
              <div className="bg-gray-50 rounded-xl p-8">
                <div className="relative max-w-5xl mx-auto">
                  {/* Navigation Buttons */}
                  <button
                    onClick={handlePrev}
                    disabled={currentNodeIndex === 0 || isAnimating}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-40 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-3 shadow-lg transition-all"
                  >
                    <FiChevronLeft className="text-2xl text-gray-700" />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={currentNodeIndex === nodes.length - 1 || isAnimating}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-40 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-3 shadow-lg transition-all"
                  >
                    <FiChevronRight className="text-2xl text-gray-700" />
                  </button>

                  {/* Cards Container */}
                  <div className="relative overflow-hidden bg-gray-50" style={{ height: '450px' }}>
                    <div className="flex items-center justify-center h-full relative">
                      {/* Render all cards, but position them based on index */}
                      {nodes.map((node, index) => {
                        const distance = index - currentNodeIndex
                        const isCurrent = distance === 0
                        const isPrev = distance === -1
                        const isNext = distance === 1
                        const isFarPrev = distance === -2
                        const isFarNext = distance === 2
                        // Show current, prev, next, and far positions for smooth transitions
                        const isVisible = Math.abs(distance) <= 2
                        
                        if (!isVisible) return null
                        
                        let transform = ''
                        let opacity = 1
                        let scale = 1
                        let zIndex = 20
                        
                        if (isCurrent) {
                          transform = 'translate(-50%, -50%)'
                          opacity = 1
                          scale = 1
                          zIndex = 30
                        } else if (isPrev) {
                          transform = 'translate(-50%, -50%) translateX(-120%)'
                          opacity = 0.4
                          scale = 0.75
                          zIndex = 15
                        } else if (isNext) {
                          transform = 'translate(-50%, -50%) translateX(120%)'
                          opacity = 0.4
                          scale = 0.75
                          zIndex = 15
                        } else if (isFarPrev) {
                          transform = 'translate(-50%, -50%) translateX(-240%)'
                          opacity = 0.1
                          scale = 0.6
                          zIndex = 5
                        } else if (isFarNext) {
                          transform = 'translate(-50%, -50%) translateX(240%)'
                          opacity = 0.1
                          scale = 0.6
                          zIndex = 5
                        }
                        
                        return (
                          <div
                            key={node.id}
                            className="absolute transition-all duration-700 ease-in-out"
                            style={{
                              left: '50%',
                              top: '50%',
                              transform: `${transform} scale(${scale})`,
                              opacity: opacity,
                              zIndex: zIndex,
                              pointerEvents: isCurrent ? 'auto' : 'none',
                            }}
                          >
                            <div
                              className={`bg-white rounded-xl p-6 shadow-2xl border-2 ${
                                isCurrent 
                                  ? 'ring-4 ring-purple-400 ring-opacity-75 border-purple-400' 
                                  : 'border-gray-200'
                              }`}
                              style={{ 
                                width: '350px',
                                height: '320px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                overflow: 'hidden'
                              }}
                            >
                              <div className="text-gray-800 w-full h-full overflow-y-auto">
                                {/* Agent Name */}
                                <div className="font-bold text-xl mb-2 text-gray-900">{node.name}</div>
                                
                                {/* Agent Code */}
                                <div className="text-xs text-gray-500 mb-3 font-mono">{node.agentName}</div>
                                
                                {/* Status Badge */}
                                <div className={`text-xs font-semibold mb-4 px-2 py-1 rounded-full inline-block border ${getAgentStatusColor(node.status)}`}>
                                  {getStatusBadge(node.status)}
                                </div>
                                
                                {/* Agent Type */}
                                <div className="text-xs text-gray-400 mb-4 capitalize">
                                  Type: {node.type.replace('-', ' ')}
                                </div>
                                
                                {/* Results */}
                                <div className="border-t border-gray-200 pt-3 mt-3">
                                  <div className="text-xs font-semibold text-gray-700 mb-2">Results:</div>
                                  <div className="text-xs text-gray-600 space-y-1">
                                    {Object.entries(node.result).slice(0, 4).map(([key, value]) => (
                                      <div key={key} className="flex justify-between">
                                        <span className="text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                        <span className="text-gray-800 font-medium ml-2 text-right">
                                          {typeof value === 'object' ? JSON.stringify(value).substring(0, 20) + '...' : String(value).substring(0, 25)}
                                        </span>
                                      </div>
                                    ))}
                                    {Object.keys(node.result).length > 4 && (
                                      <div className="text-gray-400 italic mt-1">
                                        +{Object.keys(node.result).length - 4} more fields
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                {isCurrent && isAnimating && (
                                  <div className="mt-4 text-xs text-purple-600 animate-pulse font-medium text-center">
                                    Processing...
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Progress Dots */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {nodes.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          if (!isAnimating && index !== currentNodeIndex) {
                            setCurrentNodeIndex(index)
                          }
                        }}
                        disabled={isAnimating}
                        className={`transition-all duration-300 rounded-full ${
                          currentNodeIndex === index
                            ? 'bg-purple-600 w-8 h-2'
                            : 'bg-gray-300 w-2 h-2 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Patient Details */
            <>
          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${getStatusColor(patient["Query Status"])}`}>
              Status: {patient["Query Status"]}
            </span>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${
              patient["Stale Claim Risk"] === 'Y' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Stale Risk: {patient["Stale Claim Risk"]}
            </span>
            <span className={`px-3 py-1 rounded-lg text-sm font-medium border ${
              patient["Case Status"] === 'Active' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
              patient["Case Status"] === 'Resolved' ? 'bg-green-100 text-green-700 border-green-200' :
              'bg-gray-100 text-gray-700 border-gray-200'
            }`}>
              Case: {patient["Case Status"]}
            </span>
            {patient["No Service"] === 'Y' && (
              <span className="px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700 border border-red-200">
                No Service
              </span>
            )}
          </div>

          {/* Financial Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <FiDollarSign className="text-blue-600" />
                <span className="text-sm font-medium text-blue-700">Outstanding Value</span>
              </div>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(patient["Outstanding Value"])}</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <FiCreditCard className="text-green-600" />
                <span className="text-sm font-medium text-green-700">Current Balance</span>
              </div>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(patient["Current Balance"])}</p>
            </div>

            <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <FiDollarSign className="text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Query Value</span>
              </div>
              <p className="text-2xl font-bold text-purple-900">{formatCurrency(patient["Query Value"])}</p>
            </div>

            <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <FiDollarSign className="text-orange-600" />
                <span className="text-sm font-medium text-orange-700">E-Query Value</span>
              </div>
              <p className="text-2xl font-bold text-orange-900">{formatCurrency(patient["E-Query Value"])}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <FiDollarSign className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Balance In</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(patient["Balance In"])}</p>
            </div>

            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
              <div className="flex items-center space-x-2 mb-2">
                <FiDollarSign className="text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">E-Query Baseline</span>
              </div>
              <p className="text-2xl font-bold text-indigo-900">{formatCurrency(patient["E-Query Baseline"])}</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <FiFileText className="text-purple-600" />
                <span>Query Information</span>
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Query Type</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Query Type"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Query Division</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Query Division"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Outcome</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Last Outcome"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Extra Query</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Extra Query"]}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <FiHome className="text-blue-600" />
                <span>Medical Aid & Creditor</span>
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Medical Aid Name</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Medical Aid Name"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Medical Aid Group</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Medical Aid Group"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Creditor</p>
                  <p className="text-sm font-medium text-gray-800">{patient.Creditor}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <p className="text-sm font-medium text-gray-800">{patient.Category2}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dates Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <FiCalendar className="text-green-600" />
                <span>Important Dates</span>
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Debt Start Date</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(patient["Debt Start Date"])}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Debt End Date</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(patient["Debt End Date"])}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date In</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(patient["Date In"])}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date Out</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(patient["Date Out"]) || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Last Worked</p>
                  <p className="text-sm font-medium text-gray-800">{formatDate(patient["Last Worked"])}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Bill Date Age</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Bill Date Age"]} days</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <FiActivity className="text-orange-600" />
                <span>Age & Timing</span>
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Age Days</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Age Days"]} days</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Age</p>
                  <p className="text-sm font-medium text-gray-800">{patient.Age} years</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Period In</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Period In"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Period Out</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Period Out"] || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Year</p>
                  <p className="text-sm font-medium text-gray-800">{patient.Year}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cycle</p>
                  <p className="text-sm font-medium text-gray-800">{patient.Cycle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Team & Responsibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <FiUsers className="text-purple-600" />
                <span>Team & Users</span>
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Team Responsible</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Team Responsible"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Query User</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Query User"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Case User</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Case User"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Supervisor</p>
                  <p className="text-sm font-medium text-gray-800">{patient.Supervisor}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
                <FiTag className="text-indigo-600" />
                <span>Priority & Escalation</span>
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Priority</p>
                  <p className="text-sm font-medium text-gray-800">{patient.Priority}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">SCU Priority</p>
                  <p className="text-sm font-medium text-gray-800">{patient["SCU Priority"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">SCU Category</p>
                  <p className="text-sm font-medium text-gray-800">{patient["SCU Cat"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Escalation Tier</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Escalation Tier"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Escalation Responsibility</p>
                  <p className="text-sm font-medium text-gray-800">{patient["Escalation Responsibility"]}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">LO Responsibility</p>
                  <p className="text-sm font-medium text-gray-800">{patient["LO Responsibility"]}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center space-x-2">
              <FiAlertCircle className="text-red-600" />
              <span>Additional Information</span>
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">Type of Amount</p>
                <p className="text-sm font-medium text-gray-800">{patient["Type of amount"]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">BOC</p>
                <p className="text-sm font-medium text-gray-800">{patient.BOC}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Approaching Stale</p>
                <p className="text-sm font-medium text-gray-800">{patient["Approching Stale"]}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Exec Split</p>
                <p className="text-sm font-medium text-gray-800">{patient["Exec Split"]}%</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Base</p>
                <p className="text-sm font-medium text-gray-800">{formatCurrency(patient.Base)}</p>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientDetailModal

