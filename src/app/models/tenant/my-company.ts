import { CompanyRole } from '../companies';

export interface MyCompany {
  companyId: string;
  companyName: string;
  companySlug: string;
  logoUrl: string | null;
  role: CompanyRole;
  isActive: boolean;
}
