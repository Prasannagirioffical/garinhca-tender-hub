
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useTender } from '@/contexts/TenderContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Calendar, MapPin, DollarSign, Mail, User, Clock } from 'lucide-react';
import { format } from 'date-fns';

const TenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTenderById, applyToTender, applications } = useTender();
  const { user, isAuthenticated } = useAuth();
  
  const tender = getTenderById(id || '');
  
  if (!tender) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Tender Not Found</h2>
          <p className="mb-8">The tender you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/tenders')}>
            View All Tenders
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Check if the current user has already applied
  const hasApplied = applications.some(
    app => app.tenderId === tender.id && app.userId === user?.id
  );
  
  // Check if tender has expired
  const isExpired = new Date(tender.expiryDate) < new Date();
  
  // Calculate days remaining
  const daysRemaining = Math.max(
    0,
    Math.ceil(
      (new Date(tender.expiryDate).getTime() - new Date().getTime()) / 
      (1000 * 60 * 60 * 24)
    )
  );
  
  const handleApply = () => {
    if (!isAuthenticated) {
      toast.error("Please log in to apply for this tender");
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'tender_seeker') {
      toast.error("Only tender seekers can apply for tenders");
      return;
    }
    
    if (isExpired) {
      toast.error("This tender has expired");
      return;
    }
    
    if (user && applyToTender(tender.id, user.id)) {
      toast.success("Application submitted successfully!");
    }
  };

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant={tender.category === 'government' ? 'default' : 'secondary'}>
                {tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}
              </Badge>
              
              {isExpired ? (
                <Badge variant="destructive">Expired</Badge>
              ) : (
                <Badge variant={daysRemaining <= 5 ? "destructive" : "outline"} className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>{daysRemaining} days left</span>
                </Badge>
              )}
            </div>
            
            <h1 className="text-3xl font-bold mb-4">{tender.title}</h1>
            
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium">{tender.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <DollarSign className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Budget</p>
                      <p className="font-medium">{tender.budget}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Calendar className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Expiry Date</p>
                      <p className="font-medium">
                        {format(new Date(tender.expiryDate), 'PP')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Mail className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Contact Email</p>
                      <p className="font-medium">{tender.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <User className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Posted By</p>
                      <p className="font-medium">{tender.posterName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <Clock className="text-gray-500 mt-1" size={18} />
                    <div>
                      <p className="text-sm text-gray-500">Posted On</p>
                      <p className="font-medium">
                        {format(new Date(tender.createdAt), 'PP')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Tender Description</h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-line">{tender.description}</p>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="bg-gray-50 p-6">
                {isExpired ? (
                  <Button disabled className="w-full">Tender Expired</Button>
                ) : hasApplied ? (
                  <Button disabled className="w-full">Application Submitted</Button>
                ) : user?.role === 'tender_poster' ? (
                  <Button disabled className="w-full">Tender Posters Cannot Apply</Button>
                ) : (
                  <Button onClick={handleApply} className="w-full">
                    Apply for Tender
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TenderDetail;
