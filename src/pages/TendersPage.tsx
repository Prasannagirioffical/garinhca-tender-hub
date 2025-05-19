
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TenderCard from '@/components/tenders/TenderCard';
import { useTender } from '@/contexts/TenderContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tender } from '@/contexts/TenderContext';
import { Search } from 'lucide-react';

const TendersPage = () => {
  const { tenders } = useTender();
  const [filteredTenders, setFilteredTenders] = useState<Tender[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    // Filter tenders based on search term and category
    const filtered = tenders.filter(tender => {
      const matchesSearch = tender.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            tender.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tender.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = categoryFilter === 'all' || tender.category === categoryFilter;
      
      // Only show non-expired tenders
      const isNotExpired = new Date(tender.expiryDate) >= new Date();
      
      return matchesSearch && matchesCategory && isNotExpired;
    });
    
    // Sort by newest first
    const sorted = [...filtered].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    setFilteredTenders(sorted);
  }, [tenders, searchTerm, categoryFilter]);

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-4">Browse All Tenders</h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Find the perfect tender opportunity for your business. Filter by category and use the search to find exactly what you're looking for.
          </p>
        </div>
        
        {/* Enhanced Search Bar */}
        <div className="max-w-4xl mx-auto mb-12 bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col gap-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tenders by title, description or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-6 text-lg border-gray-300"
              />
            </div>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-48">
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="government">Government</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                }}
                className="h-11"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Available Tenders ({filteredTenders.length})</h2>
        </div>
        
        {filteredTenders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No matching tenders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TendersPage;
