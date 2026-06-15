import { AuthTokens } from '../auth';

export interface JoinInvitationResponse extends AuthTokens {
  companyId: string;
  role: string;
}
