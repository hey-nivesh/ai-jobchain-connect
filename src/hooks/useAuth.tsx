import { useState, useEffect, createContext, useContext } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import apiClient from '@/lib/api';

interface AuthContextType {
  user: FirebaseUser | null;
  userId: string | null;
  isAuthenticated: boolean;
  userRole: 'jobseeker' | 'employer' | null;
  login: (userData: any) => void;
  logout: () => void;
  setUserId: (id: string) => void;
  setUserRole: (role: 'jobseeker' | 'employer') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Standalone login function for direct import
export const login = async (email: string, password: string) => {
  try {
    console.log('Attempting Firebase login with:', email);
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Get user data from your backend or Firestore
    // For now, we'll use a mock user type
    const userData = {
      id: user.uid,
      email: user.email,
      name: user.displayName || 'User',
      userType: 'jobseeker' // This should come from your backend
    };
    
    return userData;
  } catch (error: any) {
    console.error('Firebase login error:', error);
    throw new Error(error.message || 'Login failed. Please check your credentials.');
  }
};

// Standalone signup function for direct import
export const signup = async (email: string, password: string, userType: 'jobseeker' | 'employer' = 'jobseeker') => {
  try {
    console.log('Attempting Firebase signup with:', email, 'as', userType);
    
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Here you would typically save additional user data to your backend or Firestore
    const userData = {
      id: user.uid,
      email: user.email,
      name: 'New User',
      userType: userType
    };
    
    return userData;
  } catch (error: any) {
    console.error('Firebase signup error:', error);
    throw new Error(error.message || 'Signup failed. Please try again.');
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<'jobseeker' | 'employer' | null>(null);

  useEffect(() => {
    // Check for stored user data on initial load
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    
    if (storedUser && storedRole) {
      try {
        const userData = JSON.parse(storedUser);
        setUserRole(storedRole as 'jobseeker' | 'employer');
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('userRole');
      }
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setUserId(firebaseUser.uid);
        setIsAuthenticated(true);
        
        // Store auth token
        firebaseUser.getIdToken().then(token => {
          localStorage.setItem('authToken', token);
        });
        
        // Restore user role if not already set
        if (!userRole && storedRole) {
          setUserRole(storedRole as 'jobseeker' | 'employer');
        }
      } else {
        setUser(null);
        setUserId(null);
        setIsAuthenticated(false);
        setUserRole(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
      }
    });

    return () => unsubscribe();
  }, [userRole]);

  const login = (userData: any) => {
    // Store user data and role in localStorage for persistence
    localStorage.setItem('user', JSON.stringify(userData));
    if (userData.userType) {
      localStorage.setItem('userRole', userData.userType);
      setUserRole(userData.userType);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      // The auth state listener will handle the rest
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const value = {
    user,
    userId,
    isAuthenticated,
    userRole,
    login,
    logout,
    setUserId,
    setUserRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};