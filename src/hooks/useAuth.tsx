import { useState, useEffect, createContext, useContext, useMemo } from 'react';
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

interface MeResponse {
	uid: string;
	email: string;
	role: 'EMPLOYER' | 'JOB_SEEKER';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};

export const login = async (email: string, password: string) => {
	try {
		const userCredential = await signInWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		const userData = {
			id: user.uid,
			email: user.email,
			name: user.displayName || 'User',
			userType: 'jobseeker'
		};
		return userData;
	} catch (error: any) {
		throw new Error(error.message || 'Login failed. Please check your credentials.');
	}
};

export const signup = async (email: string, password: string, userType: 'jobseeker' | 'employer' = 'jobseeker') => {
	try {
		const userCredential = await createUserWithEmailAndPassword(auth, email, password);
		const user = userCredential.user;
		const userData = {
			id: user.uid,
			email: user.email,
			name: 'New User',
			userType: userType
		};
		return userData;
	} catch (error: any) {
		throw new Error(error.message || 'Signup failed. Please try again.');
	}
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<FirebaseUser | null>(null);
	const [userId, setUserId] = useState<string | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState<'jobseeker' | 'employer' | null>(null);

	useEffect(() => {
		const storedRole = localStorage.getItem('userRole');

		const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
			if (firebaseUser) {
				setUser(firebaseUser);
				setUserId(firebaseUser.uid);
				setIsAuthenticated(true);
				const token = await firebaseUser.getIdToken();
				localStorage.setItem('authToken', token);
				try {
					const me = await apiClient.get<MeResponse>('/me');
					const role = me.data.role === 'EMPLOYER' ? 'employer' : 'jobseeker';
					setUserRole(role);
					localStorage.setItem('userRole', role);
				} catch {
					if (storedRole) setUserRole(storedRole as 'jobseeker' | 'employer');
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
	}, []);

	const login = (userData: any) => {
		localStorage.setItem('user', JSON.stringify(userData));
		if (userData.userType) {
			localStorage.setItem('userRole', userData.userType);
			setUserRole(userData.userType);
		}
	};

	const logout = async () => {
		try {
			await signOut(auth);
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	const value = useMemo(() => ({
		user,
		userId,
		isAuthenticated,
		userRole,
		login,
		logout,
		setUserId,
		setUserRole,
	}), [user, userId, isAuthenticated, userRole, login, logout, setUserId, setUserRole]);

	return (
		<AuthContext.Provider value={value}>
			{children}
		</AuthContext.Provider>
	);
};