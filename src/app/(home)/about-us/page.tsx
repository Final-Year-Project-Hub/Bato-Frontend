"use client";

import { Bot, Map, TrendingUp, BookOpen, Zap, Target, Lightbulb, CheckCircle2, Users, Award, Eye, Sparkles, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import roadmapImage from '@/../public/images/roadmap.png';

const AboutUsPage = () => {
  const features = [
    { Icon: Bot, title: 'AI-Powered Guidance', desc: 'Get instant, accurate answers from official documentation. Our intelligent chatbot understands your questions and provides clear explanations.' },
    { Icon: Map, title: 'Custom Roadmaps', desc: 'Receive personalized learning paths based on your goals. Know exactly what to learn and in what order.' },
    { Icon: TrendingUp, title: 'Progress Tracking', desc: 'Monitor your learning journey, see your improvements, and stay motivated with clear progress indicators.' },
    { Icon: BookOpen, title: 'Verified Resources', desc: 'All information comes from trusted technical sources and official documentation—no guesswork.' },
    { Icon: Zap, title: 'Fast & Efficient', desc: 'Save hours of searching. Get structured, relevant information instantly and start learning faster.' },
    { Icon: Target, title: 'Goal-Oriented', desc: 'Whether you want to learn a technology or build a project, we provide targeted guidance to help you succeed.' }
  ];

  const values = [
    { num: '01', Icon: Lightbulb, title: 'Simplicity', desc: 'Making complex technical concepts easy to understand for everyone' },
    { num: '02', Icon: CheckCircle2, title: 'Accuracy', desc: 'Providing reliable information from verified technical sources only' },
    { num: '03', Icon: Users, title: 'Accessibility', desc: 'Ensuring quality technical education is available to all learners' },
    { num: '04', Icon: Award, title: 'Innovation', desc: 'Using cutting-edge AI to revolutionize how people learn technology' }
  ];

  return (
    <div className="min-h-screen bg-grey text-foreground font-sans overflow-hidden">
      <div className="my-container py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-background text-secondary px-5 py-2 rounded-full text-sm font-semibold mb-5 border border-secondary/20"
          >
            About Bato.ai
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="heading mb-5"
          >
            Transforming <span className="text-primary">Technical Learning</span><br />Through Intelligence
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-foreground/70 max-w-3xl mx-auto mb-10"
          >
            We believe learning to code should not be overwhelming. Bato.ai makes it simple, structured, and effective.
          </motion.p>

          {/* Roadmap Image */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-full max-w-md mx-auto my-10"
          >
            <Image 
              src={roadmapImage} 
              alt="Learning Roadmap" 
              className="w-full h-auto"
              priority
            />
          </motion.div>
        </div>

        {/* Team Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative text-center bg-background rounded-[3rem] p-12 md:p-16 border-2 border-border mb-20 overflow-hidden group"
        >
          {/* Animated Oval Gradient Background */}
          <motion.div 
            animate={{ 
              rotate: 360,
              scale: [1, 1.15, 1]
            }}
            transition={{ 
              rotate: { duration: 25, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[70%] rounded-[50%] opacity-20"
            style={{
              background: 'radial-gradient(ellipse, rgba(233,101,89,0.25) 0%, rgba(108,99,255,0.2) 50%, transparent 70%)',
              filter: 'blur(50px)'
            }}
          />

          {/* Floating Orbs */}
          <motion.div
            animate={{ 
              x: [0, 30, 0],
              y: [0, -20, 0],
              opacity: [0.4, 0.7, 0.4] 
            }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-10 right-16 w-24 h-24 bg-primary/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              x: [0, -30, 0],
              y: [0, 20, 0],
              opacity: [0.3, 0.6, 0.3] 
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-10 left-16 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"
          />
          <motion.div
            animate={{ 
              x: [0, -15, 0],
              y: [0, -15, 0],
              opacity: [0.2, 0.5, 0.2] 
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/2 left-10 w-20 h-20 bg-primary/15 rounded-full blur-xl"
          />

          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Built by <span className="text-primary">Learners</span>, for Learners
              </h2>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg text-foreground/70 max-w-3xl mx-auto leading-relaxed mb-8"
            >
              Bato.ai is developed by a team of passionate students and developers who understand the struggles of learning to code. We have experienced the confusion of scattered resources and unclear documentation firsthand.
            </motion.p>

            {/* Animated Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              {[
                { icon: Users, text: 'Student-Led Team', delay: 0.4 },
                { icon: BookOpen, text: 'Real Experience', delay: 0.5 },
                { icon: Target, text: 'Clear Mission', delay: 0.6 },
                { icon: Rocket, text: 'Fast Growth', delay: 0.7 }
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: item.delay,
                      type: "spring",
                      stiffness: 200
                    }}
                    whileHover={{ 
                      scale: 1.05,
                      y: -3
                    }}
                    className="flex items-center gap-2 bg-grey px-5 py-3 rounded-full border-2 border-border hover:border-primary transition-all duration-300 cursor-default shadow-sm hover:shadow-md"
                  >
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
                    >
                      <Icon className="w-5 h-5 text-primary" />
                    </motion.div>
                    <span className="text-sm font-semibold">{item.text}</span>
                  </motion.div>
                );
              })}
            </div>

            {/* Bottom tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-base text-foreground/60 mt-8 italic"
            >
              Building the platform we wish we had when we started our journey
            </motion.p>
          </div>
        </motion.div>

        {/* Mission & Vision Section - Side by Side with rounded oval style */}
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Mission Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-background rounded-[3rem] p-10 md:p-12 border-2 border-border overflow-hidden group hover:border-primary transition-colors duration-300"
          >
            {/* Animated Oval Gradient */}
            <motion.div 
              animate={{ 
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] rounded-[50%] opacity-30"
              style={{
                background: 'radial-gradient(ellipse, rgba(233,101,89,0.3) 0%, rgba(233,101,89,0.15) 40%, transparent 70%)',
                filter: 'blur(40px)'
              }}
            />

            {/* Decorative floating elements */}
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-16 h-16 bg-primary/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"
            />
            
            <div className="relative z-10 text-center">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-primary/80 rounded-full mb-6 shadow-lg"
              >
                <Target className="w-10 h-10 text-primary-foreground" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="text-primary">Mission</span>
              </h2>
              
              <p className="text-foreground/70 leading-relaxed mb-6">
                Bato.ai is built to solve a real problem every developer and learner faces: navigating scattered, confusing technical resources. We transform complex documentation into clear, step-by-step guidance that anyone can follow.
              </p>

              {/* Mission highlights with icons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
                <div className="flex items-center gap-2 bg-grey px-4 py-2 rounded-full border border-border">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Clear Guidance</span>
                </div>
                <div className="flex items-center gap-2 bg-grey px-4 py-2 rounded-full border border-border">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Verified Sources</span>
                </div>
                <div className="flex items-center gap-2 bg-grey px-4 py-2 rounded-full border border-border">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Track Progress</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative bg-background rounded-[3rem] p-10 md:p-12 border-2 border-border overflow-hidden group hover:border-secondary transition-colors duration-300"
          >
            {/* Animated Oval Gradient */}
            <motion.div 
              animate={{ 
                rotate: -360,
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[80%] rounded-[50%] opacity-30"
              style={{
                background: 'radial-gradient(ellipse, rgba(108,99,255,0.3) 0%, rgba(108,99,255,0.15) 40%, transparent 70%)',
                filter: 'blur(40px)'
              }}
            />

            {/* Decorative floating elements */}
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 left-10 w-16 h-16 bg-secondary/10 rounded-full blur-xl"
            />
            <motion.div
              animate={{ y: [0, -10, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute bottom-10 right-10 w-20 h-20 bg-secondary/10 rounded-full blur-xl"
            />
            
            <div className="relative z-10 text-center">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-secondary to-secondary/80 rounded-full mb-6 shadow-lg"
              >
                <Eye className="w-10 h-10 text-background" />
              </motion.div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our <span className="text-secondary">Vision</span>
              </h2>
              
              <p className="text-foreground/70 leading-relaxed mb-6">
                We envision a world where anyone, anywhere can learn technology without barriers. Bato.ai will become the go-to platform for millions of learners worldwide, democratizing access to quality technical education.
              </p>

              {/* Vision highlights with icons */}
              <div className="flex flex-wrap justify-center gap-3 mt-6">
               
                <div className="flex items-center gap-2 bg-grey px-4 py-2 rounded-full border border-border">
                  <Rocket className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">Empower Learners</span>
                </div>
                <div className="flex items-center gap-2 bg-grey px-4 py-2 rounded-full border border-border">
                  <Award className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">Quality Education</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <h2 className="text-4xl font-bold text-center mb-12">
          What We <span className="text-primary">Offer</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, idx) => {
            const Icon = feature.Icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -5, scale: 1.01 }}
                className="bg-background border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary hover:shadow-lg"
              >
                <motion.div 
                  whileHover={{ rotate: 8 }}
                  className="w-14 h-14 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300"
                >
                  <Icon className="w-7 h-7 text-primary-foreground" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-primary">{feature.title}</h3>
                <p className="text-sm text-foreground/70">{feature.desc}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Core Values */}
        <h2 className="text-4xl font-bold text-center mb-12">
          Our Core <span className="text-primary">Values</span>
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {values.map((value, idx) => {
            const Icon = value.Icon;
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="text-center p-8 bg-background rounded-2xl border border-border transition-all duration-300 hover:border-primary"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-secondary to-secondary/80 rounded-full mb-4">
                  <Icon className="w-8 h-8 text-background" />
                </div>
                <div className="text-5xl font-bold text-primary mb-3">{value.num}</div>
                <div className="text-xl font-semibold mb-3">{value.title}</div>
                <p className="text-sm text-foreground/70">{value.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;