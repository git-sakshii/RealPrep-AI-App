import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Play, 
  Pause, 
  Square, 
  ArrowLeft, 
  Brain,
  Zap,
  Activity,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Settings,
  Volume2,
  VolumeX
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface InterviewState {
  isRecording: boolean;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  currentQuestion: number;
  totalQuestions: number;
  timeElapsed: number;
  emotionData: {
    confidence: number;
    stress: number;
    engagement: number;
  };
}

const Interview = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    isRecording: false,
    isVideoEnabled: true,
    isAudioEnabled: true,
    currentQuestion: 1,
    totalQuestions: 10,
    timeElapsed: 0,
    emotionData: {
      confidence: 75,
      stress: 30,
      engagement: 85
    }
  });

  const [currentQuestion, setCurrentQuestion] = useState(
    "Tell me about yourself and your background in software development."
  );

  const questions = [
    "Tell me about yourself and your background in software development.",
    "What interests you most about this role and our company?",
    "Describe a challenging project you've worked on recently.",
    "How do you handle tight deadlines and pressure?",
    "What's your experience with our tech stack?",
    "Tell me about a time you had to learn a new technology quickly.",
    "How do you approach debugging complex issues?",
    "Describe your ideal work environment and team dynamics.",
    "What are your career goals for the next 3-5 years?",
    "Do you have any questions for us?"
  ];

  useEffect(() => {
    initializeCamera();
    const timer = setInterval(() => {
      if (interviewState.isRecording) {
        setInterviewState(prev => ({
          ...prev,
          timeElapsed: prev.timeElapsed + 1
        }));
      }
    }, 1000);

    return () => {
      clearInterval(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [interviewState.isRecording]);

  const initializeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const toggleRecording = () => {
    setInterviewState(prev => ({
      ...prev,
      isRecording: !prev.isRecording
    }));
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !interviewState.isVideoEnabled;
        setInterviewState(prev => ({
          ...prev,
          isVideoEnabled: !prev.isVideoEnabled
        }));
      }
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !interviewState.isAudioEnabled;
        setInterviewState(prev => ({
          ...prev,
          isAudioEnabled: !prev.isAudioEnabled
        }));
      }
    }
  };

  const nextQuestion = () => {
    if (interviewState.currentQuestion < interviewState.totalQuestions) {
      const nextQ = interviewState.currentQuestion + 1;
      setInterviewState(prev => ({
        ...prev,
        currentQuestion: nextQ
      }));
      setCurrentQuestion(questions[nextQ - 1]);
    }
  };

  const endInterview = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    navigate('/results');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Subtle animated gradients */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
            filter: 'blur(60px)',
          }}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-gray-800/30 backdrop-blur-xl bg-black/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-400" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Neural Interview Session</h1>
                  <p className="text-sm text-gray-400">
                    Question {interviewState.currentQuestion} of {interviewState.totalQuestions}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 rounded-xl">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-mono text-white">
                  {formatTime(interviewState.timeElapsed)}
                </span>
              </div>
              
              {interviewState.isRecording && (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full" />
                  <span className="text-sm font-medium text-red-400">RECORDING</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Feed */}
          <div className="lg:col-span-2">
            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl overflow-hidden">
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  className="w-full h-full object-cover"
                />
                
                {!interviewState.isVideoEnabled && (
                  <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-400">Camera disabled</p>
                    </div>
                  </div>
                )}

                {/* Overlay Controls */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-2xl px-6 py-3">
                    <motion.button
                      onClick={toggleVideo}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-xl transition-colors ${
                        interviewState.isVideoEnabled
                          ? 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {interviewState.isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                    </motion.button>

                    <motion.button
                      onClick={toggleAudio}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-3 rounded-xl transition-colors ${
                        interviewState.isAudioEnabled
                          ? 'bg-gray-700/50 text-white hover:bg-gray-600/50'
                          : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      }`}
                    >
                      {interviewState.isAudioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </motion.button>

                    <motion.button
                      onClick={toggleRecording}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-4 rounded-xl transition-colors ${
                        interviewState.isRecording
                          ? 'bg-red-500 text-white hover:bg-red-600'
                          : 'bg-indigo-500 text-white hover:bg-indigo-600'
                      }`}
                    >
                      {interviewState.isRecording ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </motion.button>

                    <motion.button
                      onClick={endInterview}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 rounded-xl bg-gray-700/50 text-white hover:bg-gray-600/50 transition-colors"
                    >
                      <Square className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Question */}
            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Current Question</h3>
              </div>
              
              <div className="bg-black/30 rounded-xl p-4 mb-4">
                <p className="text-gray-200 leading-relaxed">{currentQuestion}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  {interviewState.currentQuestion} of {interviewState.totalQuestions}
                </div>
                <button
                  onClick={nextQuestion}
                  disabled={interviewState.currentQuestion >= interviewState.totalQuestions}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Next Question
                </button>
              </div>
            </div>

            {/* Real-time Analytics */}
            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">Neural Analysis</h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Confidence', value: interviewState.emotionData.confidence, color: 'emerald' },
                  { label: 'Engagement', value: interviewState.emotionData.engagement, color: 'indigo' },
                  { label: 'Stress Level', value: interviewState.emotionData.stress, color: 'amber' },
                ].map((metric, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-300">{metric.label}</span>
                      <span className="text-sm font-medium text-white">{metric.value}%</span>
                    </div>
                    <div className="w-full bg-gray-700/50 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full bg-gradient-to-r ${
                          metric.color === 'emerald' ? 'from-emerald-500 to-emerald-400' :
                          metric.color === 'indigo' ? 'from-indigo-500 to-indigo-400' :
                          'from-amber-500 to-amber-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${metric.value}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-gray-900/30 backdrop-blur-xl border border-gray-800/30 rounded-2xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">AI Tips</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Maintain eye contact with the camera</p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Speak clearly and at a moderate pace</p>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-black/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-300">Use specific examples in your answers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;