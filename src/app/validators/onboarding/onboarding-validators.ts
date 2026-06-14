import { AbstractControl, ValidatorFn } from '@angular/forms';

const DIACRITICS = /[\u0300-\u036f]/g;
const NON_SLUG = /[^a-z0-9]+/g;
const EDGE_HYPHENS = /^-+|-+$/g;

export class OnboardingValidators {
  static readonly SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
  static readonly SLUG_MAX_LENGTH = 100;

  static slugify(value: string | null | undefined): string {
    return (value ?? '')
      .normalize('NFD')
      .replace(DIACRITICS, '')
      .toLowerCase()
      .trim()
      .replace(NON_SLUG, '-')
      .replace(EDGE_HYPHENS, '');
  }

  static readonly slug: ValidatorFn = (control: AbstractControl) => {
    const value = (control.value ?? '') as string;
    if (!value) {
      return null;
    }
    const valid =
      OnboardingValidators.SLUG_PATTERN.test(value) &&
      value.length <= OnboardingValidators.SLUG_MAX_LENGTH;
    return valid ? null : { slugInvalid: true };
  };
}
