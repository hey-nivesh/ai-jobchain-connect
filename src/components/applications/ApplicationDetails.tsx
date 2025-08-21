import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Clock, 
  MapPin, 
  DollarSign, 
  Building, 
  Star, 
  FileText, 
  MessageSquare,
  Calendar,
  User,
  Briefcase
} from 'lucide-react';

interface ApplicationDetailsProps {
  application: {
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
    status: string;
    overallMatchScore: number;
    skillMatchScore: number;
    experienceMatchScore: number;
    locationMatchScore: number;
    appliedAt: string;
    coverLetter?: string;
    customResume?: string;
    employerNotes?: string;
    updatedAt: string;
  };
  onClose: () => void;
  onMessageEmployer: (applicationId: string) => void;
  onWithdrawApplication: (applicationId: string) => void;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({
  application,
  onClose,
  onMessageEmployer,
  onWithdrawApplication
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'shortlisted':
        return 'bg-green-100 text-green-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'hired':
        return 'bg-emerald-100 text-emerald-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canWithdraw = ['pending', 'under_review'].includes(application.status);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Application Details</h2>
          <p className="text-muted-foreground">Review your application for {application.job.title}</p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{application.job.title}</CardTitle>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Building className="w-4 h-4" />
                <span>{application.job.company}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{application.job.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <span>{application.job.salary}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span>{application.job.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>Applied {formatDate(application.appliedAt)}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-medium mb-2">Job Description</h4>
                <p className="text-sm text-muted-foreground">{application.job.description}</p>
              </div>

              {application.job.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Requirements</h4>
                  <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                    {application.job.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {application.job.benefits.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Benefits</h4>
                  <div className="flex flex-wrap gap-2">
                    {application.job.benefits.map((benefit, index) => (
                      <Badge key={index} variant="secondary">{benefit}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cover Letter */}
          {application.coverLetter && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Cover Letter</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none">
                  <p className="whitespace-pre-wrap">{application.coverLetter}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Resume */}
          {application.customResume && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Resume</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Custom resume uploaded with application
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employer Notes */}
          {application.employerNotes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Employer Notes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm">{application.employerNotes}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Application Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <Badge className={`${getStatusColor(application.status)} text-sm px-3 py-1`}>
                  {getStatusLabel(application.status)}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <Button 
                  className="w-full" 
                  onClick={() => onMessageEmployer(application.id)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message Employer
                </Button>
                
                {canWithdraw && (
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onWithdrawApplication(application.id)}
                  >
                    Withdraw Application
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Match Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Match Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Overall Match</span>
                    <span className="text-sm font-bold">{application.overallMatchScore}%</span>
                  </div>
                  <Progress value={application.overallMatchScore} className="w-full" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Skills</span>
                    <span className="font-medium">{application.skillMatchScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Experience</span>
                    <span className="font-medium">{application.experienceMatchScore}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Location</span>
                    <span className="font-medium">{application.locationMatchScore}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Application Submitted</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(application.appliedAt)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(application.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
