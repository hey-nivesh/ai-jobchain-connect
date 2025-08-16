import React from 'react';
import ApplicationsPage from './ApplicationsPage';

// Sample demo data for applications
const demoApplications = [
  {
    id: '1',
    job: {
      id: 'job1',
      title: 'Senior React Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120,000 - $150,000',
      type: 'Full-time',
      description: 'We are looking for a senior React developer to join our team and help build amazing user experiences.',
      requirements: [
        '5+ years of React experience',
        'Strong TypeScript skills',
        'Experience with modern frontend tools',
        'Team collaboration skills'
      ],
      benefits: [
        'Health Insurance',
        'Remote Work',
        'Stock Options',
        '401(k)',
        'Flexible Hours'
      ]
    },
    status: 'pending',
    overallMatchScore: 85,
    skillMatchScore: 90,
    experienceMatchScore: 80,
    locationMatchScore: 85,
    appliedAt: '2024-01-15T10:30:00Z',
    coverLetter: 'I am excited to apply for the Senior React Developer position at TechCorp Inc. With over 6 years of experience in React development and a passion for creating exceptional user experiences, I believe I would be a great fit for your team...',
    customResume: 'resume.pdf',
    employerNotes: '',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    job: {
      id: 'job2',
      title: 'Frontend Engineer',
      company: 'StartupXYZ',
      location: 'New York, NY',
      salary: '$90,000 - $110,000',
      type: 'Full-time',
      description: 'Join our fast-growing startup and help shape the future of our product.',
      requirements: [
        '3+ years of frontend development',
        'React/Vue.js experience',
        'CSS and responsive design skills',
        'Fast learner and team player'
      ],
      benefits: [
        'Health Insurance',
        'Remote Work',
        'Equity',
        'Unlimited PTO'
      ]
    },
    status: 'under_review',
    overallMatchScore: 78,
    skillMatchScore: 75,
    experienceMatchScore: 80,
    locationMatchScore: 79,
    appliedAt: '2024-01-10T14:20:00Z',
    coverLetter: 'I am writing to express my interest in the Frontend Engineer position at StartupXYZ. I am passionate about building user-friendly web applications and would love to contribute to your innovative team...',
    customResume: '',
    employerNotes: 'Strong candidate, good technical skills. Schedule interview for next week.',
    updatedAt: '2024-01-12T09:15:00Z'
  },
  {
    id: '3',
    job: {
      id: 'job3',
      title: 'UI/UX Designer',
      company: 'Design Studio Pro',
      location: 'Austin, TX',
      salary: '$80,000 - $100,000',
      type: 'Contract',
      description: 'We need a creative UI/UX designer to help us create beautiful and functional interfaces.',
      requirements: [
        'Portfolio of design work',
        'Figma/Sketch experience',
        'User research skills',
        'Prototyping abilities'
      ],
      benefits: [
        'Flexible Schedule',
        'Remote Work',
        'Creative Freedom',
        'Competitive Rate'
      ]
    },
    status: 'shortlisted',
    overallMatchScore: 92,
    skillMatchScore: 95,
    experienceMatchScore: 88,
    locationMatchScore: 93,
    appliedAt: '2024-01-08T11:45:00Z',
    coverLetter: 'As a passionate UI/UX designer with a love for creating intuitive user experiences, I am excited about the opportunity to join Design Studio Pro...',
    customResume: '',
    employerNotes: 'Excellent portfolio, great design sense. Top candidate for the position.',
    updatedAt: '2024-01-14T16:30:00Z'
  },
  {
    id: '4',
    job: {
      id: 'job4',
      title: 'Full Stack Developer',
      company: 'Enterprise Solutions',
      location: 'Chicago, IL',
      salary: '$100,000 - $130,000',
      type: 'Full-time',
      description: 'Join our enterprise team and work on large-scale applications.',
      requirements: [
        'Full stack development experience',
        'Node.js and React knowledge',
        'Database design skills',
        'Agile methodology experience'
      ],
      benefits: [
        'Health Insurance',
        'Dental Coverage',
        'Vision Coverage',
        '401(k) with Match',
        'Professional Development'
      ]
    },
    status: 'interview_scheduled',
    overallMatchScore: 88,
    skillMatchScore: 85,
    experienceMatchScore: 90,
    locationMatchScore: 89,
    appliedAt: '2024-01-05T09:00:00Z',
    coverLetter: 'I am excited to apply for the Full Stack Developer position at Enterprise Solutions. With my experience in both frontend and backend development...',
    customResume: '',
    employerNotes: 'Strong technical background. Interview scheduled for January 20th at 2 PM.',
    updatedAt: '2024-01-16T13:45:00Z'
  },
  {
    id: '5',
    job: {
      id: 'job5',
      title: 'DevOps Engineer',
      company: 'CloudTech',
      location: 'Seattle, WA',
      salary: '$110,000 - $140,000',
      type: 'Full-time',
      description: 'Help us build and maintain our cloud infrastructure.',
      requirements: [
        'AWS/Azure experience',
        'Docker and Kubernetes knowledge',
        'CI/CD pipeline experience',
        'Linux administration skills'
      ],
      benefits: [
        'Health Insurance',
        'Remote Work',
        'Stock Options',
        'Home Office Setup',
        'Conference Budget'
      ]
    },
    status: 'rejected',
    overallMatchScore: 65,
    skillMatchScore: 60,
    experienceMatchScore: 70,
    locationMatchScore: 65,
    appliedAt: '2024-01-03T15:30:00Z',
    coverLetter: 'I am interested in the DevOps Engineer position at CloudTech. While my experience is primarily in development...',
    customResume: '',
    employerNotes: 'Good candidate but lacks required DevOps experience. Keep in mind for future development roles.',
    updatedAt: '2024-01-11T10:20:00Z'
  },
  {
    id: '6',
    job: {
      id: 'job6',
      title: 'Product Manager',
      company: 'Innovation Labs',
      location: 'Boston, MA',
      salary: '$120,000 - $160,000',
      type: 'Full-time',
      description: 'Lead product strategy and development for our innovative solutions.',
      requirements: [
        '5+ years of product management',
        'Technical background preferred',
        'User research experience',
        'Agile/Scrum methodology'
      ],
      benefits: [
        'Health Insurance',
        'Stock Options',
        'Flexible Hours',
        'Professional Development',
        'Relocation Assistance'
      ]
    },
    status: 'hired',
    overallMatchScore: 95,
    skillMatchScore: 92,
    experienceMatchScore: 98,
    locationMatchScore: 95,
    appliedAt: '2024-01-01T08:00:00Z',
    coverLetter: 'I am thrilled to apply for the Product Manager position at Innovation Labs. With my background in both technology and business...',
    customResume: '',
    employerNotes: 'Perfect fit for the role. Offer extended and accepted.',
    updatedAt: '2024-01-15T17:00:00Z'
  }
];

const DemoApplicationsPage: React.FC = () => {
  const handleMessageEmployer = (applicationId: string) => {
    console.log('Message employer for application:', applicationId);
    // In a real app, this would open a messaging interface
    alert(`Opening messaging interface for application ${applicationId}`);
  };

  const handleWithdrawApplication = (applicationId: string) => {
    console.log('Withdraw application:', applicationId);
    // In a real app, this would show a confirmation dialog
    if (confirm('Are you sure you want to withdraw this application?')) {
      alert(`Application ${applicationId} withdrawn successfully`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            🎯 Demo Applications Dashboard
          </h1>
          <p className="text-muted-foreground">
            This is a demonstration of the applications system with sample data. 
            All functionality is working - try filtering, sorting, and viewing details!
          </p>
        </div>
        
        <ApplicationsPage
          applications={demoApplications}
          onMessageEmployer={handleMessageEmployer}
          onWithdrawApplication={handleWithdrawApplication}
        />
      </div>
    </div>
  );
};

export default DemoApplicationsPage;
