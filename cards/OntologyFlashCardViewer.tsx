import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService, OntologyFile, OntologyClass } from '../services/api';
import { Loader2, RefreshCw, Search, X, Grid3x3, LayoutGrid, Shuffle, ChevronLeft, ChevronRight, RotateCcw, Info, TrendingUp, Layers, Plus, Edit, Trash2, Link as LinkIcon, ArrowLeft, ArrowRight, ArrowUp, HelpCircle, Download, Bookmark, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OntologyFlashCard from './OntologyFlashCard';
import NodeEditDialog from './NodeEditDialog';
import RelationshipEditDialog from './RelationshipEditDialog';

type ViewMode = 'single' | 'grid';

// Category colors matching OntologyFlashCard
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

const getCategoryColor = (category?: string): string => {
  return categoryColors[category || 'default'] || categoryColors.default;
};

const OntologyFlashCardViewer: React.FC = () => {
  const [owlFiles, setOwlFiles] = useState<OntologyFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [classes, setClasses] = useState<OntologyClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterRootClass, setFilterRootClass] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('single');
  const [shuffleMode, setShuffleMode] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'subclasses' | 'properties' | 'instances' | 'depth'>('name');
  const [showNodeDialog, setShowNodeDialog] = useState(false);
  const [showRelationshipDialog, setShowRelationshipDialog] = useState(false);
  const [editingNode, setEditingNode] = useState<OntologyClass | null>(null);
  const [editingRelationship, setEditingRelationship] = useState<{ source: string; target: string; type: string; label: string } | null>(null);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState<OntologyClass[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [isScrolling, setIsScrolling] = useState(false);
  const [navigationDirection, setNavigationDirection] = useState<'up' | 'down' | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [pendingNavigationClassId, setPendingNavigationClassId] = useState<string | null>(null);

  // Load OWL files on mount
  useEffect(() => {
    loadOwlFiles();
  }, []);


  // Load classes when file is selected
  useEffect(() => {
    if (selectedFile) {
      loadClasses(selectedFile);
    } else {
      setClasses([]);
      setCurrentIndex(0);
    }
  }, [selectedFile]);

  const loadOwlFiles = async () => {
    try {
      const files = await apiService.listOntologyFiles();
      setOwlFiles(files);
      if (files.length > 0 && !selectedFile) {
        setSelectedFile(files[0].filename);
      }
    } catch (err: any) {
      console.error('[FlashCardViewer] Error loading files:', err);
      setError(`Failed to load OWL files: ${err.message}`);
    }
  };

  const loadClasses = async (filename: string) => {
    setLoading(true);
    setError(null);
    try {
      const classList = await apiService.getOntologyClasses(filename);
      setClasses(classList);
      setCurrentIndex(0);
      setFlippedCards(new Set());
    } catch (err: any) {
      console.error('[FlashCardViewer] Error loading classes:', err);
      setError(`Failed to load ontology classes: ${err.message}`);
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort classes
  const filteredAndSortedClasses = useMemo(() => {
    let filtered = classes.filter((cls) => {
      const matchesSearch = !searchTerm || 
        cls.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cls.description || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || cls.category === filterCategory;
      const matchesRoot = filterRootClass === 'all' || cls.root_class === filterRootClass;
      return matchesSearch && matchesCategory && matchesRoot;
    });

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'subclasses':
          return b.stats.subclasses_count - a.stats.subclasses_count;
        case 'properties':
          return b.stats.properties_count - a.stats.properties_count;
        case 'instances':
          return b.stats.instances_count - a.stats.instances_count;
        case 'depth':
          return b.stats.hierarchy_depth - a.stats.hierarchy_depth;
        case 'name':
        default:
          return a.label.localeCompare(b.label);
      }
    });

    // Shuffle if enabled
    if (shuffleMode) {
      const shuffled = [...filtered];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }

    return filtered;
  }, [classes, searchTerm, filterCategory, filterRootClass, sortBy, shuffleMode]);

  // Handle navigation after search term is cleared and filteredAndSortedClasses recalculates
  useEffect(() => {
    if (pendingNavigationClassId && filteredAndSortedClasses.length > 0) {
      // Find the class by ID in the recalculated filteredAndSortedClasses
      const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === pendingNavigationClassId);
      if (foundIndex !== -1) {
        // Ensure we're in single view mode
        if (viewMode !== 'single') {
          setViewMode('single');
        }
        setCurrentIndex(foundIndex);
        // Add to navigation history
        const classId = filteredAndSortedClasses[foundIndex].id;
        const newHistory = navigationHistory.slice(0, historyIndex + 1);
        newHistory.push(classId);
        setNavigationHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        
        // Scroll to top of content area after state updates
        setTimeout(() => {
          const contentArea = document.querySelector('.flash-card-content');
          if (contentArea) {
            contentArea.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 100);
      } else {
        console.error('[Search] Could not find class in filtered list:', pendingNavigationClassId);
      }
      // Clear the pending navigation
      setPendingNavigationClassId(null);
    }
  }, [pendingNavigationClassId, filteredAndSortedClasses, viewMode, navigationHistory, historyIndex]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(classes.map(c => c.category || 'default'));
    return Array.from(cats).sort();
  }, [classes]);

  // Get unique root classes
  const rootClasses = useMemo(() => {
    const roots = new Set(classes.map(c => c.root_class).filter(Boolean));
    return Array.from(roots).sort();
  }, [classes]);

  // Navigation - handlePrevious and handleNext removed (no longer using left/right arrows)

  const handleRandom = () => {
    const randomIndex = Math.floor(Math.random() * filteredAndSortedClasses.length);
    setCurrentIndex(randomIndex);
  };

  const handleJumpTo = (index: number) => {
    if (index >= 0 && index < filteredAndSortedClasses.length) {
      // Ensure we're in single view mode when navigating
      if (viewMode !== 'single') {
        setViewMode('single');
      }
      setCurrentIndex(index);
      // Add to navigation history
      const classId = filteredAndSortedClasses[index].id;
      const newHistory = navigationHistory.slice(0, historyIndex + 1);
      newHistory.push(classId);
      setNavigationHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      // Scroll to top of content area after state updates
      setTimeout(() => {
        const contentArea = document.querySelector('.flash-card-content');
        if (contentArea) {
          contentArea.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    }
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const classId = navigationHistory[newIndex];
      const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === classId);
      if (foundIndex !== -1) {
        setCurrentIndex(foundIndex);
      }
    }
  };

  const handleForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const classId = navigationHistory[newIndex];
      const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === classId);
      if (foundIndex !== -1) {
        setCurrentIndex(foundIndex);
      }
    }
  };

  const handleJumpToClass = (className: string) => {
    const foundIndex = filteredAndSortedClasses.findIndex(
      c => c.label.toLowerCase() === className.toLowerCase() || 
           c.local_name?.toLowerCase() === className.toLowerCase()
    );
    if (foundIndex !== -1) {
      handleJumpTo(foundIndex);
    }
  };

  // Navigate to sibling entities at the same level
  const handleNavigateSibling = (direction: number) => {
    if (!currentClass) return;
    
    // Find siblings - entities with the same parent (same superclass)
    const getParent = (cls: OntologyClass) => {
      if (cls.superclasses_list && cls.superclasses_list.length > 0) {
        return cls.superclasses_list[0]; // Use first superclass as parent
      }
      return cls.root_class || null;
    };
    
    const currentParent = getParent(currentClass);
    if (!currentParent) return;
    
    // Find all siblings including current class
    const siblings = filteredAndSortedClasses.filter(cls => {
      const parent = getParent(cls);
      return parent === currentParent;
    });
    
    if (siblings.length <= 1) return; // No other siblings
    
    // Find current position in siblings list
    const currentSiblingIndex = siblings.findIndex(s => s.id === currentClass.id);
    
    if (currentSiblingIndex === -1) return; // Current class not found in siblings
    
    // Navigate to next/previous sibling
    let targetIndex: number;
    targetIndex = currentSiblingIndex + direction;
    if (targetIndex < 0) targetIndex = siblings.length - 1;
    if (targetIndex >= siblings.length) targetIndex = 0;
    
    const targetSibling = siblings[targetIndex];
    const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === targetSibling.id);
    if (foundIndex !== -1) {
      // Set navigation direction for animation
      setNavigationDirection(direction > 0 ? 'down' : 'up');
      handleJumpTo(foundIndex);
      // Reset direction after animation
      setTimeout(() => setNavigationDirection(null), 300);
    }
  };

  const toggleFlip = (classId: string) => {
    const newFlipped = new Set(flippedCards);
    if (newFlipped.has(classId)) {
      newFlipped.delete(classId);
    } else {
      newFlipped.add(classId);
    }
    setFlippedCards(newFlipped);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Get current class for this handler
      const currentClass = filteredAndSortedClasses[currentIndex];

      switch (e.key) {
        case 'ArrowUp':
          // Don't allow navigation when card is flipped
          if (currentClass && flippedCards.has(currentClass.id)) {
            return; // Allow default behavior when card is flipped
          }
          e.preventDefault();
          handleNavigateSibling(-1);
          break;
        case 'ArrowDown':
          // Don't allow navigation when card is flipped
          if (currentClass && flippedCards.has(currentClass.id)) {
            return; // Allow default behavior when card is flipped
          }
          e.preventDefault();
          handleNavigateSibling(1);
          break;
        case ' ':
          e.preventDefault();
          if (currentClass) {
            toggleFlip(currentClass.id);
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRandom();
          break;
        case 's':
        case 'S':
          e.preventDefault();
          setShuffleMode(!shuffleMode);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentIndex, filteredAndSortedClasses, shuffleMode, flippedCards]);

  // Statistics
  const stats = useMemo(() => {
    if (filteredAndSortedClasses.length === 0) return null;
    
    const totalSubclasses = filteredAndSortedClasses.reduce((sum, c) => sum + c.stats.subclasses_count, 0);
    const totalProperties = filteredAndSortedClasses.reduce((sum, c) => sum + c.stats.properties_count, 0);
    const totalInstances = filteredAndSortedClasses.reduce((sum, c) => sum + c.stats.instances_count, 0);
    const maxDepth = Math.max(...filteredAndSortedClasses.map(c => c.stats.hierarchy_depth));
    const avgSubclasses = totalSubclasses / filteredAndSortedClasses.length;
    const avgProperties = totalProperties / filteredAndSortedClasses.length;
    const avgInstances = totalInstances / filteredAndSortedClasses.length;

    return {
      total: filteredAndSortedClasses.length,
      avgSubclasses: avgSubclasses.toFixed(1),
      avgProperties: avgProperties.toFixed(1),
      avgInstances: avgInstances.toFixed(1),
      maxDepth,
    };
  }, [filteredAndSortedClasses]);

  // Category Statistics
  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = {};
    filteredAndSortedClasses.forEach(cls => {
      const cat = cls.category || 'default';
      stats[cat] = (stats[cat] || 0) + 1;
    });
    return stats;
  }, [filteredAndSortedClasses]);

  // Handle navigation to class from side panel
  const navigateToClass = useCallback((className: string) => {
    // Try to find by label first, then by id, then by local_name
    const foundIndex = filteredAndSortedClasses.findIndex(
      c => c.label === className || c.id === className || c.local_name === className
    );
    if (foundIndex !== -1) {
      // Ensure single view mode
      if (viewMode !== 'single') {
        setViewMode('single');
      }
      handleJumpTo(foundIndex);
    }
  }, [filteredAndSortedClasses, viewMode]);

  // CRUD handlers
  const handleCreateNode = () => {
    console.log('[CRUD] Opening create node dialog');
    if (!selectedFile) {
      setError('Please select an OWL file first');
      return;
    }
    setEditingNode(null);
    setShowNodeDialog(true);
  };

  const handleEditNode = (node: OntologyClass) => {
    console.log('[CRUD] Opening edit dialog for node:', node);
    setEditingNode(node);
    setShowNodeDialog(true);
  };

  const handleDeleteNode = async (node: OntologyClass) => {
    if (!selectedFile || !window.confirm(`Are you sure you want to delete "${node.label}"?`)) {
      return;
    }

    try {
      console.log('[CRUD] Deleting node:', { nodeId: node.id, label: node.label, selectedFile });
      await apiService.deleteNode(selectedFile, node.id);
      console.log('[CRUD] Node deleted successfully, reloading classes');
      await loadClasses(selectedFile);
      if (currentIndex >= filteredAndSortedClasses.length - 1) {
        setCurrentIndex(Math.max(0, filteredAndSortedClasses.length - 2));
      }
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('[CRUD] Error deleting node:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Unknown error';
      setError(`Failed to delete node: ${errorMessage}`);
    }
  };

  const handleCreateRelationship = (sourceNode?: OntologyClass) => {
    if (sourceNode) {
      setEditingRelationship({ source: sourceNode.id, target: '', type: 'subclass', label: '' });
    } else {
      setEditingRelationship(null);
    }
    setShowRelationshipDialog(true);
  };

  const handleSaveNode = async (nodeData: any) => {
    if (!selectedFile) {
      throw new Error('No file selected');
    }

    try {
      console.log('[CRUD] Saving node:', { editingNode, nodeData, selectedFile });
      if (editingNode) {
        console.log('[CRUD] Updating node:', editingNode.id);
        await apiService.updateNode(selectedFile, editingNode.id, nodeData);
      } else {
        console.log('[CRUD] Creating new node');
        await apiService.createNode(selectedFile, nodeData);
      }
      console.log('[CRUD] Node saved successfully, reloading classes');
      await loadClasses(selectedFile);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('[CRUD] Error saving node:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Unknown error';
      setError(`Failed to save node: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  const handleSaveRelationship = async (relationshipData: any) => {
    if (!selectedFile) {
      throw new Error('No file selected');
    }

    try {
      await apiService.createRelationship(selectedFile, relationshipData);
      await loadClasses(selectedFile);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('[CRUD] Error saving relationship:', err);
      const errorMessage = err.response?.data?.detail || err.message || 'Failed to save relationship';
      setError(`Failed to save relationship: ${errorMessage}`);
      throw new Error(errorMessage);
    }
  };

  const currentClass = filteredAndSortedClasses[currentIndex];

  // Hover state for category stats
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Get classes for hovered category
  const getCategoryClasses = useCallback((category: string) => {
    return filteredAndSortedClasses.filter(c => (c.category || 'default') === category);
  }, [filteredAndSortedClasses]);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header - Enhanced Design with Glass Morphism */}
      <div className="glass border-b border-gray-700/50 dark:border-gray-300/30 p-4 flex-shrink-0 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-semibold text-gray-300">
              Ontology Cards
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Navigate through the knowledge graph with interactive flash cards
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="px-3 py-1.5 glass dark:bg-gray-800/50 bg-white/50 border border-gray-700/50 dark:border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm text-gray-300 dark:text-gray-300"
            >
              <option value="">Select OWL file...</option>
              {owlFiles.map((file) => (
                <option key={file.filename} value={file.filename}>
                  {file.filename} {file.has_cache && '✓'}
                </option>
              ))}
            </select>
            <button
              onClick={() => selectedFile && loadClasses(selectedFile)}
              disabled={loading || !selectedFile}
              className="px-3 py-1.5 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors flex items-center gap-2 border border-gray-600/50 disabled:opacity-40"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 text-gray-400 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm text-gray-300">Refresh</span>
            </button>
            <button
              onClick={handleCreateNode}
              disabled={!selectedFile}
              className="px-3 py-1.5 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors flex items-center gap-2 border border-gray-600/50 disabled:opacity-40"
              title="Create new node"
            >
              <Plus className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-300">New</span>
            </button>
            <button
              onClick={() => setShowShortcuts(true)}
              className="p-1.5 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors border border-gray-600/50"
              title="Keyboard shortcuts"
            >
              <HelpCircle className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Controls - Enhanced Design with Glass Effects */}
        <div className="flex items-center gap-2 flex-wrap glass border-t border-gray-700/50 dark:border-gray-300/30 px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => {
                  const term = e.target.value;
                  setSearchTerm(term);
                  if (term.length > 0) {
                    // Filter classes for suggestions
                    const matches = classes.filter(c => {
                      const searchLower = term.toLowerCase();
                      return (
                        c.label.toLowerCase().includes(searchLower) ||
                        c.local_name?.toLowerCase().includes(searchLower) ||
                        c.description?.toLowerCase().includes(searchLower)
                      );
                    }).slice(0, 8); // Max 8 suggestions
                    setSearchSuggestions(matches);
                    setShowSuggestions(true);
                    setSelectedSuggestionIndex(-1);
                  } else {
                    setSearchSuggestions([]);
                    setShowSuggestions(false);
                  }
                }}
                onFocus={() => {
                  if (searchTerm.length > 0 && searchSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onBlur={() => {
                  // Delay to allow click on suggestion
                  setTimeout(() => setShowSuggestions(false), 200);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' && showSuggestions && searchSuggestions.length > 0) {
                    e.preventDefault();
                    setSelectedSuggestionIndex(prev => 
                      prev < searchSuggestions.length - 1 ? prev + 1 : prev
                    );
                  } else if (e.key === 'ArrowUp' && showSuggestions) {
                    e.preventDefault();
                    setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
                  } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0 && searchSuggestions.length > 0) {
                    e.preventDefault();
                    const selected = searchSuggestions[selectedSuggestionIndex];
                    if (selected) {
                      console.log('[Search] Enter pressed with selected:', selected);
                      // Clear search term first, then navigate after filteredAndSortedClasses recalculates
                      setSearchTerm('');
                      setShowSuggestions(false);
                      setPendingNavigationClassId(selected.id);
                    }
                  } else if (e.key === 'Enter' && searchSuggestions.length > 0 && selectedSuggestionIndex === -1) {
                    // If Enter pressed with suggestions but none selected, select first
                    e.preventDefault();
                    const first = searchSuggestions[0];
                    console.log('[Search] Enter pressed, selecting first:', first);
                    // Clear search term first, then navigate after filteredAndSortedClasses recalculates
                    setSearchTerm('');
                    setShowSuggestions(false);
                    setPendingNavigationClassId(first.id);
                  } else if (e.key === 'Escape') {
                    setShowSuggestions(false);
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 glass dark:bg-gray-800/50 bg-white/50 border border-gray-700/50 dark:border-gray-300/50 rounded-xl text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
              />
              {/* Search Suggestions Dropdown - Positioned below search input */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-[100] max-h-64 overflow-y-auto">
                  {searchSuggestions.map((suggestion, idx) => {
                    const searchLower = searchTerm.toLowerCase();
                    const label = suggestion.label;
                    const labelLower = label.toLowerCase();
                    const matchIndex = labelLower.indexOf(searchLower);
                    
                    return (
                      <div
                        key={suggestion.id}
                        className={`px-3 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                          idx === selectedSuggestionIndex ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => {
                          // Clear search term FIRST to allow filteredAndSortedClasses to recalculate
                          // Then use useEffect to navigate after the list is recalculated
                          console.log('[Search] Clicked suggestion:', suggestion);
                          setSearchTerm('');
                          setShowSuggestions(false);
                          // Store the class ID to navigate to after filteredAndSortedClasses recalculates
                          setPendingNavigationClassId(suggestion.id);
                        }}
                        onMouseEnter={() => setSelectedSuggestionIndex(idx)}
                      >
                        <div className="text-sm text-gray-900 font-medium">
                          {matchIndex >= 0 ? (
                            <>
                              {label.substring(0, matchIndex)}
                              <span className="bg-yellow-200">{label.substring(matchIndex, matchIndex + searchTerm.length)}</span>
                              {label.substring(matchIndex + searchTerm.length)}
                            </>
                          ) : (
                            label
                          )}
                        </div>
                        {suggestion.description && (
                          <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {suggestion.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="p-1 text-gray-400 hover:text-gray-300 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'single' ? 'grid' : 'single')}
              className={`p-1.5 bg-gray-700/50 rounded-lg border transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-gray-600/70 border-gray-500/50' 
                  : 'border-gray-600/50 hover:bg-gray-700/70'
              }`}
              title={viewMode === 'single' ? 'Grid View' : 'Single View'}
            >
              {viewMode === 'single' ? <Grid3x3 className="w-4 h-4 text-gray-300" /> : <LayoutGrid className="w-4 h-4 text-gray-300" />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowStats(!showStats)}
                className={`p-1.5 bg-gray-700/50 rounded-lg border transition-colors ${
                  showStats 
                    ? 'bg-gray-600/70 border-gray-500/50' 
                    : 'border-gray-600/50 hover:bg-gray-700/70'
                }`}
                title="Show Statistics"
              >
                <BarChart3 className="w-4 h-4 text-gray-300" />
              </button>
              {showStats && stats && currentClass && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-4 z-40">
                  <div className="text-sm font-medium text-gray-300 mb-3 border-b border-gray-700/50 pb-2">Statistics</div>
                  <div className="text-xs">
                    {currentClass.root_class && (
                      <div className="flex items-center justify-between py-1">
                        <span className="text-gray-400">Root:</span>
                        <span className="text-gray-300 font-medium">{currentClass.root_class}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-400">Total:</span>
                      <span className="text-gray-300 font-medium">{stats.total}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-400">Avg Subclasses:</span>
                      <span className="text-gray-300 font-medium">{stats.avgSubclasses}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-400">Avg Properties:</span>
                      <span className="text-gray-300 font-medium">{stats.avgProperties}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-400">Avg Instances:</span>
                      <span className="text-gray-300 font-medium">{stats.avgInstances}</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-gray-400">Max Depth:</span>
                      <span className="text-gray-300 font-medium">{stats.maxDepth}</span>
                    </div>
                    {viewMode === 'single' && (
                      <div className="flex items-center justify-between py-1 pt-2 border-t border-gray-700/50">
                        <span className="text-gray-400">Current:</span>
                        <span className="text-gray-300 font-medium">{currentIndex + 1}/{filteredAndSortedClasses.length}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Statistics - Enhanced with Glass Effects */}
        {Object.keys(categoryStats).length > 0 && !showSuggestions && (
          <div className="border-t border-gray-700/50 dark:border-gray-300/30 px-3 py-2 glass backdrop-blur-xl">
            <div className="flex flex-wrap gap-2 text-xs">
              {categoryStats.symptom > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('symptom')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <span className="text-gray-300 text-xs">Symptoms: <span className="font-medium text-gray-200">{categoryStats.symptom}</span></span>
                  {hoveredCategory === 'symptom' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Symptoms ({categoryStats.symptom}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('symptom').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {categoryStats.role > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('role')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-gray-300 text-xs">Roles: <span className="font-medium text-gray-200">{categoryStats.role}</span></span>
                  {hoveredCategory === 'role' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Roles ({categoryStats.role}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('role').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {categoryStats.event > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('event')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                  <span className="text-gray-300 text-xs">Events: <span className="font-medium text-gray-200">{categoryStats.event}</span></span>
                  {hoveredCategory === 'event' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Events ({categoryStats.event}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('event').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {categoryStats.organization > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('organization')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-300 text-xs">Organizations: <span className="font-medium text-gray-200">{categoryStats.organization}</span></span>
                  {hoveredCategory === 'organization' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Organizations ({categoryStats.organization}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('organization').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {categoryStats.record > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('record')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-300 text-xs">Records: <span className="font-medium text-gray-200">{categoryStats.record}</span></span>
                  {hoveredCategory === 'record' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Records ({categoryStats.record}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('record').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {categoryStats.device > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('device')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
                  <span className="text-gray-300 text-xs">Devices: <span className="font-medium text-gray-200">{categoryStats.device}</span></span>
                  {hoveredCategory === 'device' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Devices ({categoryStats.device}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('device').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {categoryStats.concept > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('concept')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-gray-300 text-xs">Concepts: <span className="font-medium text-gray-200">{categoryStats.concept}</span></span>
                  {hoveredCategory === 'concept' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Concepts ({categoryStats.concept}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('concept').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {categoryStats.default > 0 && (
                <div 
                  className="flex items-center gap-1.5 px-2 py-1 bg-gray-700/50 border border-gray-600/50 rounded cursor-pointer transition-colors hover:bg-gray-700/70 relative group"
                  onMouseEnter={() => setHoveredCategory('default')}
                  onMouseLeave={() => setHoveredCategory(null)}
                >
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-gray-300 text-xs">Other: <span className="font-medium text-gray-200">{categoryStats.default}</span></span>
                  {hoveredCategory === 'default' && (
                    <div 
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-72 bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 p-3 z-50 max-h-80 overflow-y-auto"
                    >
                      <div className="text-xs font-medium text-gray-300 mb-2 border-b border-gray-700/50 pb-2">Other ({categoryStats.default}):</div>
                      <div className="space-y-1">
                        {getCategoryClasses('default').map((cls, idx) => (
                          <div 
                            key={idx} 
                            className="text-xs text-gray-300 py-1.5 px-2 rounded hover:bg-gray-700/50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              // Find and navigate to the exact card
                              const foundIndex = filteredAndSortedClasses.findIndex(c => c.id === cls.id);
                              if (foundIndex !== -1) {
                                handleJumpTo(foundIndex);
                              } else {
                                navigateToClass(cls.label);
                              }
                            }}
                          >
                            • {cls.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error message - Enhanced */}
      {error && (
        <motion.div 
          className="mx-6 mt-4 glass border border-red-500/30 rounded-xl p-4 flex items-center justify-between backdrop-blur-xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-red-400">{error}</p>
          <motion.button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 ml-4 p-1 rounded-lg hover:bg-red-500/20 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </motion.div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 flash-card-content bg-gradient-to-br from-transparent via-gray-900/20 to-transparent">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              </motion.div>
              <p className="text-sm text-gray-400">Loading classes...</p>
            </div>
          </div>
        ) : filteredAndSortedClasses.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center glass rounded-2xl p-8 border border-gray-700/50 backdrop-blur-xl">
              <div className="w-16 h-16 mx-auto mb-4 glass rounded-full border border-blue-500/30 flex items-center justify-center">
                <Info className="w-8 h-8 text-blue-400" />
              </div>
              <p className="text-sm text-gray-300">{selectedFile ? 'Try adjusting filters.' : 'Select an OWL file to view classes.'}</p>
            </div>
          </div>
        ) : viewMode === 'single' ? (
          <div className="flex flex-col h-full">
            {/* Main Content Area */}
            <div className="flex-1 flex items-center justify-center gap-24 px-8 py-6 relative">
              {/* Left Panel - Superclasses Tree */}
              <div className="w-72 flex-shrink-0 relative">
                <div className="glass rounded-2xl border border-blue-500/30 p-4 h-full max-h-[700px] overflow-y-auto backdrop-blur-xl shadow-2xl relative">
                  {/* Tree Branch Visual - Left side */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent opacity-30"></div>
                  
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/50">
                    <div className="p-2 glass rounded-lg border border-blue-500/30">
                      <TrendingUp className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-300">Superclasses</h3>
                      <p className="text-xs text-gray-500">Parent Classes</p>
                    </div>
                    <span className="px-2.5 py-1 glass rounded-lg border border-blue-500/30 text-xs font-medium text-blue-400">
                      {currentClass?.stats?.superclasses_count || 0}
                    </span>
                  </div>
                {currentClass?.superclasses_list && currentClass.superclasses_list.length > 0 ? (
                  <div className="space-y-3 relative">
                    {/* Connecting line from center */}
                    <div className="absolute left-0 top-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500/30 to-transparent opacity-50 -z-10"></div>
                    
                    {currentClass.superclasses_list.map((superclass, idx) => {
                      const superclassNode = classes.find(c => c.label === superclass || c.local_name === superclass);
                      const nodeColor = getCategoryColor(superclassNode?.category);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative group"
                        >
                          {/* Tree branch connector */}
                          <div className="absolute -left-4 top-1/2 w-4 h-0.5 bg-gradient-to-r from-transparent to-blue-500/40 opacity-60"></div>
                          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-0.5 h-full bg-gradient-to-b from-blue-500/40 to-transparent opacity-60" style={{ height: idx === (currentClass.superclasses_list?.length ?? 0) - 1 ? '50%' : '100%' }}></div>
                          
                          <div
                            className="p-4 glass rounded-xl cursor-pointer relative transition-all hover:scale-105 hover:shadow-xl border backdrop-blur-xl"
                            style={{
                              borderColor: `${nodeColor}40`,
                              background: `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, ${nodeColor}15 100%)`
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigateToClass(superclass);
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg"
                                style={{ 
                                  backgroundColor: nodeColor,
                                  boxShadow: `0 0 10px ${nodeColor}80`
                                }}
                              ></div>
                              <span className="text-sm font-medium text-gray-200 group-hover:text-white flex-1 leading-relaxed">
                                {superclass}
                              </span>
                            </div>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (superclassNode) {
                                  handleCreateRelationship(superclassNode);
                                }
                              }}
                              className="absolute top-2 right-2 p-1.5 glass rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-blue-400 border border-gray-700/50"
                              title="Create relationship"
                              whileHover={{ scale: 1.1 }}
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    {currentClass?.stats?.superclasses_count === 0 ? (
                      <div className="glass rounded-xl p-6 border border-gray-700/50">
                        <div className="w-16 h-16 mx-auto mb-3 glass rounded-full border border-blue-500/30 flex items-center justify-center">
                          <TrendingUp className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-sm font-medium text-gray-300">Root Class</p>
                        <p className="text-xs mt-1 text-gray-500">No superclasses</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">No superclasses</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Center - Main Card with Tree Connections */}
            <div className="flex-shrink-0 relative z-10" style={{ willChange: 'transform' }}>
              {/* Visual connection lines to side panels */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-blue-500/40 to-blue-500/20 opacity-60"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-24 h-0.5 bg-gradient-to-l from-transparent via-purple-500/40 to-purple-500/20 opacity-60"></div>
              
              {currentClass && (
                <div 
                  className="relative"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onWheel={(e) => {
                    // Only handle scroll when not in input/textarea and not already scrolling
                    if (isScrolling) return;
                    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                      return;
                    }
                    
                    // Don't allow scroll navigation when card is flipped (back side showing)
                    if (currentClass && flippedCards.has(currentClass.id)) {
                      return; // Allow normal scrolling when card is flipped
                    }
                    
                    // Prevent default scroll
                    e.preventDefault();
                    
                    // Set scrolling flag to prevent rapid navigation
                    setIsScrolling(true);
                    setTimeout(() => setIsScrolling(false), 300);
                    
                    // Navigate based on scroll direction
                    if (e.deltaY > 0) {
                      // Scrolled down - next sibling
                      handleNavigateSibling(1);
                    } else if (e.deltaY < 0) {
                      // Scrolled up - previous sibling
                      handleNavigateSibling(-1);
                    }
                  }}
                  style={{ willChange: 'transform' }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentClass.id}
                      initial={{ 
                        opacity: 0, 
                        x: navigationDirection === 'down' ? 300 : navigationDirection === 'up' ? -300 : 0,
                        scale: 0.9,
                      }}
                      animate={{ 
                        opacity: 1, 
                        x: 0, 
                        scale: 1,
                      }}
                      exit={{ 
                        opacity: 0, 
                        x: navigationDirection === 'down' ? -300 : navigationDirection === 'up' ? 300 : 0,
                        scale: 0.9,
                      }}
                      transition={{ 
                        duration: 0.5,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                      style={{
                        position: 'relative',
                        width: '100%',
                        height: '100%',
                        transformOrigin: 'center center',
                        willChange: 'transform'
                      }}
                    >
                      <OntologyFlashCard
                        classData={currentClass}
                        isFlipped={flippedCards.has(currentClass.id)}
                        onFlip={() => toggleFlip(currentClass.id)}
                        size="large"
                      />
                    </motion.div>
                  </AnimatePresence>
                  {/* Edit buttons overlay - Enhanced with Glass */}
                  <div className="absolute top-3 left-3 flex gap-1.5 z-20">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('[CRUD] Edit button clicked');
                        handleEditNode(currentClass);
                      }}
                      className="p-2.5 glass rounded-xl border border-blue-500/30 hover:border-blue-500/50 transition-all text-blue-400 hover:text-blue-300 backdrop-blur-xl shadow-lg"
                      title="Edit node"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('[CRUD] Create relationship button clicked');
                        handleCreateRelationship(currentClass);
                      }}
                      className="p-2.5 glass rounded-xl border border-purple-500/30 hover:border-purple-500/50 transition-all text-purple-400 hover:text-purple-300 backdrop-blur-xl shadow-lg"
                      title="Add relationship"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LinkIcon className="w-4 h-4" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        console.log('[CRUD] Delete button clicked');
                        handleDeleteNode(currentClass);
                      }}
                      className="p-2.5 glass rounded-xl border border-red-500/30 hover:border-red-500/50 transition-all text-red-400 hover:text-red-300 backdrop-blur-xl shadow-lg"
                      title="Delete node"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              )}
            </div>

              {/* Right Panel - Subclasses Tree */}
              <div className="w-72 flex-shrink-0 relative">
                <div className="glass rounded-2xl border border-purple-500/30 p-4 h-full max-h-[700px] overflow-y-auto backdrop-blur-xl shadow-2xl relative">
                  {/* Tree Branch Visual - Right side */}
                  <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500/50 via-pink-500/50 to-transparent opacity-30"></div>
                  
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-700/50">
                    <div className="p-2 glass rounded-lg border border-purple-500/30">
                      <Layers className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-gray-300">Subclasses</h3>
                      <p className="text-xs text-gray-500">Child Classes</p>
                    </div>
                    <span className="px-2.5 py-1 glass rounded-lg border border-purple-500/30 text-xs font-medium text-purple-400">
                      {currentClass?.stats?.subclasses_count || 0}
                    </span>
                  </div>
                {currentClass?.subclasses_list && currentClass.subclasses_list.length > 0 ? (
                  <div className="space-y-3 relative">
                    {/* Connecting line from center */}
                    <div className="absolute right-0 top-1/2 w-full h-0.5 bg-gradient-to-l from-transparent via-purple-500/30 to-transparent opacity-50 -z-10"></div>
                    
                    {currentClass.subclasses_list.map((subclass, idx) => {
                      const subclassNode = classes.find(c => c.label === subclass || c.local_name === subclass);
                      const nodeColor = getCategoryColor(subclassNode?.category);
                      return (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="relative group"
                        >
                          {/* Tree branch connector */}
                          <div className="absolute -right-4 top-1/2 w-4 h-0.5 bg-gradient-to-l from-transparent to-purple-500/40 opacity-60"></div>
                          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-0.5 h-full bg-gradient-to-b from-purple-500/40 to-transparent opacity-60" style={{ height: idx === (currentClass.subclasses_list?.length ?? 0) - 1 ? '50%' : '100%' }}></div>
                          
                          <div
                            className="p-4 glass rounded-xl cursor-pointer relative transition-all hover:scale-105 hover:shadow-xl border backdrop-blur-xl"
                            style={{
                              borderColor: `${nodeColor}40`,
                              background: `linear-gradient(135deg, rgba(0,0,0,0.3) 0%, ${nodeColor}15 100%)`,
                              pointerEvents: 'auto'
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              navigateToClass(subclass);
                            }}
                            onMouseDown={(e) => {
                              e.stopPropagation();
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-3 h-3 rounded-full flex-shrink-0 shadow-lg"
                                style={{ 
                                  backgroundColor: nodeColor,
                                  boxShadow: `0 0 10px ${nodeColor}80`
                                }}
                              ></div>
                              <span className="text-sm font-medium text-gray-200 group-hover:text-white flex-1 leading-relaxed">
                                {subclass}
                              </span>
                            </div>
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                e.preventDefault();
                                if (subclassNode) {
                                  handleCreateRelationship(subclassNode);
                                }
                              }}
                              onMouseDown={(e) => {
                                e.stopPropagation();
                              }}
                              className="absolute top-2 right-2 p-1.5 glass rounded-lg opacity-0 group-hover:opacity-100 transition-all text-gray-400 hover:text-purple-400 border border-gray-700/50 z-20"
                              title="Create relationship"
                              whileHover={{ scale: 1.1 }}
                            >
                              <LinkIcon className="w-3.5 h-3.5" />
                            </motion.button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <div className="glass rounded-xl p-6 border border-gray-700/50">
                      <div className="w-16 h-16 mx-auto mb-3 glass rounded-full border border-purple-500/30 flex items-center justify-center">
                        <Layers className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="text-sm font-medium text-gray-300">Leaf Class</p>
                      <p className="text-xs mt-1 text-gray-500">No subclasses</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            </div>

          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Grid View */}
            <AnimatePresence>
              {filteredAndSortedClasses.map((cls, index) => (
                <motion.div
                  key={`${cls.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="flex justify-center relative group"
                >
                  <OntologyFlashCard
                    classData={cls}
                    isFlipped={flippedCards.has(cls.id)}
                    onFlip={() => toggleFlip(cls.id)}
                    size="medium"
                  />
                  {/* Edit buttons overlay for grid view - Enhanced */}
                  <div className="absolute top-2 left-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditNode(cls);
                      }}
                      className="p-2 glass rounded-lg border border-blue-500/30 hover:border-blue-500/50 transition-all text-blue-400 hover:text-blue-300 backdrop-blur-xl"
                      title="Edit"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateRelationship(cls);
                      }}
                      className="p-2 glass rounded-lg border border-purple-500/30 hover:border-purple-500/50 transition-all text-purple-400 hover:text-purple-300 backdrop-blur-xl"
                      title="Add relationship"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNode(cls);
                      }}
                      className="p-2 glass rounded-lg border border-red-500/30 hover:border-red-500/50 transition-all text-red-400 hover:text-red-300 backdrop-blur-xl"
                      title="Delete"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>


      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowShortcuts(false)}>
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h3>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Navigate sibling up</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">↑</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Navigate sibling down</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">↓</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Scroll to navigate siblings</span>
                <span className="text-xs text-gray-500">Mouse wheel</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Flip card</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Space</kbd>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Random card</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">R</kbd>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">Toggle shuffle</span>
                <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">S</kbd>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dialogs */}
      <NodeEditDialog
        isOpen={showNodeDialog}
        onClose={() => {
          setShowNodeDialog(false);
          setEditingNode(null);
        }}
        onSave={handleSaveNode}
        node={editingNode ? {
          id: editingNode.id,
          type: editingNode.type,
          label: editingNode.label,
          description: editingNode.description,
          color: editingNode.color || '#6b7280',
        } : null}
        availableClasses={classes.filter(c => c.type === 'class').map(c => ({ id: c.id, label: c.label }))}
      />

      <RelationshipEditDialog
        isOpen={showRelationshipDialog}
        onClose={() => {
          setShowRelationshipDialog(false);
          setEditingRelationship(null);
        }}
        onSave={handleSaveRelationship}
        relationship={editingRelationship ? {
          source: editingRelationship.source,
          target: editingRelationship.target,
          type: editingRelationship.type,
          label: editingRelationship.label,
        } : null}
        availableNodes={classes.map(c => ({ id: c.id, label: c.label, type: c.type }))}
      />
    </div>
  );
};

export default OntologyFlashCardViewer;

