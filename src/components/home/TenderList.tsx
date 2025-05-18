
import { useTender } from '@/contexts/TenderContext';
import TenderCard from '@/components/tenders/TenderCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';

const TenderList = () => {
  const { tenders } = useTender();
  
  // Get only the recent tenders (last 6)
  const recentTenders = tenders
    .filter(tender => {
      // Check if tender is not expired
      const today = new Date();
      const expiryDate = new Date(tender.expiryDate);
      return expiryDate >= today;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Latest Tenders</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover the most recent tender opportunities available on our platform. Browse and apply to find your next business opportunity.
          </p>
          
          <div className="mt-8 max-w-xl mx-auto">
            <Link to="/tenders" className="flex items-center justify-center gap-2 bg-white py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all">
              <Search size={20} />
              <span className="text-lg">Search all available tenders</span>
            </Link>
          </div>
        </div>
        
        {recentTenders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No active tenders available at the moment.</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-black text-white hover:bg-black/90">
            <Link to="/tenders">View All Tenders</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TenderList;
