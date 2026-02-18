
import React, { useState } from 'react';
import { InquiryCategory, Inquiry } from '../types';

interface InquiryFormProps {
  onAdd: (inquiry: Inquiry) => void;
}

const InquiryForm: React.FC<InquiryFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    count: 1,
    inquiryDetails: '',
    category: InquiryCategory.GENERAL,
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.inquiryDetails || !formData.phoneNumber) return;

    const newInquiry: Inquiry = {
      ...formData,
      id: crypto.randomUUID(),
      timestamp: Date.now()
    };

    onAdd(newInquiry);
    setFormData({
      ...formData,
      name: '',
      phoneNumber: '',
      count: 1,
      inquiryDetails: '',
      category: InquiryCategory.GENERAL,
      date: formData.date
    });
  };

  const inputClasses = "w-full px-5 py-3.5 bg-slate-800/80 border border-slate-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-semibold text-sm text-white placeholder:text-slate-500 shadow-inner";
  const labelClasses = "block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1";

  return (
    <div className="p-8 bg-slate-900/90 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl">
      <h3 className="text-xl font-black mb-8 flex items-center gap-3 text-white uppercase tracking-tight">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
          <i className="fas fa-file-pen text-white text-sm"></i>
        </div>
        Record Entry
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className={labelClasses}>Full Name</label>
            <input
              type="text"
              required
              className={inputClasses}
              placeholder="e.g. Ahmad Al-Mansouri"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          
          <div>
            <label className={labelClasses}>Contact Number</label>
            <input
              type="tel"
              required
              className={inputClasses}
              placeholder="+971..."
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Quantity</label>
              <input
                type="number"
                min="1"
                required
                className={inputClasses}
                value={formData.count}
                onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <label className={labelClasses}>Date</label>
              <input
                type="date"
                required
                className={inputClasses}
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Service Stream</label>
            <select
              className={`${inputClasses} cursor-pointer appearance-none bg-slate-800/80`}
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as InquiryCategory }))}
            >
              {Object.values(InquiryCategory).map(cat => (
                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className={labelClasses}>Inquiry Specification</label>
          <textarea
            required
            rows={4}
            className={`${inputClasses} resize-none`}
            placeholder="Document detailed request specifics..."
            value={formData.inquiryDetails}
            onChange={(e) => setFormData(prev => ({ ...prev, inquiryDetails: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40 transform active:scale-[0.97] transition-all uppercase tracking-widest text-[10px]"
        >
          Confirm Log <i className="fas fa-check-circle ml-2"></i>
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
