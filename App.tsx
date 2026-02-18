
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
  
  const [activeTab, setActiveTab] = useState<'entries' | 'reports'>('entries');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    localStorage.setItem('service_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  const addInquiry = (newInquiry: Inquiry) => {
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const removeInquiry = (id: string) => {
    if (confirm('Are you sure you want to delete this permanent record?')) {
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

  const logoUrl = 'https://upload.wikimedia.org/wikipedia/en/3/30/Automobile_%26_Touring_Club_of_the_UAE_logo.png';

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-slate-50 selection:bg-blue-600 selection:text-white">
      {/* Background Watermark Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.04] flex items-center justify-center p-20 select-none">
        <div 
          className="w-full h-full max-w-5xl"
          style={{
            backgroundImage: `url(${logoUrl})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            filter: 'grayscale(1) brightness(0.8)'
          }}
        />
      </div>

      {/* Corporate Navigation Bar */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <img src={logoUrl} alt="ATCUAE Logo" className="h-12 w-auto drop-shadow-sm transition-transform group-hover:scale-105" />
            </div>
            <div className="h-10 w-px bg-slate-200 mx-2 hidden md:block"></div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-black text-slate-900 leading-none tracking-tighter">ATCUAE</h1>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em] mt-1.5">Intelligence Hub</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('entries')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5 ${
                activeTab === 'entries' 
                ? 'bg-white text-slate-900 shadow-xl ring-1 ring-slate-200/50' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fas fa-database text-[10px]"></i> Operational Logs
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2.5 ${
                activeTab === 'reports' 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <i className="fas fa-chart-line text-[10px]"></i> Visual Reports
            </button>
          </div>
        </div>
      </header>

      {/* Primary Workspace */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full z-10 relative">
        {activeTab === 'entries' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Input Form Column */}
            <div className="lg:col-span-4 sticky top-32">
              <InquiryForm onAdd={addInquiry} />
              
              <div className="mt-8 p-6 bg-blue-600 rounded-[2rem] text-white shadow-xl shadow-blue-600/20 relative overflow-hidden group">
                 <i className="fas fa-circle-info absolute -right-4 -bottom-4 text-8xl opacity-10 group-hover:scale-110 transition-transform"></i>
                 <h4 className="font-black text-sm uppercase tracking-widest mb-2">Live Stream Stats</h4>
                 <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black tracking-tighter">{inquiries.length}</span>
                    <span className="text-blue-100 text-xs font-bold">Total Processed</span>
                 </div>
              </div>
            </div>

            {/* Records List Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900 p-5 rounded-3xl shadow-2xl border border-slate-800 flex items-center gap-4">
                <div className="relative flex-grow">
                  <i className="fas fa-search absolute left-5 top-1/2 -translate-y-1/2 text-slate-500"></i>
                  <input
                    type="text"
                    placeholder="Search by Name, Contact, or Stream..."
                    className="w-full pl-12 pr-5 py-4 bg-slate-800/50 border border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-bold text-sm text-white placeholder:text-slate-500 shadow-inner"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredInquiries.length > 0 ? (
                <div className="grid grid-cols-1 gap-5">
                  {filteredInquiries.map((iq) => (
                    <div key={iq.id} className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] shadow-sm border border-white group hover:border-blue-400 hover:shadow-xl hover:shadow-blue-600/5 transition-all flex flex-col md:flex-row md:items-start justify-between gap-6 relative overflow-hidden">
                      <div className={`absolute left-0 top-0 bottom-0 w-2.5 transition-all group-hover:w-4
                        ${iq.category === InquiryCategory.CPD ? 'bg-blue-600' : ''}
                        ${iq.category === InquiryCategory.IDP ? 'bg-emerald-500' : ''}
                        ${iq.category === InquiryCategory.MOTORSPORT ? 'bg-rose-500' : ''}
                        ${iq.category === InquiryCategory.TIR ? 'bg-amber-500' : ''}
                        ${iq.category === InquiryCategory.GENERAL ? 'bg-slate-400' : ''}
                      `}></div>
                      
                      <div className="flex-grow pl-4">
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm
                            ${iq.category === InquiryCategory.CPD ? 'bg-blue-600 text-white' : ''}
                            ${iq.category === InquiryCategory.IDP ? 'bg-emerald-500 text-white' : ''}
                            ${iq.category === InquiryCategory.MOTORSPORT ? 'bg-rose-500 text-white' : ''}
                            ${iq.category === InquiryCategory.TIR ? 'bg-amber-500 text-white' : ''}
                            ${iq.category === InquiryCategory.GENERAL ? 'bg-slate-600 text-white' : ''}
                          `}>
                            {iq.category}
                          </span>
                          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200/50">
                            <i className="far fa-calendar-alt mr-2 text-blue-500"></i> {iq.date}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                          <h4 className="font-black text-slate-900 text-2xl tracking-tighter">{iq.name}</h4>
                          <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 uppercase flex items-center gap-2">
                             <i className="fas fa-phone-volume text-[10px]"></i> {iq.phoneNumber}
                          </span>
                        </div>
                        <p className="text-slate-600 leading-relaxed font-medium text-base bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50">
                          {iq.inquiryDetails}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 self-end md:self-start opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                        <button 
                          onClick={() => removeInquiry(iq.id)}
                          className="w-12 h-12 flex items-center justify-center text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-transparent hover:border-rose-100 shadow-sm"
                          title="Erase Record"
                        >
                          <i className="fas fa-trash-can"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-40 bg-white/40 backdrop-blur-md rounded-[3rem] border-4 border-dashed border-white/60">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/10 scale-110">
                    <i className="fas fa-cloud-sun text-4xl text-blue-200"></i>
                  </div>
                  <h3 className="text-2xl font-black text-slate-400 tracking-tight">No Results Found</h3>
                  <p className="text-slate-400 text-sm mt-2 font-medium px-10 text-center">We couldn't find any inquiries matching your current filters.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <ReportGenerator inquiries={inquiries} />
        )}
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white/90 backdrop-blur-xl border-t border-slate-200 py-16 z-40 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="flex items-center gap-6">
             <img src={logoUrl} alt="Logo" className="h-16 w-auto grayscale opacity-40 hover:grayscale-0 transition-all cursor-crosshair" />
             <div className="flex flex-col">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Official Enterprise Resource</p>
                <p className="text-sm font-bold text-slate-600 mt-1">Automobile & Touring Club UAE</p>
             </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
             <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest px-5 py-3 bg-blue-50 border border-blue-100 rounded-2xl shadow-sm">Advanced Security Engine</span>
             <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest px-5 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl shadow-sm">AI Analytics Verified</span>
          </div>
          <div className="text-right hidden md:block">
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Line</p>
             <p className="text-lg font-black text-slate-900 mt-1">+971 800 ATCUAE</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
