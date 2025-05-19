
import Layout from '@/components/layout/Layout';
import Hero from '@/components/home/Hero';
import TenderList from '@/components/home/TenderList';
import Features from '@/components/home/Features';
import Stats from '@/components/home/Stats';

const Index = () => {
  return (
    <Layout>
      <Hero />
      <TenderList />
      <Features />
    </Layout>
  );
};

export default Index;
