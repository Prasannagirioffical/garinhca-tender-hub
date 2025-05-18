
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const Hero = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <section className="relative bg-gradient-to-b from-brand-blue to-blue-700 text-white py-20">
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Find and Post Tenders with Ease
          </h1>
          <p className="text-xl mb-8 text-blue-100">
            Garinhca.com connects tender seekers with tender posters for seamless business opportunities
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'tender_poster' ? (
                  <Button asChild size="lg" className="bg-white text-brand-blue hover:bg-gray-100">
                    <Link to="/post-tender">Post a Tender</Link>
                  </Button>
                ) : (
                  <Button asChild size="lg" className="bg-white text-brand-blue hover:bg-gray-100">
                    <Link to="/tenders">Browse Tenders</Link>
                  </Button>
                )}
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="bg-white text-brand-blue hover:bg-gray-100">
                  <Link to="/register">Register Now</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/tenders">Browse Tenders</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Background pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" 
           style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0, 0 100%)" }}></div>
    </section>
  );
};

export default Hero;
