
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { useTender } from '@/contexts/TenderContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const AdminPanel = () => {
  const { user } = useAuth();
  const { tenders } = useTender();
  const navigate = useNavigate();
  
  // Redirect non-admin users
  useEffect(() => {
    if (user?.role !== 'admin' && user?.role !== 'super_admin') {
      navigate('/');
    }
  }, [user, navigate]);
  
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return null; // Will redirect via useEffect
  }
  
  // Count tenders by category
  const governmentTendersCount = tenders.filter(tender => tender.category === 'government').length;
  const privateTendersCount = tenders.filter(tender => tender.category === 'private').length;
  
  // Count active and expired tenders
  const activeTendersCount = tenders.filter(
    tender => new Date(tender.expiryDate) >= new Date()
  ).length;
  
  const expiredTendersCount = tenders.filter(
    tender => new Date(tender.expiryDate) < new Date()
  ).length;

  return (
    <Layout>
      <div className="container-custom py-12">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600 mb-8">
          {user.role === 'super_admin' ? 'Super Administrator Dashboard' : 'Administrator Dashboard'}
        </p>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tenders">Manage Tenders</TabsTrigger>
            <TabsTrigger value="users">Manage Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Tenders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{tenders.length}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Government Tenders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{governmentTendersCount}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Private Tenders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{privateTendersCount}</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Registered Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">10</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Tender Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Active Tenders:</span>
                      <span className="font-semibold">{activeTendersCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Expired Tenders:</span>
                      <span className="font-semibold">{expiredTendersCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Applications:</span>
                      <span className="font-semibold">42</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>User Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Tender Posters:</span>
                      <span className="font-semibold">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tender Seekers:</span>
                      <span className="font-semibold">6</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Admin Users:</span>
                      <span className="font-semibold">2</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="tenders">
            <Card>
              <CardHeader>
                <CardTitle>Manage Tenders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tenders.map(tender => (
                    <div key={tender.id} className="p-4 border rounded-md flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{tender.title}</h3>
                        <p className="text-sm text-gray-500">
                          Posted by: {tender.posterName} | {new Date(tender.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {new Date(tender.expiryDate) < new Date() ? (
                          <Badge variant="destructive">Expired</Badge>
                        ) : (
                          <Badge>Active</Badge>
                        )}
                        <Button size="sm" variant="outline">Edit</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manage Users</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-gray-500">
                  In a complete implementation, this section would display registered users and allow the admin to manage them.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminPanel;
