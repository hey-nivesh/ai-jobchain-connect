import { useEffect, useRef, useState } from 'react';

// Type definitions
export interface Job {
    id: number;
    title: string;
    company: string;
    location: string;
    salary_range: string;
    job_type: string;
    posted_date: string;
    description: string;
}

interface WebSocketMessage {
    type: 'new_job';
    job: Job;
    match_score: number;
}

type ConnectionStatus = 'Connected' | 'Disconnected' | 'Connecting';

interface UseWebSocketReturn {
    socket: WebSocket | null;
    newJobs: Job[];
    connectionStatus: ConnectionStatus;
    setNewJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

export const useWebSocket = (userId: number): UseWebSocketReturn => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [newJobs, setNewJobs] = useState<Job[]>([]);
    const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('Disconnected');
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (!userId) return;

        setConnectionStatus('Connecting');
        const ws = new WebSocket(`ws://localhost:8000/ws/job-updates/${userId}/`);
        
        ws.onopen = () => {
            setConnectionStatus('Connected');
            setSocket(ws);
            console.log('WebSocket connected for user:', userId);
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                if (data.type === 'new_job') {
                    setNewJobs(prev => [data.job, ...prev]);
                    
                    // Show notification
                    showJobNotification(data.job, data.match_score);
                }
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        ws.onclose = () => {
            setConnectionStatus('Disconnected');
            console.log('WebSocket disconnected for user:', userId);
            
            // Attempt to reconnect after 5 seconds
            reconnectTimeoutRef.current = setTimeout(() => {
                if (userId) {
                    console.log('Attempting to reconnect WebSocket...');
                    // This will trigger the useEffect again
                }
            }, 5000);
        };

        ws.onerror = (error: Event) => {
            console.error('WebSocket error:', error);
            setConnectionStatus('Disconnected');
        };

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            ws.close();
        };
    }, [userId]);

    const showJobNotification = (job: Job, matchScore: number): void => {
        // Browser notification
        if (Notification.permission === 'granted') {
            new Notification(`New Job Match: ${job.title}`, {
                body: `${matchScore}% match at ${job.company}`,
                icon: '/Main_Logo.png'
            });
        }
        
        // Also show toast notification (if you have a toast system)
        console.log(`New job match: ${job.title} (${matchScore}% match)`);
    };

    return { socket, newJobs, connectionStatus, setNewJobs };
};
