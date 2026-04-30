import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    darkMode: true,
    neonEffects: true,
    gridBackground: true,
    displayName: 'Senior Analyst - Alpha Unit',
    emailNotifications: true,
    desktopAlerts: true,
    soundEffects: false,
    mfaEnabled: true,
    sessionLock: true
  });

  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Apply global classes based on settings
  useEffect(() => {
    if (settings.neonEffects) {
      document.body.classList.remove('no-neon');
    } else {
      document.body.classList.add('no-neon');
    }

    if (settings.gridBackground) {
      document.body.classList.remove('no-grid');
    } else {
      document.body.classList.add('no-grid');
    }
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
