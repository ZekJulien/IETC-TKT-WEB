import { Directive, TemplateRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appDatatableCell]',
})
export class DatatableCell {
  readonly key = input.required<string>({ alias: 'appDatatableCell' });
  readonly template = inject(TemplateRef<{ $implicit: unknown }>);
}
