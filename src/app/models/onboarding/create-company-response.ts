import { AuthTokens } from '../auth';

export interface CreateCompanyResponse extends AuthTokens {
  companyId: string;
  companyName: string;
  companySlug: string;
  role: string;
}
