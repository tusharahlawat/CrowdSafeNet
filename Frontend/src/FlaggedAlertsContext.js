import React, { createContext, useState, useContext } from 'react';

// Create Context for Flagged Alerts
const FlaggedAlertsContext = createContext();

// Custom Hook to access the Flagged Alerts Context
export const useFlaggedAlerts = () => {
  return useContext(FlaggedAlertsContext);
};

// FlaggedAlertsProvider - Use this to wrap the part of your app that needs access to flagged alerts
const FlaggedAlertsProvider = ({ children }) => {
  const [flaggedAlerts, setFlaggedAlerts] = useState(0);

  const incrementFlaggedAlerts = () => {
    setFlaggedAlerts(flaggedAlerts + 1);
  };

  return (
    <FlaggedAlertsContext.Provider value={{ flaggedAlerts, incrementFlaggedAlerts }}>
      {children}
    </FlaggedAlertsContext.Provider>
  );
};

export default FlaggedAlertsProvider;
