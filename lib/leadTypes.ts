export type Lead = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: string;
};

export type LeadInput = Omit<Lead, "id" | "createdAt">;
