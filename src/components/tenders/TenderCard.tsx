
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { Tender } from '@/contexts/TenderContext';

interface TenderCardProps {
  tender: Tender;
}

const TenderCard: React.FC<TenderCardProps> = ({ tender }) => {
  // Calculate days remaining until expiry
  const calculateDaysRemaining = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = calculateDaysRemaining(tender.expiryDate);
  const isExpiring = daysRemaining <= 5 && daysRemaining > 0;
  const isExpired = daysRemaining === 0;

  return (
    <Card className="tender-card h-full flex flex-col">
      <CardContent className="pt-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <Badge variant={tender.category === 'government' ? 'default' : 'secondary'} className="mb-2">
            {tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}
          </Badge>
          
          {isExpired ? (
            <Badge variant="destructive">Expired</Badge>
          ) : isExpiring ? (
            <Badge variant="destructive">{daysRemaining} days left</Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{daysRemaining} days left</span>
            </Badge>
          )}
        </div>
        
        <h3 className="text-lg font-semibold mb-2 line-clamp-2">{tender.title}</h3>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <p><strong>Location:</strong> {tender.location}</p>
          <p><strong>Budget:</strong> {tender.budget}</p>
          <p><strong>Posted By:</strong> {tender.posterName}</p>
        </div>
        
        <p className="text-gray-700 line-clamp-3">
          {tender.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-gray-100">
        <Button asChild className="w-full">
          <Link to={`/tenders/${tender.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TenderCard;
