
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { useTender } from '@/contexts/TenderContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Calendar, MapPin, DollarSign, Mail, User, Clock, Edit, Trash } from 'lucide-react';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from 'react';

const TenderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTenderById, applyToTender, applications, deleteTender } = useTender();
  const { user, isAuthenticated } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
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
  
  // Check if current user is admin or super admin
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin');
  
  // Check if current user is the poster of this tender
  const isPoster = user && user.id === tender.posterId;
  
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
  
  const handleDelete = () => {
    deleteTender(tender.id);
    navigate('/tenders');
  };
  
  const handleEdit = () => {
    navigate(`/edit-tender/${tender.id}`);
  };

  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          {/* Admin actions */}
          {(isAdmin || isPoster) && (
            <div className="flex justify-end mb-4 gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleEdit}
              >
                <Edit size={16} />
                Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => setShowDeleteDialog(true)}
              >
                <Trash size={16} />
                Delete
              </Button>
            </div>
          )}
          
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
            
            {/* Tender Image */}
            {tender.imageUrl && (
              <div className="mb-6 rounded-lg overflow-hidden h-80">
                <img 
                  src={tender.imageUrl} 
                  alt={tender.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the tender and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default TenderDetail;
