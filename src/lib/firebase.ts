import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
	apiKey: 'AIzaSyCAHXjwdk1hzQYxm97TBtMgFhZ1VX1YQfI',
	authDomain: 'zenithwork-17258.firebaseapp.com',
	projectId: 'zenithwork-17258',
	storageBucket: 'zenithwork-17258.firebasestorage.app',
	messagingSenderId: '997345944698',
	appId: '1:997345944698:web:72c3860d3c6fdb2d3287c3',
	measurementId: 'G-S6CQ0WK6RJ',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

export default app;