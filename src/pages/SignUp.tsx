import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, BriefcaseIcon, AlertCircle, Code, Server, Database, Cloud, Smartphone, Palette, Eye, EyeOff, MapPin, GraduationCap, DollarSign, Linkedin, Globe, ArrowLeft, ArrowRight, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

type SignUpFormData = {
  fullName: string;
  email: string;
  password: string;
  expertise: string[];
  experience: string;
  location: string;
  education: string;
  expectedSalary: string;
  linkedin: string;
  portfolio: string;
  skills: string;
};

const expertise = [
  { name: 'Frontend Development', icon: <Code className="h-4 w-4" /> },
  { name: 'Backend Development', icon: <Server className="h-4 w-4" /> },
  { name: 'Full Stack', icon: <Database className="h-4 w-4" /> },
  { name: 'DevOps', icon: <Cloud className="h-4 w-4" /> },
  { name: 'Mobile Development', icon: <Smartphone className="h-4 w-4" /> },
  { name: 'UI/UX Design', icon: <Palette className="h-4 w-4" /> },
];

const SignUp = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<SignUpFormData>();

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setError('');
      setLoading(true);
      
      const userCredential = await signup(data.email, data.password);
      const skillsArray = data.skills ? data.skills.split(',').map(skill => skill.trim()) : [];
      
      const userProfileData = {
        displayName: data.fullName,
        email: data.email,
        expertise: data.expertise || [],
        experience: data.experience || '',
        location: data.location || '',
        education: data.education || '',
        expectedSalary: data.expectedSalary || '',
        linkedin: data.linkedin || '',
        portfolio: data.portfolio || '',
        skills: skillsArray,
        photoURL: '',
        resumeURL: '',
        interviewsCompleted: 0,
        createdAt: new Date().toISOString(),
      };
      
      await setDoc(doc(db, 'users', userCredential.user.uid), userProfileData);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Signup error:', err);
      
      if (err.code === 'auth/email-already-in-use') {
        setError('Neural profile already exists for this email. Please use a different email or access existing profile.');
      } else if (err.code === 'auth/weak-password') {
        setError('Security protocol requires a stronger password. Please enhance your credentials.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email format detected. Please verify your input.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network connection failed. Please check your connection and retry.');
      } else {
        setError('Failed to initialize neural profile. Please retry the process.');
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ['fullName', 'email', 'password'] 
      : ['expertise'];
    
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cyberpunk Background */}
      <div className="absolute inset-0">
        {/* Animated grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Moving gradient orbs */}
        <motion.div
          className="absolute top-10 left-10 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 200, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,0,255,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -150, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Data streams */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
            style={{
              left: `${20 + i * 20}%`,
              height: '100vh',
            }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity,
            }}
          />
        ))}
      </div>

      {/* Back to home button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="absolute top-6 left-6 z-10"
      >
        <Link
          to="/"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 transition-all duration-300"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              {[1, 2].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <motion.div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      step >= stepNumber
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 border-cyan-500 text-white'
                        : 'border-gray-600 text-gray-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {stepNumber}
                  </motion.div>
                  {stepNumber < 2 && (
                    <div className={`w-16 h-0.5 mx-2 transition-all duration-300 ${
                      step > stepNumber ? 'bg-cyan-500' : 'bg-gray-600'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="text-center">
              <p className="text-gray-400">
                Step {step} of 2: {step === 1 ? 'Basic Information' : 'Neural Specialization'}
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="relative">
            {/* Glowing border effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
            
            <div className="relative bg-black/80 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 mb-4"
                >
                  <Cpu className="w-8 h-8 text-white" />
                </motion.div>
                
                <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  Initialize Neural Profile
                </h1>
                <p className="text-gray-400">
                  Create your advanced interview training profile
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-red-400 text-sm">{error}</p>
                    {error.includes('already exists') && (
                      <Link to="/login" className="text-cyan-400 text-sm font-medium underline mt-1 block">
                        Access existing profile
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Basic Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('fullName', { required: 'Full name is required' })}
                              type="text"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="John Doe"
                            />
                          </div>
                          {errors.fullName && (
                            <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
                          )}
                        </div>

                        {/* Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                  message: 'Invalid email address',
                                },
                              })}
                              type="email"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="john@example.com"
                            />
                          </div>
                          {errors.email && (
                            <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                          )}
                        </div>

                        {/* Password */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Security Key
                          </label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('password', {
                                required: 'Password is required',
                                minLength: {
                                  value: 6,
                                  message: 'Password must be at least 6 characters',
                                },
                              })}
                              type={showPassword ? 'text' : 'password'}
                              className="w-full pl-10 pr-12 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="••••••••"
                            />
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition-colors"
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                          </div>
                          {errors.password && (
                            <p className="mt-1 text-sm text-red-400">{errors.password.message}</p>
                          )}
                        </div>

                        {/* Experience Level */}
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Experience Level
                          </label>
                          <div className="relative">
                            <BriefcaseIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                              {...register('experience')}
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white appearance-none transition-all duration-300"
                            >
                              <option value="">Select experience level</option>
                              <option value="0-1 years">Neural Initiate (0-1 years)</option>
                              <option value="1-3 years">Code Apprentice (1-3 years)</option>
                              <option value="3-5 years">Digital Warrior (3-5 years)</option>
                              <option value="5-10 years">Cyber Veteran (5-10 years)</option>
                              <option value="10+ years">Tech Overlord (10+ years)</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Additional Information Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Location
                          </label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('location')}
                              type="text"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="Neo Tokyo, Cyber District"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Education
                          </label>
                          <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('education')}
                              type="text"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="B.S. Cybernetic Engineering"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Skills (comma separated)
                          </label>
                          <div className="relative">
                            <Code className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('skills')}
                              type="text"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="Neural Networks, Quantum Computing, AI"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Expected Salary
                          </label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('expectedSalary')}
                              type="text"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="$100,000 - $150,000"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Neural Network Profile
                          </label>
                          <div className="relative">
                            <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('linkedin')}
                              type="text"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Digital Portfolio
                          </label>
                          <div className="relative">
                            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <input
                              {...register('portfolio')}
                              type="text"
                              className="w-full pl-10 pr-4 py-3 bg-black/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-white placeholder-gray-400 transition-all duration-300"
                              placeholder="https://yourportfolio.cyber"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Next Button */}
                      <motion.button
                        type="button"
                        onClick={nextStep}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-violet-600 transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        Next: Neural Specialization
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      {/* Technical Expertise */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-4">
                          Neural Specializations
                        </label>
                        <div className="bg-black/50 border border-gray-600 p-6 rounded-lg">
                          <p className="text-sm text-gray-400 mb-4">
                            Select your primary neural pathways and technical specializations:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {expertise.map((skill) => (
                              <motion.label
                                key={skill.name}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center p-3 bg-black/70 border border-gray-600 rounded-lg hover:border-cyan-500/50 transition-all duration-300 cursor-pointer group"
                              >
                                <input
                                  type="checkbox"
                                  value={skill.name}
                                  {...register('expertise', {
                                    required: 'Select at least one specialization',
                                  })}
                                  className="rounded bg-black/50 border-gray-600 text-cyan-500 focus:ring-cyan-500 mr-3"
                                />
                                <div className="flex items-center">
                                  <span className="text-cyan-400 mr-2 group-hover:text-cyan-300 transition-colors">
                                    {skill.icon}
                                  </span>
                                  <span className="text-sm text-white group-hover:text-cyan-100 transition-colors">
                                    {skill.name}
                                  </span>
                                </div>
                              </motion.label>
                            ))}
                          </div>
                          {errors.expertise && (
                            <p className="mt-3 text-sm text-red-400">{errors.expertise.message}</p>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <motion.button
                          type="button"
                          onClick={prevStep}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="py-3 bg-black/50 border border-gray-600 text-white rounded-lg hover:bg-gray-800 transition-all duration-300 flex-1 flex items-center justify-center gap-2"
                        >
                          <ArrowLeft className="w-5 h-5" />
                          Back
                        </motion.button>

                        <motion.button
                          type="submit"
                          disabled={loading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-lg font-semibold hover:from-indigo-600 hover:to-violet-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex-1"
                        >
                          {loading ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Initializing Neural Profile...
                            </div>
                          ) : (
                            'Initialize Profile'
                          )}
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              {/* Sign In Link */}
              <div className="mt-8 text-center">
                <p className="text-gray-400">
                  Already have a neural profile?{' '}
                  <Link 
                    to="/login" 
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    Access System
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;