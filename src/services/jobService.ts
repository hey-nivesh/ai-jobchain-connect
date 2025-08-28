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
    type: string;
	id: number;
	title: string;
	company: string;
	location: string;
	salary: string;
	job_type: string;
	description: string;
	status: string;
	applications: number;
	skills?: Skill[];
	created_at: string;
	posted_date?: string;
	employer_name: string;
	requirements?: string[];
	benefits?: string[];
	deadline?: string;
	duration?: string;
	remote_work?: boolean;
	experience_level?: string;
	match_score?: number;
	reasons_for_match?: string[];
	featured?: boolean;
}
export const getJobById = async (id: number | string): Promise<ApiJob> => {
	const res = await apiClient.get<ApiJob>(`/jobs/${id}/`);
	return res.data;
};

export const updateJob = async (id: number | string, payload: Partial<ApiJob>): Promise<ApiJob> => {
	const res = await apiClient.patch<ApiJob>(`/jobs/${id}/`, payload);
	return res.data;
};

export const deleteJob = async (id: number | string): Promise<void> => {
	await apiClient.delete(`/jobs/${id}/`);
};

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
