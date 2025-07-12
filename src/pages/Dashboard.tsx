import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Upload, 
  Play, 
  BarChart3, 
  Settings, 
  LogOut, 
  FileText, 
  Brain, 
  Target, 
  TrendingUp,
  Clock,
  Award,
  Zap,
  ChevronRight,
  Plus,
  Calendar,
  Users,
  Star,
  Activity,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface UserProfile {
  displayName: string;
  email: string;
  expertise: string[];
  experience: string;
  interviewsCompleted: number;
  photoURL?: string;
  skills?: string[];
  location?: string;
}

interface InterviewSession {
  id: string;
  date: string;
  score: number;
  duration: string;
  type: string;
  status: 'completed' | 'in-progress' | 'scheduled';
}

const Dashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data for demonstration
  const recentSessions: InterviewSession[] = [
    { id: '1', date: '2024-01-15', score: 85, duration: '45 min', type: 'Technical', status: 'completed' },
    { id: '2', date: '2024-01-12', score: 92, duration: '38 min', type: 'Behavioral', status: 'completed' },
    { id: '3', date: '2024-01-10', score: 78, duration: '52 min', type: 'System Design', status: 'completed' },
  ];

  const stats = [
    { label: 'Interviews Completed', value: '12', icon: Target, color: 'from-emerald-500 to-teal-500' },
    { label: 'Average Score', value: '85%', icon: TrendingUp, color: 'from-indigo-500 to-purple-500' },
    { label: 'Total Practice Time', value: '8.5h', icon: Clock, color: 'from-amber-500 to-orange-500' },
    { label: 'Skill Level', value: 'Advanced', icon: Award, color: 'from-violet-500 to-purple-500' },
  ];

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as UserProfile);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleStartInterview = () => {
    navigate('/interview');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading neural interface...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-20 w-64 h-64 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-20 right-20 w-48 h-48 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/50 backdrop-blur-xl bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  RealPrep
                </h1>
                <p className="text-sm text-gray-400">Neural Command Center</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-white">
                    {userProfile?.displayName || 'Neural Agent'}
                  </p>
                  <p className="text-xs text-gray-400">{userProfile?.email}</p>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <LogOut className="w-5 h-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
              <nav className="space-y-2">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'interviews', label: 'Interviews', icon: Play },
                  { id: 'analytics', label: 'Analytics', icon: Activity },
                  { id: 'profile', label: 'Profile', icon: User },
                  { id: 'settings', label: 'Settings', icon: Settings },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? 'bg-gradient-to-r from-indigo-500/20 to-violet-500/20 border border-indigo-500/30 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Welcome Section */}
                  <div className="bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-emerald-500/10 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                          Welcome back, {userProfile?.displayName?.split(' ')[0] || 'Agent'}
                        </h2>
                        <p className="text-gray-400">
                          Ready to enhance your interview performance?
                        </p>
                      </div>
                      <motion.button
                        onClick={handleStartInterview}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-500 to-violet-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                      >
                        <Zap className="w-5 h-5" />
                        Start Interview
                      </motion.button>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { icon: FileText, label: 'Upload Resume', desc: 'Update your profile' },
                        { icon: BookOpen, label: 'Practice Questions', desc: 'Review common questions' },
                        { icon: Briefcase, label: 'Mock Interview', desc: 'Full interview simulation' },
                      ].map((action, index) => (
                        <motion.div
                          key={index}
                          whileHover={{ y: -5 }}
                          className="p-4 bg-black/30 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-indigo-500/30 transition-all duration-300 cursor-pointer"
                        >
                          <action.icon className="w-8 h-8 text-indigo-400 mb-3" />
                          <h3 className="font-semibold text-white mb-1">{action.label}</h3>
                          <p className="text-sm text-gray-400">{action.desc}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6 hover:border-gray-700/50 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                          <p className="text-sm text-gray-400">{stat.label}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Sessions */}
                  <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-white">Recent Sessions</h3>
                      <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {recentSessions.map((session, index) => (
                        <motion.div
                          key={session.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-black/30 backdrop-blur-sm border border-gray-700/50 rounded-xl hover:border-indigo-500/30 transition-all duration-300"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                              <Play className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-white">{session.type} Interview</h4>
                              <p className="text-sm text-gray-400">{session.date} • {session.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-lg font-bold text-emerald-400">{session.score}%</p>
                              <p className="text-xs text-gray-400">Score</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Other tabs content would go here */}
              {activeTab !== 'overview' && (
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Section
                  </h3>
                  <p className="text-gray-400">
                    This section is under development. Advanced neural interfaces coming soon.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;