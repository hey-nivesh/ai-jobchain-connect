import { motion } from 'framer-motion';
import InfiniteMovingCards from './InfiniteMovingCards';

const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "The AI agent found me a perfect remote position that aligned with my skills and salary expectations. The blockchain-based contract gave me complete transparency and security.",
      name: "Sarah Chen",
      title: "Senior Developer at TechCorp"
    },
    {
      quote: "As an employer, this platform revolutionized our hiring process. The AI agents pre-screen candidates so well that our interview-to-hire ratio improved by 300%.",
      name: "Michael Rodriguez",
      title: "HR Director at InnovateLabs"
    },
    {
      quote: "Finally, a job platform where I own my data and the AI actually understands what I'm looking for. Got three interview requests in the first week!",
      name: "Priya Sharma",
      title: "Product Manager"
    },
    {
      quote: "The decentralized approach means no platform fees and direct communication with employers. It's like having a personal recruitment agent that never sleeps.",
      name: "David Thompson",
      title: "UX Designer"
    },
    {
      quote: "The smart contracts automated our entire hiring workflow. From candidate selection to contract negotiation, everything is transparent and efficient.",
      name: "Lisa Wang",
      title: "Startup Founder"
    }
  ];

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
              Thousands
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what job seekers and employers are saying about their experience 
            with JobMatch AI's revolutionary platform.
          </p>
        </motion.div>

        {/* Moving Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <InfiniteMovingCards
            testimonials={testimonials}
            direction="right"
            speed="slow"
            className="py-8"
          />
        </motion.div>

        {/* Second row moving in opposite direction */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <InfiniteMovingCards
            testimonials={testimonials.slice().reverse()}
            direction="left"
            speed="normal"
            className="py-8"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;