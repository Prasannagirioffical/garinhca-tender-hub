
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/components/ui/sonner";

export interface Tender {
  id: string;
  title: string;
  category: 'government' | 'private';
  email: string;
  location: string;
  budget: string;
  expiryDate: string;
  description: string;
  posterName: string;
  posterId: string;
  createdAt: string;
  status: 'open' | 'closed' | 'draft';
  imageUrl?: string; // Added image URL field
}

interface TenderContextType {
  tenders: Tender[];
  addTender: (tender: Omit<Tender, 'id' | 'createdAt'>) => void;
  getTenderById: (id: string) => Tender | undefined;
  applyToTender: (tenderId: string, userId: string) => boolean;
  applications: { tenderId: string; userId: string }[];
  deleteTender: (tenderId: string) => void; // Added delete function
  updateTender: (id: string, tender: Partial<Tender>) => boolean; // Added update function
}

const TenderContext = createContext<TenderContextType | null>(null);

export const useTender = () => {
  const context = useContext(TenderContext);
  if (!context) {
    throw new Error('useTender must be used within a TenderProvider');
  }
  return context;
};

// Sample tenders data
const initialTenders: Tender[] = [
  {
    id: '1',
    title: 'Web Development Project',
    category: 'private',
    email: 'company@example.com',
    location: 'Remote',
    budget: '$5,000 - $10,000',
    expiryDate: '2025-06-30',
    description: 'Looking for skilled web developers to create a modern e-commerce website.',
    posterName: 'Tech Solutions Inc.',
    posterId: 'poster123',
    createdAt: '2025-05-01',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7'
  },
  {
    id: '2',
    title: 'Road Construction Tender',
    category: 'government',
    email: 'gov@example.gov',
    location: 'Central Region',
    budget: '$500,000 - $750,000',
    expiryDate: '2025-07-15',
    description: 'Government tender for the construction of a 5km road with proper drainage.',
    posterName: 'Department of Infrastructure',
    posterId: 'gov456',
    createdAt: '2025-05-05',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
  },
  {
    id: '3',
    title: 'Office Renovation Project',
    category: 'private',
    email: 'corporate@example.com',
    location: 'Downtown',
    budget: '$20,000 - $30,000',
    expiryDate: '2025-06-15',
    description: 'Seeking contractors for a complete office renovation including furniture and fixtures.',
    posterName: 'Corporate Services Ltd.',
    posterId: 'corp789',
    createdAt: '2025-05-10',
    status: 'open',
    imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b'
  }
];

export const TenderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenders, setTenders] = useState<Tender[]>(() => {
    const savedTenders = localStorage.getItem('garinhca_tenders');
    return savedTenders ? JSON.parse(savedTenders) : initialTenders;
  });
  
  const [applications, setApplications] = useState<{ tenderId: string; userId: string }[]>(() => {
    const savedApplications = localStorage.getItem('garinhca_applications');
    return savedApplications ? JSON.parse(savedApplications) : [];
  });

  const addTender = (tenderData: Omit<Tender, 'id' | 'createdAt'>) => {
    const newTender: Tender = {
      ...tenderData,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString(),
    };
    
    const updatedTenders = [...tenders, newTender];
    setTenders(updatedTenders);
    localStorage.setItem('garinhca_tenders', JSON.stringify(updatedTenders));
    toast.success("Tender posted successfully!");
  };

  const getTenderById = (id: string) => {
    return tenders.find(tender => tender.id === id);
  };

  const applyToTender = (tenderId: string, userId: string) => {
    // Check if already applied
    const alreadyApplied = applications.some(
      app => app.tenderId === tenderId && app.userId === userId
    );
    
    if (alreadyApplied) {
      toast.error("You have already applied to this tender");
      return false;
    }
    
    const newApplication = { tenderId, userId };
    const updatedApplications = [...applications, newApplication];
    setApplications(updatedApplications);
    localStorage.setItem('garinhca_applications', JSON.stringify(updatedApplications));
    toast.success("Application submitted successfully!");
    return true;
  };

  // Add delete tender function
  const deleteTender = (tenderId: string) => {
    const updatedTenders = tenders.filter(tender => tender.id !== tenderId);
    setTenders(updatedTenders);
    localStorage.setItem('garinhca_tenders', JSON.stringify(updatedTenders));
    toast.success("Tender deleted successfully");
  };

  // Add update tender function
  const updateTender = (id: string, tenderData: Partial<Tender>) => {
    const tenderIndex = tenders.findIndex(tender => tender.id === id);
    
    if (tenderIndex === -1) {
      toast.error("Tender not found");
      return false;
    }
    
    const updatedTenders = [...tenders];
    updatedTenders[tenderIndex] = {
      ...updatedTenders[tenderIndex],
      ...tenderData
    };
    
    setTenders(updatedTenders);
    localStorage.setItem('garinhca_tenders', JSON.stringify(updatedTenders));
    toast.success("Tender updated successfully");
    return true;
  };

  return (
    <TenderContext.Provider value={{ 
      tenders, 
      addTender, 
      getTenderById, 
      applyToTender,
      applications,
      deleteTender,
      updateTender
    }}>
      {children}
    </TenderContext.Provider>
  );
};
