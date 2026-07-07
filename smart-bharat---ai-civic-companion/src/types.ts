export interface CitizenProfile {
  age: number;
  income: number; // annual income in INR
  gender: 'Male' | 'Female' | 'Other';
  state: string;
  category: 'General' | 'OBC' | 'SC' | 'ST';
  occupation: 'Farmer' | 'Student' | 'Salaried' | 'Self-Employed' | 'Unemployed' | 'Retired';
  disability: boolean;
}

export interface Scheme {
  id: string;
  name: string;
  ministry: string;
  description: string;
  eligibilitySummary: string;
  benefits: string[];
  checklist: string[];
  steps: string[];
  bilingualName?: { [key: string]: string };
}

export interface ComplaintHistory {
  status: 'Submitted' | 'Under Investigation' | 'Assigned' | 'Resolved';
  date: string;
  remarks: string;
}

export interface Complaint {
  id: string;
  ticketId: string;
  category: string;
  description: string;
  region: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  imageUrl?: string;
  status: 'Submitted' | 'Under Investigation' | 'Assigned' | 'Resolved';
  dateSubmitted: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  priorityScore: number; // 1-100
  department: string;
  slaDays: number;
  assignedOfficer?: string;
  history: ComplaintHistory[];
  duplicateOf?: string; // Ticket ID of the duplicate complaint
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: string;
  intent?: 'informational' | 'complaint' | 'service_request' | 'general';
  language?: string;
  translation?: string;
  suggestedAction?: {
    type: 'apply_scheme' | 'report_complaint' | 'verify_doc';
    payload: any;
  };
}

export interface VerificationResult {
  verified: boolean;
  score: number;
  extractedData: {
    name?: string;
    idNumber?: string;
    dob?: string;
    income?: string;
    state?: string;
  };
  checks: {
    nameMatches: boolean;
    formatValid: boolean;
    hasStampSignature: boolean;
    dataCompleteness: boolean;
  };
  feedback: string[];
}

export interface ServiceContract {
  name: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requestBody: string;
  responseBody: string;
  description: string;
}

export interface ServiceDefinition {
  name: string;
  description: string;
  techStack: string;
  responsibilities: string[];
  contracts: ServiceContract[];
}
