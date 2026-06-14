import { Membership } from './membership';

export interface MeResponse {
  email: string;
  emailConfirmed: boolean;
  onboardingRequired: boolean;
  memberships: Membership[];
}
