import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTender } from '@/contexts/TenderContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user } = useAuth();
  const { tenders, applications } = useTender();
  const [activeTab, setActiveTab] = useState('overview');
  
  if (!user) {
    return (
      <Layout>
        <div className="container-custom py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="mb-8">Please log in to access your dashboard.</p>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  // Get current date for comparison
  const currentDate = new Date();
  
  // For tender posters: Get tenders posted by the current user
  const myPostedTenders = tenders.filter(tender => tender.posterId === user.id);
  
  // For tender seekers: Get applications by the current user
  const myApplications = applications.filter(app => app.userId === user.id);
  
  // Get tenders the user has applied to
  const myAppliedTenders = tenders.filter(tender => 
    myApplications.some(app => app.tenderId === tender.id)
  );
  
  // Count active and expired tenders
  const activeTenders = myPostedTenders.filter(
    tender => new Date(tender.expiryDate) >= currentDate
  ).length;
  
  const expiredTenders = myPostedTenders.filter(
    tender => new Date(tender.expiryDate) < currentDate
  ).length;
  
  // Calculate statistics
  const totalApplicationsReceived = applications.filter(
    app => myPostedTenders.some(tender => tender.id === app.tenderId)
  ).length;
  
  return (
    <Layout>
      <div className="container-custom py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user.name}</h1>
          <p className="text-gray-600">
            {user.role === 'tender_poster' 
              ? 'Manage your posted tenders and view applications.' 
              : 'Track your tender applications and find new opportunities.'}
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {user.role === 'tender_poster' ? (
              <>
                <TabsTrigger value="my-tenders">My Tenders</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="post-tender">Post New Tender</TabsTrigger>
              </>
            ) : (
              <>
                <TabsTrigger value="my-applications">My Applications</TabsTrigger>
                <TabsTrigger value="find-tenders">Find Tenders</TabsTrigger>
              </>
            )}
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {user.role === 'tender_poster' ? (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Tenders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{activeTenders}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Expired Tenders</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{expiredTenders}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Total Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{totalApplicationsReceived}</p>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">My Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">{myApplications.length}</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Active Tenders</CardTitle>
                      <CardDescription>Tenders still open for application</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">
                        {tenders.filter(tender => new Date(tender.expiryDate) >= currentDate).length}
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Profile Completion</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold">80%</p>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {user.role === 'tender_poster' ? (
                    <>
                      <Button asChild className="w-full">
                        <Link to="/post-tender">Post New Tender</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/profile">Update Profile</Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full">
                        <Link to="/tenders">Browse Tenders</Link>
                      </Button>
                      <Button variant="outline" asChild className="w-full">
                        <Link to="/profile">Complete Your Profile</Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {user.role === 'tender_poster' ? (
                      myPostedTenders.length > 0 ? (
                        myPostedTenders
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 3)
                          .map(tender => (
                            <li key={tender.id} className="border-b pb-3 last:border-0">
                              <p className="font-medium">{tender.title}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-600">
                                  Posted on {new Date(tender.createdAt).toLocaleDateString()}
                                </span>
                                {new Date(tender.expiryDate) < currentDate ? (
                                  <Badge variant="destructive">Expired</Badge>
                                ) : (
                                  <Badge>Active</Badge>
                                )}
                              </div>
                            </li>
                          ))
                      ) : (
                        <p className="text-gray-500">No tenders posted yet.</p>
                      )
                    ) : (
                      myAppliedTenders.length > 0 ? (
                        myAppliedTenders
                          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                          .slice(0, 3)
                          .map(tender => (
                            <li key={tender.id} className="border-b pb-3 last:border-0">
                              <p className="font-medium">{tender.title}</p>
                              <div className="flex justify-between items-center mt-1">
                                <span className="text-sm text-gray-600">
                                  Applied on {new Date().toLocaleDateString()}
                                </span>
                                {new Date(tender.expiryDate) < currentDate ? (
                                  <Badge variant="destructive">Expired</Badge>
                                ) : (
                                  <Badge>Active</Badge>
                                )}
                              </div>
                            </li>
                          ))
                      ) : (
                        <p className="text-gray-500">No applications submitted yet.</p>
                      )
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Other tabs will be similar but with specific content */}
          {user.role === 'tender_poster' && (
            <>
              <TabsContent value="my-tenders">
                {myPostedTenders.length > 0 ? (
                  <div className="space-y-6">
                    {myPostedTenders
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map(tender => (
                        <Card key={tender.id}>
                          <CardContent className="p-6">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-semibold">{tender.title}</h3>
                                <p className="text-gray-500 mt-1">
                                  Posted on {new Date(tender.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {new Date(tender.expiryDate) < currentDate ? (
                                <Badge variant="destructive">Expired</Badge>
                              ) : (
                                <Badge>Active</Badge>
                              )}
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                              <div>
                                <p className="text-sm text-gray-500">Location</p>
                                <p>{tender.location}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Budget</p>
                                <p>{tender.budget}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-500">Expiry Date</p>
                                <p>{new Date(tender.expiryDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                              <Button asChild>
                                <Link to={`/tenders/${tender.id}`}>View Details</Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-4">No tenders posted yet</h3>
                    <p className="text-gray-500 mb-6">Get started by posting your first tender</p>
                    <Button asChild>
                      <Link to="/post-tender">Post a Tender</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="applications">
                <Card>
                  <CardHeader>
                    <CardTitle>Applications Received</CardTitle>
                    <CardDescription>
                      View all applications for your tenders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* In a real app, this would show actual applications with applicant details */}
                    <p className="text-center py-12 text-gray-500">
                      The applications feature would be integrated with a backend system to store and display real applications.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="post-tender">
                <Card>
                  <CardHeader>
                    <CardTitle>Post a New Tender</CardTitle>
                    <CardDescription>
                      Create a new tender opportunity for potential applicants
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-6">
                    <Button asChild size="lg">
                      <Link to="/post-tender">Post New Tender</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
          
          {user.role === 'tender_seeker' && (
            <>
              <TabsContent value="my-applications">
                {myAppliedTenders.length > 0 ? (
                  <div className="space-y-6">
                    {myAppliedTenders.map(tender => (
                      <Card key={tender.id}>
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-semibold">{tender.title}</h3>
                              <p className="text-gray-500 mt-1">
                                Posted by {tender.posterName}
                              </p>
                            </div>
                            {new Date(tender.expiryDate) < currentDate ? (
                              <Badge variant="destructive">Expired</Badge>
                            ) : (
                              <Badge>Active</Badge>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-sm text-gray-500">Location</p>
                              <p>{tender.location}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Budget</p>
                              <p>{tender.budget}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Expiry Date</p>
                              <p>{new Date(tender.expiryDate).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end">
                            <Button asChild>
                              <Link to={`/tenders/${tender.id}`}>View Tender</Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-xl font-semibold mb-4">No applications submitted yet</h3>
                    <p className="text-gray-500 mb-6">Browse available tenders to find opportunities</p>
                    <Button asChild>
                      <Link to="/tenders">Browse Tenders</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="find-tenders">
                <Card>
                  <CardHeader>
                    <CardTitle>Find Tender Opportunities</CardTitle>
                    <CardDescription>
                      Browse all available tenders and filter by category or location
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center py-6">
                    <Button asChild size="lg">
                      <Link to="/tenders">Browse All Tenders</Link>
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </Layout>
  );
};

export default Dashboard;
