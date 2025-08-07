export interface Property {
  id: number;
  title: string;
  description: string;
  price: number | null;
  images: string[];
  area: number | null;
  latitude: number | null;
  longitude: number | null;
  category: string;
  district: string;
  type: string;
  createdAt: string;
  manager: string;
  contact: string;
  status: number;
}

export type NewProperty = Omit<Property, 'id' | 'createdAt'>;

export interface Inquiry {
  id: number;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  requirements: string;
  budget: number | null;
  attachments: string[];
  createdAt: string;
  status: number;
}

export type NewInquiry = Omit<Inquiry, 'id' | 'createdAt'>;

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: string;
  createdAt: string;
  status: number;
}

export type NewUser = Omit<User, 'id' | 'createdAt'>;

export type Note = {
  text: string;
  completed: boolean;
};