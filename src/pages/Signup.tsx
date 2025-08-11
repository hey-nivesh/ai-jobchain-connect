import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { signup } from "../hooks/useAuth";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'jobseeker' | 'employer'>('jobseeker');
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password);
      setIsLoading(false);
      toast({
        title: "Account created successfully!",
        description: `Welcome to JobMatch AI, ${formData.firstName}!`,
      });
      navigate('/dashboard');
    } catch (error: any) {
      setIsLoading(false);
      setErrorMsg(error?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">
        <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <div className="flex items-center space-x-2 mb-4">
              <Link to="/" className="p-2 hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm">
                <ArrowLeft className="h-5 w-5" />
              </Link>
                             <div className="flex items-center space-x-2">
                 <div className="p-2 bg-white/20 backdrop-blur-sm border border-white/30">
                   <img src="/Main_Logo.png" alt="JobMatch AI Logo" className="h-5 w-5 object-contain" />
                 </div>
                 <span className="text-xl font-bold text-white">Sign Up</span>
               </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">Create your account</CardTitle>
            <CardDescription className="text-center text-white/70">
              Join JobMatch AI and find your perfect match
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="text-red-500 text-center text-sm font-medium">{errorMsg}</div>
              )}
              {/* User Type Selection */}
              <div className="space-y-2">
                <Label className="text-white">I am a:</Label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setUserType('jobseeker')}
                    className={`flex-1 p-3 border transition-all backdrop-blur-sm ${
                      userType === 'jobseeker'
                        ? 'border-white/40 bg-white/20 text-white'
                        : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`h-4 w-4 ${userType === 'jobseeker' ? 'text-white' : 'text-white/60'}`} />
                      <span className="font-medium">Job Seeker</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('employer')}
                    className={`flex-1 p-3 border transition-all backdrop-blur-sm ${
                      userType === 'employer'
                        ? 'border-white/40 bg-white/20 text-white'
                        : 'border-white/20 bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className={`h-4 w-4 ${userType === 'employer' ? 'text-white' : 'text-white/60'}`} />
                      <span className="font-medium">Employer</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0 backdrop-blur-sm"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0 backdrop-blur-sm"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 bg-white/10 border border-white/20 text-white placeholder:text-white/50 focus:border-white/40 focus:ring-0 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-white/50 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-white/20 text-white hover:bg-white/30 border border-white/30 font-bold backdrop-blur-sm transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>

              <div className="text-center text-sm text-white/70">
                Already have an account?{' '}
                <Link to="/login" className="text-white hover:text-white/80 font-medium transition-colors">
                  Sign in
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;