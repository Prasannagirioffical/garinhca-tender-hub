
import { useTender } from '@/contexts/TenderContext';
import TenderCard from '@/components/tenders/TenderCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TenderList = () => {
  const { tenders } = useTender();
  
  // Get all tenders that are not expired
  const activeTenders = tenders
    .filter(tender => {
      // Check if tender is not expired
      const today = new Date();
      const expiryDate = new Date(tender.expiryDate);
      return expiryDate >= today;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Available Tenders</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse all current tender opportunities available on our platform. Find and apply to the perfect opportunity for your business.
          </p>
        </div>
        
        {activeTenders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-xl text-gray-500">No active tenders available at the moment.</p>
            <Button asChild className="mt-4 bg-brand-blue hover:bg-brand-blue/90">
              <Link to="/post-tender">Post a Tender</Link>
            </Button>
          </div>
        )}
        
        <div className="text-center mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="bg-black hover:bg-black/90">
            <Link to="/tenders">View All Tenders</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/post-tender">Post a Tender</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TenderList;
