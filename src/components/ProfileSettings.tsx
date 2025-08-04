import { useState } from 'react';
import { Settings, Upload, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';

export const ProfileSettings = () => {
  const { profile, addSkill, removeSkill, updateDescription, updateResume, saveProfile } = useProfile();
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill);
      setNewSkill('');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'application/pdf' || file.type.includes('document'))) {
      updateResume(file);
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
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto glass backdrop-blur-md">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* Resume Upload */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Resume</h3>
            <div className="border-2 border-dashed border-border/50 rounded-lg p-6 text-center glass-card gradient-glass-card">
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
              {profile.resume && (
                <p className="text-sm text-success mt-2">
                  ✅ {profile.resume.name} uploaded successfully
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
                onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1"
              />
              <Button onClick={handleAddSkill} size="sm" className="gap-1 backdrop-blur-sm glass-button">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 backdrop-blur-sm bg-secondary/80">
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
              value={profile.description}
              onChange={(e) => updateDescription(e.target.value)}
              className="min-h-[120px]"
              maxLength={500}
            />
            <p className="text-xs text-muted-foreground text-right">
              {profile.description.length}/500 characters
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" className="backdrop-blur-sm">Cancel</Button>
            <Button onClick={saveProfile} className="btn-primary backdrop-blur-sm glass-button">Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}; 