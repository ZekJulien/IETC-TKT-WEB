import { Membership } from './membership';

export interface MeResponse {
  email: string;
  emailConfirmed: boolean;
  onboardingRequired: boolean;
  firstName: string | null;
  lastName: string | null;
  memberships: Membership[];
}
