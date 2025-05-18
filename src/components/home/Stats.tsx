
import React from 'react';

const Stats = () => {
  return (
    <section className="bg-brand-blue text-white py-16">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Impact in Numbers</h2>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Garinhca.com has been connecting businesses with opportunities since our launch. Here's our impact so far.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">5,000+</div>
            <p className="text-blue-200 text-lg">Tenders Posted</p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">10,000+</div>
            <p className="text-blue-200 text-lg">Registered Users</p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">25,000+</div>
            <p className="text-blue-200 text-lg">Applications Submitted</p>
          </div>
          
          <div className="text-center">
            <div className="text-5xl font-bold mb-2">98%</div>
            <p className="text-blue-200 text-lg">Satisfaction Rate</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
