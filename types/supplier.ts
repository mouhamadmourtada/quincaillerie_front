export interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  type?: string;
  siret?: string;
  createdAt?: string;
  sector?: string;
  preferredPaymentMethod?: string;
  city?: string;
  country?: string;
  companyName?: string;
}