import apiClient from '@/lib/api';

export interface CreateJobPayload {
	title: string;
	company?: string;
	description: string;
	location?: string;
	salary?: string;
	job_type?: string;
	status?: string;
	skill_ids?: number[];
}

export interface Skill {
	id: number;
	name: string;
}

export interface ApiJob {
	id: number;
	title: string;
	description: string;
	location: string | null;
	company?: string | null;
	salary?: string | null;
	type?: string | null;
	status?: string | null;
	skills?: Skill[];
	applications?: number;
	postedDate?: string;
	created_at: string;
	employer_name: string;
}

export const getJobs = async (): Promise<ApiJob[]> => {
	const res = await apiClient.get<ApiJob[]>('/jobs/');
	return res.data;
};

export const createJob = async (payload: CreateJobPayload): Promise<ApiJob> => {
	const res = await apiClient.post<ApiJob>('/jobs/', payload);
	return res.data;
};

export const getSkills = async (): Promise<Skill[]> => {
	const res = await apiClient.get<Skill[]>('/skills/');
	return res.data;
};

export const createSkill = async (name: string): Promise<Skill> => {
	const res = await apiClient.post<Skill>('/skills/', { name });
	return res.data;
};
