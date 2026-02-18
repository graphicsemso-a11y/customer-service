
import React, { useState, useEffect, useMemo } from 'react';
import InquiryForm from './components/InquiryForm';
import Dashboard from './components/Dashboard';
import ReportGenerator from './components/ReportGenerator';
import { Inquiry, InquiryCategory } from './types';

const App: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('service_inquiries');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeTab, setActiveTab] = useState<'entries' | 'dashboard' | 'reports'>('entries');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('service_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const addInquiry = (newInquiry: Inquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const removeInquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      setInquiries(prev => prev.filter(iq => iq.id !== id));
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter(iq => 
      iq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iq.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iq.inquiryDetails.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iq.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inquiries, searchTerm]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <i className="fas fa-headset text-white text-xl"></i>
            </div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">Service<span className="text-blue-600">Insight</span></h1>
          </div>
          <div className="hidden md:flex items-center space-x-1">
            <button 
              onClick={() => setActiveTab('entries')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'entries' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <i className="fas fa-list-ul mr-2"></i> Entries
            </button>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <i className="fas fa-chart-line mr-2"></i> Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'reports' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              <i className="fas fa-file-alt mr-2"></i> Reports
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Mobile Navigation Tabs */}
        <div className="md:hidden flex space-x-2 mb-6">
           <button onClick={() => setActiveTab('entries')} className={`flex-1 py-2 text-center rounded-lg text-xs font-bold uppercase ${activeTab === 'entries' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>Entries</button>
           <button onClick={() => setActiveTab('dashboard')} className={`flex-1 py-2 text-center rounded-lg text-xs font-bold uppercase ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>Stats</button>
           <button onClick={() => setActiveTab('reports')} className={`flex-1 py-2 text-center rounded-lg text-xs font-bold uppercase ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-white text-gray-500 border border-gray-200'}`}>Reports</button>
        </div>

        {activeTab === 'entries' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Column */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <InquiryForm onAdd={addInquiry} />
              </div>
            </div>

            {/* List Column */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                <div className="relative flex-grow">
                  <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search by name, phone, or category..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="text-sm font-medium text-gray-500 whitespace-nowrap">
                  Total: {inquiries.length}
                </div>
              </div>

              {filteredInquiries.length > 0 ? (
                <div className="space-y-4">
                  {filteredInquiries.map((iq) => (
                    <div key={iq.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider
                            ${iq.category === InquiryCategory.CPD ? 'bg-blue-100 text-blue-700' : ''}
                            ${iq.category === InquiryCategory.IDP ? 'bg-green-100 text-green-700' : ''}
                            ${iq.category === InquiryCategory.MOTORSPORT ? 'bg-red-100 text-red-700' : ''}
                            ${iq.category === InquiryCategory.TIR ? 'bg-orange-100 text-orange-700' : ''}
                            ${iq.category === InquiryCategory.GENERAL ? 'bg-gray-100 text-gray-700' : ''}
                          `}>
                            {iq.category}
                          </span>
                          <span className="text-xs text-gray-400 font-medium">{iq.date}</span>
                        </div>
                        <h4 className="font-bold text-gray-900 mb-0.5">{iq.name} <span className="text-sm font-normal text-gray-500 ml-1">(Qty: {iq.count})</span></h4>
                        <div className="text-sm text-blue-600 mb-2 flex items-center gap-1.5">
                          <i className="fas fa-phone-alt text-xs"></i>
                          {iq.phoneNumber}
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{iq.inquiryDetails}</p>
                      </div>
                      <div className="flex items-center gap-2 self-end md:self-start opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => removeInquiry(iq.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete"
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-xl border-2 border-dashed border-gray-200">
                  <i className="fas fa-folder-open text-5xl text-gray-200 mb-4"></i>
                  <p className="text-gray-400 font-medium">No inquiries found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && <Dashboard inquiries={inquiries} />}
        {activeTab === 'reports' && <ReportGenerator inquiries={inquiries} />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© 2024 ServiceInsight Hub. Built for Excellence.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-blue-600 text-lg"><i className="fab fa-github"></i></a>
            <a href="#" className="text-gray-400 hover:text-blue-600 text-lg"><i className="fab fa-linkedin"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
