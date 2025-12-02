import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { OntologyClass } from '../services/api';
import { ChevronDown, ChevronUp, Users, Layers, Link2, Database, TrendingUp } from 'lucide-react';

interface OntologyFlashCardProps {
  classData: OntologyClass;
  isFlipped: boolean;
  onFlip: () => void;
  size?: 'large' | 'medium' | 'small';
}

const categoryColors: Record<string, string> = {
  symptom: '#ef4444',
  role: '#3b82f6',
  event: '#8b5cf6',
  organization: '#10b981',
  record: '#f59e0b',
  device: '#06b6d4',
  concept: '#1e293b',
  property: '#10b981',
  default: '#6b7280',
};

const categoryIcons: Record<string, React.ReactNode> = {
  symptom: '🩺',
  role: '👤',
  event: '📅',
  organization: '🏥',
  record: '📄',
  device: '📱',
  concept: '💡',
  property: '🔗',
  default: '📦',
};

const OntologyFlashCard: React.FC<OntologyFlashCardProps> = ({
  classData,
  isFlipped,
  onFlip,
  size = 'medium',
}) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const category = classData.category || 'default';
  const color = categoryColors[category] || categoryColors.default;
  const icon = categoryIcons[category] || categoryIcons.default;

  const sizeClasses = {
    large: 'w-[420px] h-[560px]',
    medium: 'w-[280px] h-[350px]',
    small: 'w-[200px] h-[250px]',
  };

  const textSizes = {
    large: { title: 'text-2xl', body: 'text-base', small: 'text-sm' },
    medium: { title: 'text-xl', body: 'text-sm', small: 'text-xs' },
    small: { title: 'text-lg', body: 'text-xs', small: 'text-xs' },
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onFlip();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className={`${sizeClasses[size]} perspective-1000 cursor-pointer relative`}
      onClick={handleCardClick}
      onMouseDown={handleMouseDown}
      style={{ 
        perspective: '1000px', 
        willChange: 'transform',
        position: 'relative',
        transformStyle: 'preserve-3d'
      }}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
        style={{ 
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      >
        {/* Front Side - Minimal Design */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden transition-shadow hover:shadow-lg relative"
          style={{
            transform: 'rotateY(0deg)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Simple Connection Points */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          
          <div
            className="w-full h-full rounded-lg overflow-hidden"
            style={{
              background: 'rgba(31, 41, 55, 0.9)',
            }}
          >

          <div
            className="h-16 flex items-center justify-center relative border-b"
            style={{
              backgroundColor: `${color}15`,
              borderColor: 'rgba(75, 85, 99, 0.3)'
            }}
          >
            <div className="text-3xl">{icon}</div>
            {classData.root_class && (
              <div className="absolute top-1.5 right-1.5">
                <span className="text-xs bg-gray-700/70 px-2 py-1 rounded border border-gray-600/50 text-gray-300">
                  {classData.root_class}
                </span>
              </div>
            )}
          </div>
          <div className="p-5 flex flex-col h-full" style={{ background: 'transparent' }}>
            <div className="flex-1">
              <h3 className={`${textSizes[size].title} font-medium text-gray-200 mb-2 leading-tight`}>
                {classData.label}
              </h3>
              <div className="mb-3">
                <span
                  className="px-2 py-0.5 rounded-lg text-xs font-medium text-white shadow-lg"
                  style={{ 
                    backgroundColor: color,
                    boxShadow: `0 0 10px ${color}60`
                  }}
                >
                  {category}
                </span>
              </div>
            </div>
            <div className="mt-auto space-y-2 rounded-lg p-2.5 border" style={{ 
              backgroundColor: 'rgba(31, 41, 55, 0.5)',
              borderColor: 'rgba(75, 85, 99, 0.3)'
            }}>
              <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-gray-500" />
                  <span className={`${textSizes[size].small} font-medium text-gray-400`}>
                    Subclasses
                  </span>
                </div>
                <span className={`${textSizes[size].body} font-semibold text-gray-300`}>
                  {classData.stats.subclasses_count}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-gray-500" />
                  <span className={`${textSizes[size].small} font-medium text-gray-400`}>
                    Properties
                  </span>
                </div>
                <span className={`${textSizes[size].body} font-semibold text-gray-300`}>
                  {classData.stats.properties_count}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-gray-500" />
                  <span className={`${textSizes[size].small} font-medium text-gray-400`}>
                    Instances
                  </span>
                </div>
                <span className={`${textSizes[size].body} font-semibold text-gray-300`}>
                  {classData.stats.instances_count}
                </span>
              </div>
            </div>
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-500">
                Click to flip
              </span>
            </div>
          </div>
          </div>
        </div>

        {/* Back Side - Minimal Design */}
        <div
          className="absolute w-full h-full backface-hidden rounded-lg overflow-hidden transition-shadow hover:shadow-lg relative"
          style={{
            transform: 'rotateY(180deg)',
            WebkitBackfaceVisibility: 'hidden',
            backfaceVisibility: 'hidden',
            backgroundColor: 'rgba(31, 41, 55, 0.8)',
            border: '1px solid rgba(75, 85, 99, 0.5)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Simple Connection Points */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-gray-500 z-10"></div>
          
          <div
            className="w-full h-full rounded-lg overflow-hidden"
            style={{
              background: 'rgba(31, 41, 55, 0.9)',
            }}
          >

          <div className="p-5 h-full overflow-y-auto" style={{ background: 'transparent' }}>
            <div
              className="h-14 flex items-center justify-center border-b mb-3"
              style={{
                backgroundColor: `${color}15`,
                borderColor: 'rgba(75, 85, 99, 0.3)'
              }}
            >
              <h3 className={`${textSizes[size].title} font-medium text-gray-200`}>
                {classData.label}
              </h3>
            </div>

            {/* Root Class */}
            {classData.root_class && (
              <div className="mb-3">
                <div className="flex items-center gap-2">
                  <span className={`${textSizes[size].small} font-medium text-gray-400`}>Root:</span>
                  <span className={`${textSizes[size].body} font-semibold text-gray-200`}>
                    {classData.root_class}
                  </span>
                </div>
              </div>
            )}

            {/* Path to Root */}
            {classData.path_to_root && classData.path_to_root.length > 1 && (() => {
              const pathToRoot = classData.path_to_root || [];
              return (
                <div className="mb-3">
                  <div className={`${textSizes[size].small} font-medium text-gray-400 mb-1`}>Path to Root:</div>
                  <div className="flex flex-wrap gap-1">
                    {pathToRoot.map((cls, idx) => (
                      <React.Fragment key={idx}>
                        <span className={`${textSizes[size].small} bg-gray-700/50 border border-gray-600/50 text-gray-300 px-2 py-0.5 rounded`}>
                          {cls}
                        </span>
                        {idx < pathToRoot.length - 1 && (
                        <span className={`${textSizes[size].small} text-gray-500`}>→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              );
            })()}

            {classData.description && (
              <div className="mb-4">
                <p className={`${textSizes[size].body} text-gray-300`}>
                  {classData.description}
                </p>
              </div>
            )}

            {/* Statistics Section - Moved after description */}
            <div className="space-y-3 mb-4">
              {/* Subclasses */}
              {classData.stats && classData.stats.subclasses_count !== undefined && (
                <div className="border rounded-lg p-2.5 transition-colors hover:bg-gray-800/50" style={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  borderColor: 'rgba(75, 85, 99, 0.3)'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection('subclasses');
                    }}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-gray-500" />
                      <span className={`${textSizes[size].body} font-medium text-gray-300`}>
                        Subclasses: {classData.stats.subclasses_count}
                      </span>
                    </div>
                    {expandedSections.has('subclasses') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.has('subclasses') && classData.subclasses_list && (
                    <div className="mt-2 pl-6 space-y-1">
                      {classData.subclasses_list.length > 0 ? (
                        classData.subclasses_list.map((subclass, idx) => (
                          <div key={idx} className={`${textSizes[size].small} text-gray-300`}>
                            • {subclass}
                          </div>
                        ))
                      ) : (
                        <div className={`${textSizes[size].small} text-gray-500 italic`}>
                          No subclasses
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Properties */}
              <div className="border rounded-lg p-2.5 transition-colors hover:bg-gray-800/50" style={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                borderColor: 'rgba(75, 85, 99, 0.3)'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection('properties');
                  }}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Link2 className="w-4 h-4 text-gray-500" />
                    <span className={`${textSizes[size].body} font-medium text-gray-300`}>
                      Properties: {classData.stats.properties_count}
                    </span>
                  </div>
                  {expandedSections.has('properties') ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.has('properties') && classData.properties_list && (
                  <div className="mt-2 pl-6 space-y-1">
                    {classData.properties_list.length > 0 ? (
                      classData.properties_list.map((prop, idx) => (
                        <div key={idx} className={`${textSizes[size].small} text-gray-300`}>
                          • {prop}
                        </div>
                      ))
                    ) : (
                      <div className={`${textSizes[size].small} text-gray-500 italic`}>
                        No properties
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Instances */}
              <div className="border rounded-lg p-2.5 transition-colors hover:bg-gray-800/50" style={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                borderColor: 'rgba(75, 85, 99, 0.3)'
              }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSection('instances');
                  }}
                  className="flex items-center justify-between w-full text-left"
                >
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-gray-500" />
                    <span className={`${textSizes[size].body} font-medium text-gray-300`}>
                      Instances: {classData.stats.instances_count}
                    </span>
                  </div>
                  {expandedSections.has('instances') ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                {expandedSections.has('instances') && classData.instances_list && (
                  <div className="mt-2 pl-6 space-y-1">
                    {classData.instances_list.length > 0 ? (
                      classData.instances_list.map((instance, idx) => (
                        <div key={idx} className={`${textSizes[size].small} text-gray-300`}>
                          • {instance}
                        </div>
                      ))
                    ) : (
                      <div className={`${textSizes[size].small} text-gray-500 italic`}>
                        No instances
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Hierarchy Depth */}
              <div className="border rounded-lg p-2.5 transition-colors hover:bg-gray-800/50" style={{ 
                backgroundColor: 'rgba(31, 41, 55, 0.5)',
                borderColor: 'rgba(75, 85, 99, 0.3)'
              }}>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <span className={`${textSizes[size].body} font-medium text-gray-300`}>
                    Hierarchy Depth: {classData.stats.hierarchy_depth}
                  </span>
                </div>
                {classData.stats.hierarchy_depth > 0 && (
                  <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all bg-gray-500"
                      style={{
                        width: `${Math.min(100, (classData.stats.hierarchy_depth / 10) * 100)}%`,
                      }}
                    />
                  </div>
                )}
                {classData.stats.total_descendants !== undefined && (
                  <div className={`mt-2 ${textSizes[size].small} text-gray-300 font-medium`}>
                    Total descendants: {classData.stats.total_descendants}
                  </div>
                )}
              </div>

              {/* Property Relationships */}
              {(classData.outgoing_properties && classData.outgoing_properties.length > 0) ||
               (classData.incoming_properties && classData.incoming_properties.length > 0) ? (
                <div className="border rounded-lg p-2.5 transition-colors hover:bg-gray-800/50" style={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  borderColor: 'rgba(75, 85, 99, 0.3)'
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSection('property_relationships');
                    }}
                    className="flex items-center justify-between w-full text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-gray-500" />
                      <span className={`${textSizes[size].body} font-medium text-gray-300`}>
                        Property Relationships
                      </span>
                    </div>
                    {expandedSections.has('property_relationships') ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                  {expandedSections.has('property_relationships') && (
                    <div className="mt-2 space-y-2">
                      {classData.outgoing_properties && classData.outgoing_properties.length > 0 && (
                        <div>
                          <div className={`${textSizes[size].small} font-medium text-gray-300 mb-1`}>
                            Outgoing ({classData.outgoing_properties.length}):
                          </div>
                          {classData.outgoing_properties.map((prop, idx) => (
                            <div key={idx} className="ml-2 mb-1 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                              <div className={`${textSizes[size].small} font-medium text-gray-300`}>
                                {prop.property_label || prop.property_id}
                              </div>
                              {prop.range && prop.range.length > 0 && (
                                <div className={`${textSizes[size].small} text-gray-400`}>
                                  → {prop.range.join(', ')}
                                  {prop.is_multi_range && <span className="text-gray-500 ml-1">(multi)</span>}
                                </div>
                              )}
                              {prop.inverse_property && (
                                <div className={`${textSizes[size].small} text-gray-500`}>
                                  Inverse: {prop.inverse_property.split('#').pop()?.split('/').pop()}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {classData.incoming_properties && classData.incoming_properties.length > 0 && (
                        <div>
                          <div className={`${textSizes[size].small} font-medium text-gray-300 mb-1`}>
                            Incoming ({classData.incoming_properties.length}):
                          </div>
                          {classData.incoming_properties.map((prop, idx) => (
                            <div key={idx} className="ml-2 mb-1 p-2 bg-gray-800/50 rounded border border-gray-700/50">
                              <div className={`${textSizes[size].small} font-medium text-gray-300`}>
                                {prop.property_label || prop.property_id}
                              </div>
                              {prop.domain && prop.domain.length > 0 && (
                                <div className={`${textSizes[size].small} text-gray-400`}>
                                  ← {prop.domain.join(', ')}
                                </div>
                              )}
                              {prop.is_multi_range && (
                                <div className={`${textSizes[size].small} text-gray-500`}>
                                  Multi-range property
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : null}

              {/* URI */}
              {classData.full_uri && (
                <details className="border rounded-lg p-2 transition-colors hover:bg-gray-800/50" style={{ 
                  backgroundColor: 'rgba(31, 41, 55, 0.5)',
                  borderColor: 'rgba(75, 85, 99, 0.3)'
                }}>
                  <summary className={`${textSizes[size].small} font-medium text-gray-300 cursor-pointer hover:text-gray-200`}>
                    Full URI
                  </summary>
                  <div className={`mt-2 ${textSizes[size].small} text-gray-400 break-all`}>
                    {classData.full_uri}
                  </div>
                </details>
              )}
            </div>
          </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
          position: relative;
          transform-style: preserve-3d;
        }
        .preserve-3d {
          transform-style: preserve-3d;
          transform-origin: center center;
          position: relative;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default OntologyFlashCard;

