export const OnboardingStep = {
  Choice: 'choice',
  CreateCompany: 'create-company',
  JoinInvitation: 'join-invitation',
} as const;

export type OnboardingStep = (typeof OnboardingStep)[keyof typeof OnboardingStep];
