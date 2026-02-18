
import React, { useState } from 'react';
import { generateDailyReport } from '../services/geminiService';
import { Inquiry } from '../types';

interface ReportGeneratorProps {
  inquiries: Inquiry[];
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ inquiries }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredInquiries = inquiries.filter(iq => iq.date === selectedDate);

  const handleGenerate = async () => {
    if (filteredInquiries.length === 0) {
      alert("No data available for the selected date.");
      return;
    }

    setLoading(true);
    try {
      const result = await generateDailyReport(filteredInquiries, selectedDate);
      setReport(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">End-of-Day Report</h3>
          <p className="text-sm text-gray-500">Generate an AI-driven summary of daily activities</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="date"
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || filteredInquiries.length === 0}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg flex items-center gap-2 transition-all"
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-magic"></i>
            )}
            {loading ? 'Analyzing...' : 'Generate AI Report'}
          </button>
        </div>
      </div>

      {!report && !loading && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <i className="fas fa-file-invoice text-4xl text-gray-300 mb-3"></i>
          <p className="text-gray-500">
            {filteredInquiries.length > 0 
              ? `Ready to analyze ${filteredInquiries.length} inquiries for ${selectedDate}` 
              : `No inquiries logged for ${selectedDate}`}
          </p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-blue-600 font-medium animate-pulse">Gemini is synthesizing your daily insights...</p>
        </div>
      )}

      {report && !loading && (
        <div className="prose prose-blue max-w-none bg-gray-50 p-6 rounded-lg border border-gray-200 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-100 px-2 py-1 rounded">Generated Report</span>
            <button 
              onClick={() => setReport(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {report}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
