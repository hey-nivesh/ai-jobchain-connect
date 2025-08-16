import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Briefcase, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react';
import ApplicationList from './ApplicationList';
import ApplicationDetails from './ApplicationDetails';

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
}

interface ApplicationsPageProps {
  applications: Application[];
  onMessageEmployer: (applicationId: string) => void;
  onWithdrawApplication: (applicationId: string) => void;
}

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  applications,
  onMessageEmployer,
  onWithdrawApplication
}) => {
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const statusCounts = {
    pending: applications.filter(app => app.status === 'pending').length,
    under_review: applications.filter(app => app.status === 'under_review').length,
    shortlisted: applications.filter(app => app.status === 'shortlisted').length,
    interview_scheduled: applications.filter(app => app.status === 'interview_scheduled').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
    hired: applications.filter(app => app.status === 'hired').length
  };

  const totalApplications = applications.length;
  const activeApplications = applications.filter(app => 
    ['pending', 'under_review', 'shortlisted', 'interview_scheduled'].includes(app.status)
  ).length;

  const handleViewDetails = (applicationId: string) => {
    const application = applications.find(app => app.id === applicationId);
    if (application) {
      setSelectedApplication(application);
      setIsDetailsOpen(true);
    }
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedApplication(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'under_review':
        return <AlertCircle className="w-4 h-4" />;
      case 'shortlisted':
        return <CheckCircle className="w-4 h-4" />;
      case 'interview_scheduled':
        return <MessageSquare className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'hired':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Applications</h1>
          <p className="text-muted-foreground">
            Track and manage your job applications
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="px-3 py-1">
            {totalApplications} Total
          </Badge>
          <Badge variant="outline" className="px-3 py-1">
            {activeApplications} Active
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.pending}</p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.under_review}</p>
                <p className="text-xs text-muted-foreground">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.shortlisted}</p>
                <p className="text-xs text-muted-foreground">Shortlisted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.interview_scheduled}</p>
                <p className="text-xs text-muted-foreground">Interview</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.rejected}</p>
                <p className="text-xs text-muted-foreground">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-2xl font-bold">{statusCounts.hired}</p>
                <p className="text-xs text-muted-foreground">Hired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="all">All ({totalApplications})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({statusCounts.pending})</TabsTrigger>
          <TabsTrigger value="under_review">Review ({statusCounts.under_review})</TabsTrigger>
          <TabsTrigger value="shortlisted">Shortlisted ({statusCounts.shortlisted})</TabsTrigger>
          <TabsTrigger value="interview_scheduled">Interview ({statusCounts.interview_scheduled})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({statusCounts.rejected})</TabsTrigger>
          <TabsTrigger value="hired">Hired ({statusCounts.hired})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ApplicationList
            applications={applications}
            onViewDetails={handleViewDetails}
            onMessageEmployer={onMessageEmployer}
          />
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <ApplicationList
            applications={applications.filter(app => app.status === 'pending')}
            onViewDetails={handleViewDetails}
            onMessageEmployer={onMessageEmployer}
          />
        </TabsContent>

        <TabsContent value="under_review" className="space-y-4">
          <ApplicationList
            applications={applications.filter(app => app.status === 'under_review')}
            onViewDetails={handleViewDetails}
            onMessageEmployer={onMessageEmployer}
          />
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          <ApplicationList
            applications={applications.filter(app => app.status === 'shortlisted')}
            onViewDetails={handleViewDetails}
            onMessageEmployer={onMessageEmployer}
          />
        </TabsContent>

        <TabsContent value="interview_scheduled" className="space-y-4">
          <ApplicationList
            applications={applications.filter(app => app.status === 'interview_scheduled')}
            onViewDetails={handleViewDetails}
            onMessageEmployer={onMessageEmployer}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <ApplicationList
            applications={applications.filter(app => app.status === 'rejected')}
            onViewDetails={handleViewDetails}
            onMessageEmployer={onMessageEmployer}
          />
        </TabsContent>

        <TabsContent value="hired" className="space-y-4">
          <ApplicationList
            applications={applications.filter(app => app.status === 'hired')}
            onViewDetails={handleViewDetails}
            onMessageEmployer={onMessageEmployer}
          />
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedApplication && (
            <ApplicationDetails
              application={selectedApplication}
              onClose={handleCloseDetails}
              onMessageEmployer={onMessageEmployer}
              onWithdrawApplication={onWithdrawApplication}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationsPage;
