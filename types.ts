
export enum InquiryCategory {
  CPD = 'CPD',
  IDP = 'IDP',
  MOTORSPORT = 'Motorsport',
  TIR = 'TIR',
  GENERAL = 'General'
}

export interface Inquiry {
  id: string;
  count: number;
  phoneNumber: string;
  inquiryDetails: string;
  name: string;
  category: InquiryCategory;
  date: string;
  timestamp: number;
}

export interface DailySummary {
  date: string;
  totalInquiries: number;
  categoryBreakdown: Record<InquiryCategory, number>;
  aiReport?: string;
}
