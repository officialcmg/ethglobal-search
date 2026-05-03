// Web Worker for offloading Fuse.js search to background thread
importScripts('https://cdn.jsdelivr.net/npm/fuse.js@7.3.0/dist/fuse.min.js');

let fuse = null;
let projects = [];

// Initialize Fuse.js with the projects data
function initializeFuse(data) {
  // Handle both array and {projects: []} format
  projects = Array.isArray(data) ? data : data.projects || [];
  fuse = new Fuse(projects, {
    keys: [
      { name: 'title', weight: 0.4 },
      { name: 'tagline', weight: 0.3 },
      { name: 'description', weight: 0.2 },
      { name: 'how_its_made', weight: 0.1 }
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
    minMatchCharLength: 2,
  });
  
  return projects.length;
}

// Search projects
function search(query, filters = {}) {
  if (!fuse || !projects.length) {
    return { results: [], total: 0 };
  }

  let results;
  
  if (query && query.trim()) {
    // Fuzzy search with Fuse.js
    const fuseResults = fuse.search(query, { limit: 500 });
    results = fuseResults.map(r => r.item);
  } else {
    // No query - return all projects (will be filtered)
    results = [...projects];
  }

  // Apply event filter
  if (filters.event && filters.event !== 'all') {
    results = results.filter(p => p.event === filters.event);
  }

  return {
    results: results.slice(0, 100), // Limit to 100 for performance
    total: results.length
  };
}

// Get unique events for filter dropdown
function getEvents() {
  const eventSet = new Set();
  projects.forEach(p => {
    if (p.event) eventSet.add(p.event);
  });
  return Array.from(eventSet).sort().reverse(); // Most recent first
}

// Handle messages from main thread
self.onmessage = function(e) {
  const { type, payload, id } = e.data;

  switch (type) {
    case 'INIT':
      const count = initializeFuse(payload);
      self.postMessage({ type: 'INIT_COMPLETE', payload: count, id });
      break;
    
    case 'SEARCH':
      const searchResults = search(payload.query, payload.filters);
      self.postMessage({ type: 'SEARCH_RESULTS', payload: searchResults, id });
      break;
    
    case 'GET_EVENTS':
      const events = getEvents();
      self.postMessage({ type: 'EVENTS', payload: events, id });
      break;
    
    default:
      console.warn('Unknown message type:', type);
  }
};
