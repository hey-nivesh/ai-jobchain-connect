import React, { useState } from 'react';
import { Search, Filter, MapPin, DollarSign, Clock, Building, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterOptions {
  search: string;
  location: string;
  jobType: string;
  salaryRange: [number, number];
  experienceLevel: string;
  remoteWork: boolean;
  benefits: string[];
  skills: string[];
  companySize: string;
  industry: string;
}

interface JobFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onClearFilters: () => void;
  totalJobs: number;
  filteredJobs: number;
}

const JobFilters: React.FC<JobFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
  totalJobs,
  filteredJobs
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const jobTypes = [
    'Full-time',
    'Part-time',
    'Contract',
    'Internship',
    'Freelance'
  ];

  const experienceLevels = [
    'Entry Level',
    'Junior',
    'Mid Level',
    'Senior',
    'Lead',
    'Executive'
  ];

  const companySizes = [
    'Startup (1-50)',
    'Small (51-200)',
    'Medium (201-1000)',
    'Large (1000+)'
  ];

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Education',
    'Marketing',
    'Design',
    'Sales',
    'Engineering',
    'Product',
    'Operations'
  ];

  const commonBenefits = [
    'Health Insurance',
    'Remote Work',
    'Flexible Hours',
    'Stock Options',
    '401(k)',
    'Paid Time Off',
    'Professional Development',
    'Gym Membership'
  ];

  const popularSkills = [
    'React',
    'JavaScript',
    'Python',
    'Node.js',
    'TypeScript',
    'AWS',
    'Docker',
    'Kubernetes',
    'Machine Learning',
    'UI/UX Design'
  ];

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleBenefitToggle = (benefit: string) => {
    const newBenefits = filters.benefits.includes(benefit)
      ? filters.benefits.filter(b => b !== benefit)
      : [...filters.benefits, benefit];
    handleFilterChange('benefits', newBenefits);
  };

  const handleSkillToggle = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter(s => s !== skill)
      : [...filters.skills, skill];
    handleFilterChange('skills', newSkills);
  };

  const clearAllFilters = () => {
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return (
      filters.search ||
      filters.location ||
      filters.jobType ||
      filters.experienceLevel ||
      filters.remoteWork ||
      filters.benefits.length > 0 ||
      filters.skills.length > 0 ||
      filters.companySize ||
      filters.industry ||
      filters.salaryRange[0] > 0 ||
      filters.salaryRange[1] < 200000
    );
  };

  return (
    <div className="space-y-4">
      {/* Search and Basic Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search jobs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Location */}
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Job Type */}
            <Select value={filters.jobType} onValueChange={(value) => handleFilterChange('jobType', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                {jobTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Level */}
            <Select value={filters.experienceLevel} onValueChange={(value) => handleFilterChange('experienceLevel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                {experienceLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results and Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredJobs} of {totalJobs} jobs
        </div>
        <div className="flex items-center space-x-2">
          <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Advanced Filters
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          {hasActiveFilters() && (
            <Button variant="outline" size="sm" onClick={clearAllFilters}>
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Search: {filters.search}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('search', '')}
              />
            </Badge>
          )}
          {filters.location && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Location: {filters.location}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('location', '')}
              />
            </Badge>
          )}
          {filters.jobType && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Type: {filters.jobType}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleFilterChange('jobType', '')}
              />
            </Badge>
          )}
          {filters.benefits.map(benefit => (
            <Badge key={benefit} variant="secondary" className="flex items-center space-x-1">
              <span>{benefit}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleBenefitToggle(benefit)}
              />
            </Badge>
          ))}
          {filters.skills.map(skill => (
            <Badge key={skill} variant="secondary" className="flex items-center space-x-1">
              <span>{skill}</span>
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => handleSkillToggle(skill)}
              />
            </Badge>
          ))}
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Salary Range */}
              <div>
                <Label className="text-sm font-medium">Salary Range</Label>
                <div className="mt-2 space-y-2">
                  <Slider
                    value={filters.salaryRange}
                    onValueChange={(value) => handleFilterChange('salaryRange', value)}
                    max={200000}
                    min={0}
                    step={5000}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${filters.salaryRange[0].toLocaleString()}</span>
                    <span>${filters.salaryRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Remote Work */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remoteWork"
                  checked={filters.remoteWork}
                  onCheckedChange={(checked) => handleFilterChange('remoteWork', checked)}
                />
                <Label htmlFor="remoteWork">Remote Work Available</Label>
              </div>

              {/* Company Size */}
              <div>
                <Label className="text-sm font-medium">Company Size</Label>
                <Select value={filters.companySize} onValueChange={(value) => handleFilterChange('companySize', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sizes</SelectItem>
                    {companySizes.map(size => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Industry */}
              <div>
                <Label className="text-sm font-medium">Industry</Label>
                <Select value={filters.industry} onValueChange={(value) => handleFilterChange('industry', value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Industries</SelectItem>
                    {industries.map(industry => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Benefits */}
              <div>
                <Label className="text-sm font-medium">Benefits</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {commonBenefits.map(benefit => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <Checkbox
                        id={benefit}
                        checked={filters.benefits.includes(benefit)}
                        onCheckedChange={() => handleBenefitToggle(benefit)}
                      />
                      <Label htmlFor={benefit} className="text-sm">{benefit}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div>
                <Label className="text-sm font-medium">Required Skills</Label>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {popularSkills.map(skill => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox
                        id={skill}
                        checked={filters.skills.includes(skill)}
                        onCheckedChange={() => handleSkillToggle(skill)}
                      />
                      <Label htmlFor={skill} className="text-sm">{skill}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default JobFilters;
