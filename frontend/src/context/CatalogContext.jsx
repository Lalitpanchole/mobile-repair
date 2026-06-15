import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchCatalog } from '../services/api';

const CatalogContext = createContext();

export const CatalogProvider = ({ children }) => {
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCatalogData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      if (!forceRefresh) {
        const cached = sessionStorage.getItem('mpc_catalog');
        if (cached) {
          setCatalog(JSON.parse(cached));
          setLoading(false);
          setError(null);
          return;
        }
      }

      const data = await fetchCatalog();
      setCatalog(data);
      sessionStorage.setItem('mpc_catalog', JSON.stringify(data));
      setError(null);
    } catch (err) {
      console.error('Failed to fetch catalog:', err);
      setError(err.message || 'Failed to load catalog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogData();
  }, []);

  const refreshCatalog = () => {
    return loadCatalogData(true);
  };

  return (
    <CatalogContext.Provider value={{ catalog, loading, error, refreshCatalog }}>
      {children}
    </CatalogContext.Provider>
  );
};

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};
