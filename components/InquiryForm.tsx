
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
      category: InquiryCategory.GENERAL
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-800">
        <i className="fas fa-plus-circle text-blue-600"></i>
        New Entry
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              placeholder="+971..."
              value={formData.phoneNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Count / Volume</label>
            <input
              type="number"
              min="1"
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
              value={formData.count}
              onChange={(e) => setFormData(prev => ({ ...prev, count: parseInt(e.target.value) || 1 }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-white"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as InquiryCategory }))}
            >
              {Object.values(InquiryCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            required
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Inquiry Details</label>
          <textarea
            required
            rows={3}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Describe the customer's request..."
            value={formData.inquiryDetails}
            onChange={(e) => setFormData(prev => ({ ...prev, inquiryDetails: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all"
        >
          Submit Entry
        </button>
      </form>
    </div>
  );
};

export default InquiryForm;
