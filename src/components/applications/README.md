# Applications Components

This folder contains all the components related to job applications functionality in the AI JobChain Connect application.

## Components

### ApplicationCard
A card component that displays individual job applications with:
- Job title and company
- Application status with color-coded badges
- Match scores (overall, skills, experience, location)
- Action buttons (view details, message employer)

### ApplicationList
A list component that displays multiple applications with:
- Search and filtering capabilities
- Status-based filtering
- Sorting options (by date, match score, job title, company)
- Grid layout for applications

### ApplicationDetails
A detailed view component that shows:
- Complete job information
- Application details (cover letter, resume, employer notes)
- Match analysis with progress bars
- Application timeline
- Action buttons (message employer, withdraw application)

### ApplicationsPage
The main page component that integrates all application components with:
- Statistics dashboard showing application counts by status
- Tabbed interface for different application statuses
- Modal dialog for detailed application view

## Usage

```tsx
import { ApplicationsPage } from '@/components/applications';

// In your component
<ApplicationsPage
  applications={applications}
  onMessageEmployer={handleMessageEmployer}
  onWithdrawApplication={handleWithdrawApplication}
/>
```

## Data Structure

Applications follow this interface:

```tsx
interface Application {
  id: string;
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    salary: string;
    type: string;
    description: string;
    requirements: string[];
    benefits: string[];
  };
  status: 'pending' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'rejected' | 'hired';
  overallMatchScore: number;
  skillMatchScore: number;
  experienceMatchScore: number;
  locationMatchScore: number;
  appliedAt: string;
  coverLetter?: string;
  customResume?: string;
  employerNotes?: string;
  updatedAt: string;
}
```

## Features

- **Status Management**: Track applications through different stages
- **AI Matching**: Display match scores for skills, experience, and location
- **Filtering & Search**: Find applications by various criteria
- **Responsive Design**: Works on all device sizes
- **Real-time Updates**: Status changes reflect immediately
- **Action Integration**: Message employers and withdraw applications

## Dependencies

- React with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Shadcn/ui components for UI elements
