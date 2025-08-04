import Header from '@/components/Header';
import HeroParallax from '@/components/HeroParallax';
import AboutSection from '@/components/AboutSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import Footer from '@/components/Footer';

const Index = () => {
  const products = [
    {
      title: "Smart Resume Analysis",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&h=400&fit=crop"
    },
    {
      title: "AI Interview Prep",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop"
    },
    {
      title: "Blockchain Contracts",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&h=400&fit=crop"
    },
    {
      title: "Global Talent Pool",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
    },
    {
      title: "Salary Analytics",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop"
    },
    {
      title: "Skills Matching",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400&fit=crop"
    },
    {
      title: "Remote Opportunities",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=600&h=400&fit=crop"
    },
    {
      title: "Company Culture Fit",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop"
    },
    {
      title: "Freelance Projects",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop"
    },
    {
      title: "Career Growth",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop"
    },
    {
      title: "Tech Startup Jobs",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=400&fit=crop"
    },
    {
      title: "Executive Positions",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"
    },
    {
      title: "Creative Industries",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=600&h=400&fit=crop"
    },
    {
      title: "Healthcare Jobs",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=600&h=400&fit=crop"
    },
    {
      title: "Education Sector",
      link: "#",
      thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroParallax products={products} />
      <AboutSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
