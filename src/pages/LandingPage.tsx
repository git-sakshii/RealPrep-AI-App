import { motion } from 'framer-motion';
import { ArrowRight, Mic, Brain, BarChart as ChartBar, CheckCircle, Zap, BookOpen, Award, Shield, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import GlassSpheres from '../components/GlassSpheres';

const features = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: "Neural Interview Engine",
    description: "Advanced AI that adapts to your responses and provides personalized feedback in real-time",
    gradient: "from-purple-500 to-blue-500"
  },
  {
    icon: <Mic className="h-8 w-8" />,
    title: "Voice Intelligence",
    description: "Natural speech recognition with emotion analysis and communication pattern insights",
    gradient: "from-blue-500 to-emerald-500"
  },
  {
    icon: <ChartBar className="h-8 w-8" />,
    title: "Performance Analytics",
    description: "Comprehensive metrics and improvement tracking with industry benchmarking",
    gradient: "from-emerald-500 to-purple-500"
  }
];

const benefits = [
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Confidence Building",
    description: "Practice in a judgment-free environment designed to reduce anxiety and build self-assurance"
  },
  {
    icon: <TrendingUp className="h-6 w-6" />,
    title: "Skill Enhancement",
    description: "Targeted feedback helps you identify and improve specific areas of weakness"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Industry Standards",
    description: "Learn what top companies expect from candidates in your field"
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Progress Tracking",
    description: "Detailed analytics show your improvement journey over time"
  }
];

const testimonials = [
  {
    quote: "This platform completely transformed my interview approach. The AI feedback was incredibly insightful and helped me land my dream role at a Fortune 500 company.",
    author: "Sarah Chen",
    role: "Senior Software Engineer",
    company: "Google",
    avatar: "SC"
  },
  {
    quote: "The real-time emotion analysis helped me understand how I come across to interviewers. It's like having a personal interview coach available 24/7.",
    author: "Marcus Johnson",
    role: "Product Manager",
    company: "Microsoft",
    avatar: "MJ"
  },
  {
    quote: "As someone with severe interview anxiety, this tool was life-changing. I went from dreading interviews to actually looking forward to them.",
    author: "Priya Patel",
    role: "Data Scientist",
    company: "Amazon",
    avatar: "PP"
  }
];

const stats = [
  { number: "50K+", label: "Interviews Completed" },
  { number: "94%", label: "Success Rate" },
  { number: "500+", label: "Companies" },
  { number: "4.9/5", label: "User Rating" }
];

const LandingPage = () => {
  return (
    <div className="relative">
      {/* Hero Section with Glass Spheres */}
      <section className="relative">
        <GlassSpheres />
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-gradient-to-b from-black via-gray-900 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.1)_0%,transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-400 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 bg-black">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(120,119,198,0.05)_50%,transparent_75%)] bg-[length:60px_60px]" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
                Revolutionary
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Interview Technology
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Experience the future of interview preparation with our cutting-edge AI platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 hover:border-white/20 transition-all duration-500 overflow-hidden">
                  {/* Animated background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6`}>
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-emerald-400 group-hover:bg-clip-text transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-24 bg-gradient-to-b from-black via-gray-900/50 to-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.1)_0%,transparent_70%)]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Transform Your Interview Performance
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Join thousands of professionals who have elevated their careers with our platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start p-6 rounded-2xl backdrop-blur-sm bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex-shrink-0 p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-emerald-500/20 border border-white/10 mr-4">
                  <div className="text-purple-400">{benefit.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-400">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,transparent_25%,rgba(120,119,198,0.03)_50%,transparent_75%)] bg-[length:100px_100px]" />
        
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Real results from real professionals who transformed their careers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                viewport={{ once: true }}
                className="relative p-8 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all duration-500"
              >
                {/* Quote mark */}
                <div className="absolute top-6 left-6 text-6xl text-purple-400/20 font-serif">"</div>
                
                {/* Content */}
                <div className="relative pt-8">
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    {testimonial.quote}
                  </p>
                  
                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-emerald-400 flex items-center justify-center text-white font-bold mr-4">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-gray-400">{testimonial.role}</div>
                      <div className="text-sm text-purple-400">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-b from-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,119,198,0.15)_0%,transparent_70%)]" />
        
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 overflow-hidden"
          >
            {/* Animated background elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-emerald-500/10" />
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500" />
            
            <div className="relative">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Ace Your Next Interview?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                Join the revolution in interview preparation. Start your journey to career success today.
              </p>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/signup"
                  className="group inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-blue-600 to-emerald-600 text-white font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  Start Your Journey
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;