import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthShell } from '../../components/auth-shell/auth-shell';
import { Button } from '../../components/ui/button/button';
import { FormField } from '../../components/ui/form-field/form-field';
import { Input } from '../../components/ui/input/input';
import { Stepper } from '../../components/ui/stepper/stepper';
import { TranslationKey } from '../../i18n/i18n-store';
import { TranslatePipe } from '../../i18n/translate-pipe';
import { OnboardingStep, OnboardingStore } from '../../state/onboarding';
import { OnboardingValidators } from '../../validators/onboarding';

@Component({
  selector: 'app-onboarding-page',
  imports: [ReactiveFormsModule, TranslatePipe, AuthShell, Stepper, Button, FormField, Input],
  templateUrl: './onboarding-page.html',
  styleUrl: './onboarding-page.css',
})
export class OnboardingPage {
  private readonly fb = inject(FormBuilder);
  readonly store = inject(OnboardingStore);
  protected readonly OnboardingStep = OnboardingStep;

  readonly steps: TranslationKey[] = [
    'onboardingPage.steps.verify',
    'onboardingPage.steps.choice',
    'onboardingPage.steps.setup',
  ];

  readonly companyForm = this.fb.nonNullable.group({
    companyName: ['', [Validators.required, Validators.maxLength(255)]],
    companySlug: ['', [Validators.required, OnboardingValidators.slug]],
  });

  readonly invitationForm = this.fb.nonNullable.group({
    invitationCode: ['', [Validators.required, Validators.maxLength(64)]],
  });

  private slugEdited = false;

  constructor() {
    this.store.reset();

    const name = this.companyForm.controls.companyName;
    const slug = this.companyForm.controls.companySlug;

    name.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      if (!this.slugEdited) {
        slug.setValue(OnboardingValidators.slugify(value), { emitEvent: false });
      }
    });

    slug.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.slugEdited = true;
    });
  }

  get stepIndex(): number {
    return this.store.step() === OnboardingStep.Choice ? 1 : 2;
  }

  submitCompany(): void {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      return;
    }
    this.store.createCompany(this.companyForm.getRawValue());
  }

  submitInvitation(): void {
    if (this.invitationForm.invalid) {
      this.invitationForm.markAllAsTouched();
      return;
    }
    this.store.joinInvitation(this.invitationForm.getRawValue());
  }
}
