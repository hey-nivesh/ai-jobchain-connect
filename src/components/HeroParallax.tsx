import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

interface Product {
  title: string;
  link: string;
  thumbnail: string;
}

interface HeroParallaxProps {
  products: Product[];
}

const HeroParallax = ({ products }: HeroParallaxProps) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const translateY = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [15, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0.2, 1]);

  return (
    <div
      ref={ref}
      className="min-h-screen pt-16 relative overflow-hidden gradient-hero"
      id="home"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      {/* Hero Content */}
      <div className="container mx-auto px-4 pt-20 pb-40">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-card/50 backdrop-blur-sm border border-border rounded-full px-4 py-2 mb-8"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Powered by Advanced AI & Blockchain</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-4xl md:text-7xl font-bold mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            AI-Powered Job Matching{' '}
            <br />
            <span className="bg-gradient-to-r from-primary via-foreground to-primary bg-clip-text text-transparent">
              on the Blockchain
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="max-w-2xl mx-auto text-base md:text-xl text-muted-foreground mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Where intelligent AI agents represent job seekers and employers, 
            creating perfect matches while ensuring complete data ownership 
            and transparency through decentralized technology.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button size="lg" className="btn-primary text-lg px-8 py-4 rounded-full">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="lg" 
              className="btn-ghost text-lg px-8 py-4 rounded-full"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Parallax Products Grid */}
      <motion.div
        style={{
          rotateX,
          opacity,
        }}
        className="absolute -bottom-20 left-0 right-0"
      >
        <motion.div
          style={{ translateY }}
          className="flex space-x-6 px-6"
        >
          {/* First Row */}
          <div className="flex flex-col space-y-6 min-w-[300px]">
            {products.slice(0, 3).map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
          
          {/* Second Row */}
          <div className="flex flex-col space-y-6 min-w-[300px] mt-12">
            {products.slice(3, 6).map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
          
          {/* Third Row */}
          <div className="flex flex-col space-y-6 min-w-[300px]">
            {products.slice(6, 9).map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
          
          {/* Fourth Row */}
          <div className="flex flex-col space-y-6 min-w-[300px] mt-12">
            {products.slice(9, 12).map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
          
          {/* Fifth Row */}
          <div className="flex flex-col space-y-6 min-w-[300px]">
            {products.slice(12, 15).map((product, idx) => (
              <ProductCard key={idx} product={product} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  return (
    <motion.div
      whileHover={{ 
        scale: 1.05,
        rotateY: 5,
      }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="group relative"
    >
      <div className="relative h-60 w-full overflow-hidden rounded-2xl bg-card border border-border shadow-card">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {product.title}
          </h3>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span>Active</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroParallax;