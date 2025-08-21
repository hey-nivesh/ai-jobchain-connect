import React, { useMemo , createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'jobseeker' | 'employer' | null;

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userRole, setUserRole] = useState<UserRole>(null);

  return (
    <AppContext.Provider value={useMemo(() => ({ userRole, setUserRole }), [userRole, setUserRole])}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
