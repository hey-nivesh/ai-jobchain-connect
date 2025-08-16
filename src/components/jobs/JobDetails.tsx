import React, { useState } from 'react';
import { 
  MapPin, 
  DollarSign, 
  Clock, 
  Building, 
  Calendar, 
  Users, 
  CheckCircle, 
  X,
  Bookmark,
  Share2,
  Send,
  FileText,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  benefits: string[];
  postedDate: string;
  deadline: string;
  applications: number;
  status: 'active' | 'closed' | 'draft';
  employerId: string;
  duration: string;
}

interface JobDetailsProps {
  job: Job;
  onClose: () => void;
  onApply: (jobId: string, applicationData: any) => void;
  onSave: (jobId: string) => void;
  isSaved?: boolean;
  isApplied?: boolean;
  showActions?: boolean;
}

const JobDetails: React.FC<JobDetailsProps> = ({
  job,
  onClose,
  onApply,
  onSave,
  isSaved = false,
  isApplied = false,
  showActions = true
}) => {
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resume: '',
    portfolio: '',
    expectedSalary: ''
  });

  const handleApply = () => {
    onApply(job.id, applicationData);
    setIsApplicationOpen(false);
    setApplicationData({
      coverLetter: '',
      resume: '',
      portfolio: '',
      expectedSalary: ''
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'closed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'draft':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-xl p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <Badge className={`${getStatusColor(job.status)} border`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Posted {formatDate(job.postedDate)}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{job.title}</h1>
          <div className="flex items-center space-x-2 text-lg text-muted-foreground">
            <Building className="w-5 h-5" />
            <span className="font-medium">{job.company}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {showActions && (
            <>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSave(job.id)}
                className={isSaved ? 'bg-primary/20 text-primary border-primary' : ''}
              >
                <Bookmark className={`w-4 h-4 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </>
          )}
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Job Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Job Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">{job.salary}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="font-medium">{job.type}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Duration</p>
                <p className="font-medium">{job.duration}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {job.description}
          </p>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {job.requirements.map((req, index) => (
              <li key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{req}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Benefits */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit, index) => (
              <Badge key={index} variant="secondary" className="text-sm">
                {benefit}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Application Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">Application Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Applications</p>
                <p className="font-medium">{job.applications}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Deadline</p>
                <p className="font-medium">{formatDate(job.deadline)}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="font-medium capitalize">{job.status}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex items-center justify-center space-x-4 pt-6 border-t border-border">
          {isApplied ? (
            <div className="text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-green-600 font-medium">Application Submitted!</p>
              <p className="text-sm text-muted-foreground">We'll review your application and get back to you soon.</p>
            </div>
          ) : (
            <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="flex items-center space-x-2">
                  <Send className="w-5 h-5" />
                  <span>Apply for this Position</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Apply for {job.title}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Tell us why you're interested in this position..."
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="resume">Resume URL</Label>
                    <Input
                      id="resume"
                      type="url"
                      placeholder="https://example.com/resume.pdf"
                      value={applicationData.resume}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, resume: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio">Portfolio URL (Optional)</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      placeholder="https://example.com/portfolio"
                      value={applicationData.portfolio}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, portfolio: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expectedSalary">Expected Salary</Label>
                    <Input
                      id="expectedSalary"
                      placeholder="e.g., $80,000 - $100,000"
                      value={applicationData.expectedSalary}
                      onChange={(e) => setApplicationData(prev => ({ ...prev, expectedSalary: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsApplicationOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApply}>
                      Submit Application
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
    </div>
  );
};

export default JobDetails;
