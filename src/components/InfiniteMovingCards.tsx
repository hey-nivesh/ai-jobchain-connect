import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  name: string;
  title: string;
}

interface InfiniteMovingCardsProps {
  testimonials: Testimonial[];
  direction?: 'left' | 'right';
  speed?: 'fast' | 'normal' | 'slow';
  pauseOnHover?: boolean;
  className?: string;
}

export const InfiniteMovingCards = ({
  testimonials,
  direction = 'left',
  speed = 'normal',
  pauseOnHover = true,
  className,
}: InfiniteMovingCardsProps) => {
  const [duplicatedTestimonials, setDuplicatedTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    setDuplicatedTestimonials([...testimonials, ...testimonials]);
  }, [testimonials]);

  const getDuration = () => {
    switch (speed) {
      case 'fast':
        return '20s';
      case 'slow':
        return '60s';
      default:
        return '40s';
    }
  };

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
        className
      )}
    >
      <motion.div
        className={cn('flex gap-6 w-max', pauseOnHover && 'hover:[animation-play-state:paused]')}
        style={{
          '--animation-duration': getDuration(),
          '--animation-direction': direction === 'left' ? 'forwards' : 'reverse',
        } as React.CSSProperties}
        animate={{
          x: direction === 'left' ? [0, -1920] : [-1920, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed === 'fast' ? 20 : speed === 'slow' ? 60 : 40,
            ease: 'linear',
          },
        }}
      >
        {duplicatedTestimonials.map((testimonial, idx) => (
          <TestimonialCard key={idx} testimonial={testimonial} />
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="relative w-[400px] glass rounded-2xl p-8 border border-border shadow-card flex-shrink-0">
      {/* Quote Icon */}
      <div className="absolute top-6 right-6 text-primary/20">
        <Quote className="h-8 w-8" />
      </div>
      
      {/* Stars */}
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
      </div>
      
      {/* Quote */}
      <blockquote className="text-foreground mb-6 leading-relaxed">
        "{testimonial.quote}"
      </blockquote>
      
      {/* Author */}
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {testimonial.name.charAt(0)}
          </span>
        </div>
        <div>
          <div className="font-semibold text-foreground">{testimonial.name}</div>
          <div className="text-sm text-muted-foreground">{testimonial.title}</div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteMovingCards;