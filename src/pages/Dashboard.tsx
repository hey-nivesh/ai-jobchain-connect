import { useState, useEffect } from 'react';
import { Search, Settings, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';

// Mock job data
const mockJobs = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    type: 'full-time'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    salary: '$130k - $160k',
    type: 'full-time'
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Remote',
    salary: '$80k - $100k',
    type: 'full-time'
  },
  {
    id: '4',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    location: 'Austin, TX',
    salary: '$90k - $120k',
    type: 'part-time'
  },
  {
    id: '5',
    title: 'Data Scientist',
    company: 'DataFlow',
    location: 'Seattle, WA',
    salary: '$140k - $170k',
    type: 'full-time'
  },
  {
    id: '6',
    title: 'Mobile Developer',
    company: 'AppWorks',
    location: 'Los Angeles, CA',
    salary: '$100k - $130k',
    type: 'full-time'
  }
];

const JobCard = ({ job }: { job: any }) => {
  return (
    <Card className="group hover:shadow-elevation transition-all duration-300 hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {job.title}
            </CardTitle>
            <p className="text-muted-foreground font-medium">{job.company}</p>
          </div>
          <Badge variant={job.type === 'full-time' ? 'default' : 'secondary'} className="capitalize">
            {job.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">📍 {job.location}</p>
          <p className="text-sm font-semibold text-foreground">💰 {job.salary}</p>
          <Button className="w-full btn-primary">
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const ProfileSettings = () => {
  const [skills, setSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js']);
  const [newSkill, setNewSkill] = useState('');
  const [description, setDescription] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      setResumeFile(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Profile Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Resume Upload */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resume</h3>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-2">
                Upload your resume (PDF or DOC)
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
                id="resume-upload"
              />
              <label htmlFor="resume-upload">
                <Button variant="outline" className="cursor-pointer" asChild>
                  <span>Choose File</span>
                </Button>
              </label>
              {resumeFile && (
                <p className="text-sm text-success mt-2">
                  ✅ {resumeFile.name} uploaded successfully
                </p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Skills</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Add a skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1"
              />
              <Button onClick={addSkill} size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:bg-destructive/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Description</h3>
            <Textarea
              placeholder="Tell us about yourself, your experience, and what you're looking for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline">Cancel</Button>
            <Button className="btn-primary">Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(mockJobs);

  useEffect(() => {
    const filtered = mockJobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredJobs(filtered);
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Job Dashboard</h1>
            <p className="text-muted-foreground">Discover your next career opportunity</p>
          </div>
          <ProfileSettings />
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs, companies, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No jobs found matching your search.</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm('')}
              className="mt-4"
            >
              Clear Search
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;