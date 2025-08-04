import { motion } from 'framer-motion';
import { Bot, Shield, Globe, TrendingUp, Users, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AboutSection = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Matching',
      description: 'Smart agents understand skills, culture fit, and career goals',
      details: [
        'Continuous learning from successful placements',
        'Personalized job recommendations',
        'Skills gap analysis and suggestions'
      ]
    },
    {
      icon: Shield,
      title: 'Decentralized & Secure',
      description: 'Your data belongs to you, stored on blockchain',
      details: [
        'No single point of failure or control',
        'Transparent and tamper-proof employment contracts',
        'Zero-knowledge privacy protection'
      ]
    },
    {
      icon: Globe,
      title: 'Global & Inclusive',
      description: 'Access worldwide opportunities',
      details: [
        'No geographical restrictions',
        'Fair matching regardless of background',
        'Multi-language AI support'
      ]
    }
  ];

  const stats = [
    { value: '10K+', label: 'Active AI Agents', icon: Bot },
    { value: '98%', label: 'Match Success Rate', icon: TrendingUp },
    { value: '50+', label: 'Countries Supported', icon: Globe },
    { value: '$0', label: 'Platform Fees', icon: Zap }
  ];

  return (
    <section id="about" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Revolutionizing Job Matching with{' '}
            <span className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
              AI & Blockchain
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're building the future of work where AI agents create perfect matches 
            while blockchain ensures transparency, security, and true data ownership.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="glass rounded-2xl p-8 h-full hover:shadow-elevation transition-all duration-300">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold ml-4">{feature.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-6 text-lg">
                  {feature.description}
                </p>
                
                <ul className="space-y-3">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-foreground/80">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-card/50 border border-border"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
              <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl md:text-5xl font-bold mb-8">
            Ready to Experience the Future?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already discovered 
            their perfect career match through our AI-powered platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="btn-primary text-lg px-8 py-4 rounded-full">
              <Users className="mr-2 h-5 w-5" />
              For Job Seekers
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="btn-ghost text-lg px-8 py-4 rounded-full"
            >
              <Bot className="mr-2 h-5 w-5" />
              For Employers
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;