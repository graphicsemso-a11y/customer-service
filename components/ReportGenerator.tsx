
import React, { useState, useMemo } from 'react';
import { generateReport } from '../services/geminiService';
import { Inquiry } from '../types';
import Dashboard from './Dashboard';

interface ReportGeneratorProps {
  inquiries: Inquiry[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ inquiries }) => {
  const [reportType, setReportType] = useState<'Daily' | 'Monthly'>('Daily');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredInquiries = useMemo(() => {
    if (reportType === 'Daily') {
      return inquiries.filter(iq => iq.date === selectedDate);
    } else {
      return inquiries.filter(iq => iq.date.startsWith(selectedMonth));
    }
  }, [inquiries, reportType, selectedDate, selectedMonth]);

  const handleGenerate = async () => {
    if (filteredInquiries.length === 0) {
      alert("Insufficient data to perform intelligence synthesis for this period.");
      return;
    }

    setLoading(true);
    setReport(null);
    try {
      const periodLabel = reportType === 'Daily' ? selectedDate : selectedMonth;
      const result = await generateReport(filteredInquiries, periodLabel, reportType);
      setReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadExcel = () => {
    if (filteredInquiries.length === 0) return;

    const headers = ["ID", "Name", "Phone", "Category", "Quantity", "Date", "Details"];
    const rows = filteredInquiries.map(iq => [
      iq.id,
      `"${iq.name}"`,
      `"${iq.phoneNumber}"`,
      iq.category,
      iq.count,
      iq.date,
      `"${iq.inquiryDetails.replace(/"/g, '""')}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(e => e.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const filename = reportType === 'Daily' 
      ? `ATCUAE_Daily_Log_${selectedDate}.csv` 
      : `ATCUAE_Monthly_Log_${selectedMonth}.csv`;
    
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Control Module */}
      <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white flex flex-col xl:flex-row items-center justify-between gap-8">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <span className="bg-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">
              Intelligence Core
            </span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Reporting <span className="text-blue-600">Studio</span></h2>
          </div>
          <p className="text-slate-500 font-bold text-sm">Select reporting scope to synthesize strategic insights.</p>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-6">
          {/* Toggle Switch */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl ring-1 ring-slate-200">
            <button 
              onClick={() => { setReportType('Daily'); setReport(null); }}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'Daily' ? 'bg-white text-slate-900 shadow-lg ring-1 ring-slate-200' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Daily
            </button>
            <button 
              onClick={() => { setReportType('Monthly'); setReport(null); }}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportType === 'Monthly' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Monthly
            </button>
          </div>

          {/* Dynamic Period Picker */}
          {reportType === 'Daily' ? (
            <input
              type="date"
              className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-900 shadow-inner"
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setReport(null); }}
            />
          ) : (
            <input
              type="month"
              className="px-6 py-3.5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 outline-none font-bold text-slate-900 shadow-inner"
              value={selectedMonth}
              onChange={(e) => { setSelectedMonth(e.target.value); setReport(null); }}
            />
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleGenerate}
              disabled={loading || filteredInquiries.length === 0}
              className="bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]"
            >
              {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-brain-circuit"></i>}
              {loading ? 'Synthesizing...' : `Analyze ${reportType}`}
            </button>
            
            <button
              onClick={downloadExcel}
              disabled={filteredInquiries.length === 0}
              className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-100 disabled:text-slate-300 text-white font-black py-4 px-8 rounded-2xl flex items-center gap-3 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-[10px]"
            >
              <i className="fas fa-file-export"></i>
              Excel
            </button>
          </div>
        </div>
      </div>

      {/* Content Module */}
      {filteredInquiries.length > 0 ? (
        <div className="grid grid-cols-1 gap-10">
          {/* Visual Analytics Grid */}
          <div className="bg-white/50 backdrop-blur-xl p-8 rounded-[3rem] border border-white shadow-sm">
            <div className="flex items-center justify-between mb-10 px-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Data <span className="text-blue-600">Visualization</span></h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Snapshot of {reportType === 'Daily' ? selectedDate : selectedMonth}</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Integration</span>
              </div>
            </div>
            <Dashboard inquiries={filteredInquiries} />
          </div>

          {/* AI Intelligence Module */}
          {report && (
            <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden group border border-slate-800">
              {/* Abstract Background Design */}
              <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-1000 pointer-events-none scale-150">
                 <img src="https://upload.wikimedia.org/wikipedia/en/3/30/Automobile_%26_Touring_Club_of_the_UAE_logo.png" alt="" className="w-96 grayscale invert" />
              </div>
              
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600/20 backdrop-blur-xl flex items-center justify-center border border-blue-500/30">
                      <i className="fas fa-stars text-blue-400 text-2xl animate-pulse"></i>
                    </div>
                    <div>
                      <h3 className="text-3xl font-black tracking-tighter uppercase italic">Executive <span className="text-blue-400">Intelligence</span></h3>
                      <p className="text-blue-400/60 text-[10px] font-black uppercase tracking-[0.4em] mt-1">Generative Strategic Synthesis</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setReport(null)}
                    className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest bg-white/5 px-6 py-3 rounded-xl transition-all border border-white/5 hover:border-white/20"
                  >
                    Discard Analysis
                  </button>
                </div>

                <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed font-medium space-y-6 text-lg tracking-tight">
                  <div className="whitespace-pre-wrap selection:bg-blue-600/50">
                    {report}
                  </div>
                </div>
                
                <div className="mt-16 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-4">
                     <i className="fas fa-shield-check text-emerald-500"></i>
                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">Verified ATCUAE Internal Intelligence Document • AI-00{filteredInquiries.length}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-3 text-slate-500 hover:text-white transition-all"><i className="fas fa-copy"></i></button>
                     <button className="p-3 text-slate-500 hover:text-white transition-all"><i className="fas fa-print"></i></button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Waiting/Empty States */}
          {!report && !loading && (
             <div className="bg-white/40 backdrop-blur-xl py-24 rounded-[3.5rem] border border-white text-center flex flex-col items-center">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-50 flex items-center justify-center mb-8 shadow-inner border border-slate-100">
                   <i className="fas fa-brain-nodes text-4xl text-slate-200"></i>
                </div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Ready for <span className="text-blue-600">Synthesis</span></h4>
                <p className="text-slate-400 text-sm mt-3 max-w-sm mx-auto font-medium">Click the analyze button to process {filteredInquiries.length} records into a strategic executive report.</p>
             </div>
          )}

          {loading && (
             <div className="bg-slate-900 rounded-[3.5rem] py-40 flex flex-col items-center justify-center text-white border border-slate-800 shadow-2xl">
                <div className="relative w-32 h-32 flex items-center justify-center">
                   <div className="absolute inset-0 rounded-full border-[3px] border-blue-500/10"></div>
                   <div className="absolute inset-0 rounded-full border-t-[3px] border-blue-400 animate-spin"></div>
                   <div className="absolute inset-4 rounded-full border-[1px] border-blue-500/10 animate-pulse"></div>
                   <i className="fas fa-bolt-lightning text-4xl text-blue-400 animate-bounce"></i>
                </div>
                <h4 className="text-3xl font-black tracking-tighter mt-12 italic uppercase">Synthesizing <span className="text-blue-400">Data...</span></h4>
                <p className="text-slate-500 text-[10px] mt-4 animate-pulse uppercase tracking-[0.5em] font-black">AI Strategic Core Processing</p>
             </div>
          )}
        </div>
      ) : (
        <div className="bg-white/40 backdrop-blur-xl py-48 rounded-[3.5rem] border border-white text-center">
          <div className="w-28 h-28 bg-white/60 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-slate-900/5 border border-white">
             <i className="fas fa-database text-5xl text-slate-200"></i>
          </div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Vault <span className="text-slate-400">Resting</span></h3>
          <p className="text-slate-400 text-sm mt-3 max-w-xs mx-auto font-bold uppercase tracking-widest">No records found for {reportType === 'Daily' ? selectedDate : selectedMonth}</p>
          <div className="mt-8">
             <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:underline">Return to Data Entry <i className="fas fa-arrow-up ml-1"></i></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
