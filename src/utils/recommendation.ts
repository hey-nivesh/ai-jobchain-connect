import { Job } from '../hooks/useWebSocket';

export interface UserProfile {
    id: string;
    skills: string[];
    experience: number; // in years
    preferredLocations: string[];
    preferredJobTypes: string[];
    preferredSalaryRange?: {
        min: number;
        max: number;
    };
    industries?: string[];
    jobTitles?: string[];
}

export interface MatchReason {
    type: 'skill' | 'location' | 'jobType' | 'experience' | 'salary' | 'industry';
    score: number;
    description: string;
}

/**
 * Calculate a match score and reasons between a job and a user profile
 * @param job The job to evaluate
 * @param userProfile The user's profile with preferences and skills
 * @returns Object containing match score and reasons
 */
export function calculateJobMatch(job: Job, userProfile: UserProfile): {
    score: number;
    reasons: string[];
} {
    const matchReasons: MatchReason[] = [];
    let totalScore = 0;

    // Skill matching (40% weight)
    const skillMatches = matchSkills(job, userProfile.skills);
    if (skillMatches.length > 0) {
        matchReasons.push({
            type: 'skill',
            score: skillMatches.length * 8, // Each skill match worth 8 points
            description: `Matching skills: ${skillMatches.join(', ')}`
        });
    }

    // Location matching (20% weight)
    if (matchLocation(job.location, userProfile.preferredLocations)) {
        matchReasons.push({
            type: 'location',
            score: 20,
            description: `Location matches your preference: ${job.location}`
        });
    }

    // Job type matching (15% weight)
    if (userProfile.preferredJobTypes.includes(job.type)) {
        matchReasons.push({
            type: 'jobType',
            score: 15,
            description: `Job type matches your preference: ${job.type}`
        });
    }

    // Experience level matching (15% weight)
    const experienceMatch = matchExperienceLevel(job.experience_level, userProfile.experience);
    if (experienceMatch.matches) {
        matchReasons.push({
            type: 'experience',
            score: 15,
            description: experienceMatch.reason
        });
    }

    // Salary range matching (10% weight)
    if (userProfile.preferredSalaryRange && job.salary) {
        const salaryMatch = matchSalaryRange(job.salary, userProfile.preferredSalaryRange);
        if (salaryMatch.matches) {
            matchReasons.push({
                type: 'salary',
                score: 10,
                description: salaryMatch.reason
            });
        }
    }

    // Calculate total score
    totalScore = matchReasons.reduce((sum, reason) => sum + reason.score, 0);

    // Normalize score to 0-100 range
    const normalizedScore = Math.min(100, Math.round(totalScore));

    return {
        score: normalizedScore,
        reasons: matchReasons.map(reason => reason.description)
    };
}

/**
 * Match skills between job requirements and user skills
 */
function matchSkills(job: Job, userSkills: string[]): string[] {
    const jobSkills = extractSkillsFromJob(job);
    return userSkills.filter(skill => 
        jobSkills.some(jobSkill => 
            jobSkill.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
    );
}

/**
 * Extract skills from job description and requirements
 */
function extractSkillsFromJob(job: Job): string[] {
    const skills = new Set<string>();
    
    // Extract from requirements
    job.requirements.forEach(req => {
        const words = req.split(/[\s,]+/);
        words.forEach(word => {
            if (isLikelySkill(word)) {
                skills.add(word.trim());
            }
        });
    });

    // Extract from description
    const descWords = job.description.split(/[\s,]+/);
    descWords.forEach(word => {
        if (isLikelySkill(word)) {
            skills.add(word.trim());
        }
    });

    return Array.from(skills);
}

/**
 * Basic heuristic to identify if a word is likely a technical skill
 */
function isLikelySkill(word: string): boolean {
    const commonSkills = [
        'react', 'javascript', 'typescript', 'python', 'java', 'c++',
        'node', 'express', 'mongodb', 'sql', 'aws', 'azure',
        'docker', 'kubernetes', 'ci/cd', 'git', 'agile', 'scrum'
    ];
    
    return commonSkills.some(skill => 
        word.toLowerCase().includes(skill.toLowerCase())
    );
}

/**
 * Match location preferences
 */
function matchLocation(jobLocation: string, preferredLocations: string[]): boolean {
    return preferredLocations.some(location =>
        jobLocation.toLowerCase().includes(location.toLowerCase()) ||
        location.toLowerCase() === 'remote' && jobLocation.toLowerCase().includes('remote')
    );
}

/**
 * Match experience level
 */
function matchExperienceLevel(jobLevel: string, userExperience: number): {
    matches: boolean;
    reason: string;
} {
    const levelRanges = {
        'Entry': { min: 0, max: 2 },
        'Mid-level': { min: 2, max: 5 },
        'Senior': { min: 5, max: 8 },
        'Lead': { min: 8, max: 12 },
        'Executive': { min: 10, max: 99 }
    };

    const range = levelRanges[jobLevel as keyof typeof levelRanges];
    if (!range) {
        return { matches: false, reason: '' };
    }

    const matches = userExperience >= range.min && userExperience <= range.max;
    return {
        matches,
        reason: matches
            ? `Your experience (${userExperience} years) matches the ${jobLevel} position requirements`
            : ''
    };
}

/**
 * Match salary range
 */
function matchSalaryRange(
    jobSalary: string,
    preferredRange: { min: number; max: number }
): {
    matches: boolean;
    reason: string;
} {
    // Extract numbers from salary string
    const numbers = jobSalary.match(/\d+/g);
    if (!numbers || numbers.length === 0) {
        return { matches: false, reason: '' };
    }

    // Convert to numbers and get range
    const salaryNumbers = numbers.map(n => parseInt(n, 10));
    const jobMin = Math.min(...salaryNumbers) * 1000; // Assuming K notation
    const jobMax = Math.max(...salaryNumbers) * 1000;

    // Check for overlap in ranges
    const matches = !(jobMax < preferredRange.min || jobMin > preferredRange.max);
    return {
        matches,
        reason: matches
            ? `Salary range (${jobSalary}) aligns with your preferences`
            : ''
    };
}

/**
 * Generate personalized job recommendations
 */
export function getJobRecommendations(
    jobs: Job[],
    userProfile: UserProfile,
    limit: number = 10
): Job[] {
    // Calculate match scores for all jobs
    const scoredJobs = jobs.map(job => ({
        job,
        ...calculateJobMatch(job, userProfile)
    }));

    // Sort by score and return top matches
    return scoredJobs
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ job, score, reasons }) => ({
            ...job,
            match_score: score,
            reasons_for_match: reasons
        }));
}
