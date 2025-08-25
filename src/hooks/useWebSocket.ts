import { useEffect, useRef, useState } from 'react';

// Type definitions
export type JobStatus = 'active' | 'closed' | 'draft';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export type ExperienceLevel = 'Entry' | 'Mid-level' | 'Senior' | 'Lead' | 'Executive';

// Raw job data from API/WebSocket
interface RawJob {
    id: string | number;
    title: string;
    company: string | null;
    location: string | null;
    salary: string | null;
    type: JobType | null;
    description: string;
    status?: JobStatus;
    applications?: number;
    created_at?: string;
    employer_name?: string | null;
}

// Processed job with all required fields
export interface Job {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    job_type: JobType;
    description: string;
    status: JobStatus;
    applications: number;
    created_at: string;
    employer_name: string;
    requirements: string[];
    benefits: string[];
    deadline: string;
    duration: string;
    remote_work: boolean;
    experience_level: ExperienceLevel;
    match_score?: number;
    reasons_for_match?: string[];
    featured?: boolean;
}

export interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onApply: (jobId: string | number, applicationData: any) => void;
  onSave: (jobId: string | number) => void;
}

interface WebSocketMessage {
    type: 'new_job';
    job: RawJob;
    match_score?: number;
}

type ConnectionStatus = 'Connected' | 'Disconnected' | 'Connecting';

// Job transformation utilities
const transformJob = (rawJob: RawJob, matchScore?: number): Job => {
    const defaultSalary = (title: string): string => {
        const lowercaseTitle = title.toLowerCase();
        if (lowercaseTitle.includes('senior') || lowercaseTitle.includes('lead')) {
            return '$120,000 - $150,000';
        } else if (lowercaseTitle.includes('junior') || lowercaseTitle.includes('entry')) {
            return '$60,000 - $80,000';
        } else if (lowercaseTitle.includes('developer') || lowercaseTitle.includes('engineer')) {
            return '$90,000 - $120,000';
        }
        return '$80,000 - $100,000';
    };

    const now = new Date().toISOString();
    
    return {
        id: rawJob.id.toString(),
        title: rawJob.title,
        company: rawJob.company || 'Unknown Company',
        location: rawJob.location || 'Remote',
        salary: rawJob.salary || defaultSalary(rawJob.title),
        job_type: rawJob.type || 'FULL_TIME',
        description: rawJob.description,
        status: rawJob.status || 'active',
        applications: rawJob.applications || 0,
        created_at: rawJob.created_at || now,
        employer_name: rawJob.employer_name || rawJob.company || 'Unknown Company',
        requirements: ['Skills matching your profile'],
        benefits: ['Competitive benefits'],
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 'Permanent',
        remote_work: true,
        experience_level: 'Mid-level',
        match_score: matchScore,
        reasons_for_match: matchScore ? [`${matchScore}% match based on your profile`] : undefined,
        featured: false
    };
};

export const transformedJobs = (rawJob: RawJob, matchScore?: number): Job => ({
    id: rawJob.id.toString(),
    title: rawJob.title,
    company: rawJob.company || 'Unknown Company',
    location: rawJob.location || 'Remote',
    salary: rawJob.salary || '',
    job_type: rawJob.type || 'FULL_TIME',
    description: rawJob.description || '',
    status: rawJob.status || 'active',
    applications: rawJob.applications || 0,
    created_at: rawJob.created_at || new Date().toISOString(),
    employer_name: rawJob.employer_name || rawJob.company || 'Unknown Company',
    requirements: ['Skills matching your profile'],
    benefits: ['Competitive benefits'],
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    duration: 'Permanent',
    remote_work: true,
    experience_level: 'Mid-level',
    match_score: matchScore,
    reasons_for_match: matchScore ? [`${matchScore}% match based on your profile`] : undefined,
    featured: false,
});

// Show notification for new jobs
const showJobNotification = (job: Job, matchScore?: number) => {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        console.log("This browser does not support desktop notifications");
        return;
    }

    // Create notification content
    const title = `New Job Match: ${job.title}`;
    const matchScoreText = matchScore ? `\nMatch Score: ${matchScore}%` : '';
    const body = `${job.company} - ${job.location}${matchScoreText}`;
    const options = {
        body,
        icon: '/Main_Logo.png', // Update with your app's logo
        badge: '/favicon.ico',   // Update with your app's favicon
        tag: `job-${job.id}`,   // Unique identifier for the notification
        renotify: true          // Allow multiple notifications for the same job
    };

    // Request permission and show notification
    if (Notification.permission === "granted") {
        new Notification(title, options);
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification(title, options);
            }
        });
    }
};

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
        
        // Use environment variable for WebSocket URL, fallback to localhost for development
        const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';
        const ws = new WebSocket(`${wsUrl}/ws/job-updates/${userId}/`);
        
        ws.onopen = () => {
            setConnectionStatus('Connected');
            setSocket(ws);
            console.log('WebSocket connected for user:', userId);
        };

        ws.onmessage = (event: MessageEvent) => {
            try {
                const data: WebSocketMessage = JSON.parse(event.data);
                if (data.type === 'new_job') {
                    const transformedJob = transformJob(data.job, data.match_score);
                    setNewJobs(prev => [transformedJob, ...prev]);
                    
                    // Show notification
                    showJobNotification(transformedJob, transformedJob.match_score);
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
