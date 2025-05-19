
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, DollarSign } from 'lucide-react';
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
    <Card className="tender-card h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300 border-2">
      {/* Tender Image with gradient overlay */}
      {tender.imageUrl && (
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
          <img 
            src={tender.imageUrl} 
            alt={tender.title}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-3 left-3 z-20">
            <Badge variant={tender.category === 'government' ? 'default' : 'secondary'} className="text-xs">
              {tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}
            </Badge>
          </div>
        </div>
      )}
      
      <CardContent className={`pt-6 flex-grow ${!tender.imageUrl ? 'h-full' : ''}`}>
        <div className="flex justify-between items-start mb-4">
          {!tender.imageUrl && (
            <Badge variant={tender.category === 'government' ? 'default' : 'secondary'} className="mb-2">
              {tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}
            </Badge>
          )}
          
          {isExpired ? (
            <Badge variant="destructive">Expired</Badge>
          ) : isExpiring ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{daysRemaining} days left</span>
            </Badge>
          ) : (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{daysRemaining} days left</span>
            </Badge>
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-3 line-clamp-2 text-gray-800">{tender.title}</h3>
        
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-gray-500" />
            <span className="text-gray-700">{tender.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={16} className="text-gray-500" />
            <span className="text-gray-700">{tender.budget}</span>
          </div>
        </div>
        
        <p className="text-gray-600 line-clamp-2 text-sm">
          {tender.description}
        </p>
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-gray-100">
        <Button asChild className="w-full bg-brand-blue hover:bg-brand-blue/90">
          <Link to={`/tenders/${tender.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TenderCard;
