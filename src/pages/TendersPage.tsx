
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import TenderCard from '@/components/tenders/TenderCard';
import { useTender } from '@/contexts/TenderContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tender } from '@/contexts/TenderContext';

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
          <h1 className="text-3xl font-bold mb-4">Browse Tenders</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Find the perfect tender opportunity for your business. Filter by category and use the search to find exactly what you're looking for.
          </p>
        </div>
        
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search tenders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div className="w-full md:w-48">
            <Select
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger>
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
          >
            Clear Filters
          </Button>
        </div>
        
        {filteredTenders.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTenders.map((tender) => (
              <TenderCard key={tender.id} tender={tender} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No matching tenders found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TendersPage;
