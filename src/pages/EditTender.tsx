
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTender } from '@/contexts/TenderContext';
import { toast } from '@/components/ui/sonner';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Upload, Image, X } from "lucide-react";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const EditTender = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { getTenderById, updateTender } = useTender();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const tender = getTenderById(id || '');
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'private' as 'government' | 'private',
    email: '',
    location: '',
    budget: '',
    description: '',
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  // Load tender data when component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to edit a tender");
      navigate('/login');
      return;
    }
    
    if (!tender) {
      toast.error("Tender not found");
      navigate('/tenders');
      return;
    }
    
    // Check if user is authorized to edit this tender
    const isPoster = user?.id === tender.posterId;
    const isAdmin = user?.role === 'admin' || user?.role === 'super_admin';
    
    if (!isPoster && !isAdmin) {
      toast.error("You don't have permission to edit this tender");
      navigate('/tenders');
      return;
    }
    
    // Set form data
    setFormData({
      title: tender.title,
      category: tender.category,
      email: tender.email,
      location: tender.location,
      budget: tender.budget,
      description: tender.description,
    });
    
    // Set image preview if exists
    if (tender.imageUrl) {
      setImagePreview(tender.imageUrl);
    }
    
    // Set expiry date
    setExpiryDate(new Date(tender.expiryDate));
    
  }, [tender, isAuthenticated, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value as 'government' | 'private' }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.email || !formData.location || !formData.budget || !formData.description || !expiryDate) {
      toast.error("All fields are required");
      return;
    }

    if (!isAuthenticated) {
      toast.error("You must be logged in to update a tender");
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      // In a real app, you would upload the image to a server here
      const success = updateTender(id || '', {
        ...formData,
        expiryDate: expiryDate.toISOString().split('T')[0],
        imageUrl: imagePreview
      });
      
      if (success) {
        toast.success("Tender updated successfully!");
        navigate(`/tenders/${id}`);
      }
    } catch (error) {
      console.error("Error updating tender:", error);
      toast.error("Failed to update tender. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // If tender not found
  if (!tender) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Tender Not Found</h2>
          <p className="mb-8">The tender you're trying to edit doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/tenders')}>
            View All Tenders
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-custom py-12">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl">Edit Tender</CardTitle>
            <CardDescription>
              Update the details of your tender
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tender Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter the title of your tender"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Category</Label>
                <RadioGroup 
                  value={formData.category} 
                  onValueChange={handleCategoryChange}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private">Private</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="government" id="government" />
                    <Label htmlFor="government">Government</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  placeholder="City, Country or Remote"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="budget">Budget</Label>
                <Input
                  id="budget"
                  name="budget"
                  placeholder="e.g. $5,000 - $10,000"
                  value={formData.budget}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Expiry Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !expiryDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {expiryDate ? format(expiryDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={expiryDate}
                      onSelect={setExpiryDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Image upload section */}
              <div className="space-y-2">
                <Label>Tender Image</Label>
                <div className="flex flex-col gap-4">
                  {imagePreview ? (
                    <div className="relative w-full h-40 rounded-md overflow-hidden">
                      <img 
                        src={imagePreview} 
                        alt="Tender preview"
                        className="w-full h-full object-cover"
                      />
                      <Button 
                        variant="destructive" 
                        size="icon" 
                        className="absolute top-2 right-2 rounded-full"
                        onClick={removeImage}
                        type="button"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Image className="h-10 w-10 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Click to upload an image
                        </p>
                        <p className="text-xs text-gray-400">
                          PNG, JPG, GIF up to 5MB
                        </p>
                      </div>
                    </div>
                  )}
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Provide details about the tender..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>
              
              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-full" 
                  onClick={() => navigate(`/tenders/${id}`)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Tender"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditTender;
