
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useTender } from '@/contexts/TenderContext';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { format } from 'date-fns';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { tenders, applications } = useTender();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  
  // Redirect if not logged in
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) {
    return null;
  }
  
  // Get user's tenders (if tender poster)
  const userTenders = tenders.filter(tender => tender.posterId === user.id);
  
  // Get user's applications (if tender seeker)
  const userApplications = applications
    .filter(app => app.userId === user.id)
    .map(app => {
      const tender = tenders.find(t => t.id === app.tenderId);
      return tender;
    })
    .filter(Boolean);
  
  // Calculate initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would update the user profile
    toast.success("Profile updated successfully!");
  };
  
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">User Profile</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="col-span-1">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="mb-6 mt-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-primary text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <h2 className="text-xl font-semibold mb-1">{user.name}</h2>
                <p className="text-gray-500 mb-4">{user.email}</p>
                <Badge size="sm">{user.role.replace('_', ' ')}</Badge>
              </CardContent>
            </Card>
            
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="role">Role</Label>
                    <Input
                      id="role"
                      value={user.role.replace('_', ' ')}
                      disabled
                    />
                  </div>
                  
                  <Button type="submit" className="mt-2">
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <Separator className="my-8" />
          
          <Tabs defaultValue={user.role === 'tender_poster' ? 'my-tenders' : 'my-applications'} className="mt-8">
            <TabsList className="mb-6">
              {user.role === 'tender_poster' && (
                <TabsTrigger value="my-tenders">My Tenders</TabsTrigger>
              )}
              {user.role === 'tender_seeker' && (
                <TabsTrigger value="my-applications">My Applications</TabsTrigger>
              )}
              {(user.role === 'admin' || user.role === 'super_admin') && (
                <>
                  <TabsTrigger value="my-tenders">All Tenders</TabsTrigger>
                  <TabsTrigger value="users">Users</TabsTrigger>
                </>
              )}
            </TabsList>
            
            {/* My Tenders Tab */}
            <TabsContent value="my-tenders">
              <h2 className="text-2xl font-semibold mb-6">
                {user.role === 'tender_poster' ? 'My Posted Tenders' : 'All Tenders'}
              </h2>
              
              {userTenders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userTenders.map((tender) => (
                    <Card key={tender.id} className="overflow-hidden">
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <Badge variant={tender.category === 'government' ? 'default' : 'secondary'}>
                            {tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}
                          </Badge>
                          
                          <Badge variant={
                            new Date(tender.expiryDate) < new Date() ? 'destructive' : 'outline'
                          }>
                            {new Date(tender.expiryDate) < new Date() ? 'Expired' : 'Active'}
                          </Badge>
                        </div>
                        
                        <h3 className="text-lg font-semibold mb-2">{tender.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">Posted on {format(new Date(tender.createdAt), 'PP')}</p>
                        
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/tenders/${tender.id}`}>View</a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a href={`/edit-tender/${tender.id}`}>Edit</a>
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">
                    {user.role === 'tender_poster' 
                      ? "You haven't posted any tenders yet."
                      : "No tenders found in the system."
                    }
                  </p>
                  {user.role === 'tender_poster' && (
                    <Button asChild>
                      <a href="/post-tender">Post a Tender</a>
                    </Button>
                  )}
                </div>
              )}
            </TabsContent>
            
            {/* My Applications Tab */}
            <TabsContent value="my-applications">
              <h2 className="text-2xl font-semibold mb-6">My Applications</h2>
              
              {userApplications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {userApplications.map((tender) => (
                    tender && (
                      <Card key={tender.id} className="overflow-hidden">
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <Badge variant={tender.category === 'government' ? 'default' : 'secondary'}>
                              {tender.category.charAt(0).toUpperCase() + tender.category.slice(1)}
                            </Badge>
                            
                            <Badge variant={
                              new Date(tender.expiryDate) < new Date() ? 'destructive' : 'outline'
                            }>
                              {new Date(tender.expiryDate) < new Date() ? 'Expired' : 'Active'}
                            </Badge>
                          </div>
                          
                          <h3 className="text-lg font-semibold mb-2">{tender.title}</h3>
                          <p className="text-sm text-gray-600 mb-2">Posted by: {tender.posterName}</p>
                          <p className="text-sm text-gray-600 mb-4">Applied on: {
                            format(new Date(), 'PP') // In a real app, you'd store application date
                          }</p>
                          
                          <div className="flex justify-end">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`/tenders/${tender.id}`}>View Details</a>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600 mb-4">You haven't applied to any tenders yet.</p>
                  <Button asChild>
                    <a href="/tenders">Browse Tenders</a>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            {/* Users Tab (for admin) */}
            <TabsContent value="users">
              <h2 className="text-2xl font-semibold mb-6">User Management</h2>
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-gray-600">User management interface would appear here.</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

const Badge = ({ children, variant = 'default', size = 'default' }: 
{ 
  children: React.ReactNode; 
  variant?: 'default' | 'secondary' | 'destructive' | 'outline'; 
  size?: 'default' | 'sm' 
}) => {
  const baseClasses = "inline-flex items-center rounded-full font-medium";
  const sizeClasses = size === 'sm' ? "px-2 py-0.5 text-xs" : "px-2.5 py-0.5 text-sm";
  
  const variantClasses = {
    default: "bg-primary text-white",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background text-foreground"
  };
  
  return (
    <span className={`${baseClasses} ${sizeClasses} ${variantClasses[variant]}`}>
      {children}
    </span>
  );
};

export default UserProfile;
