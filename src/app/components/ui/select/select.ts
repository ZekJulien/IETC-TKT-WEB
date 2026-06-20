import { booleanAttribute, Component, effect, inject, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-select',
  imports: [],
  templateUrl: './select.html',
  styleUrl: './select.css',
  host: {
    '[class.block]': 'block()',
  },
})
export class Select implements ControlValueAccessor {
  private readonly ngControl = inject(NgControl, { self: true, optional: true });

  readonly selectId = input('');
  readonly size = input<'md' | 'sm'>('md');
  readonly block = input(true, { transform: booleanAttribute });
  readonly value = input<string | number>();
  readonly forceInvalid = input(false);
  readonly changed = output<string>();

  protected readonly selected = signal('');
  protected readonly disabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    effect(() => {
      const v = this.value();
      if (v !== undefined) {
        this.selected.set(String(v));
      }
    });
  }

  protected get invalid(): boolean {
    const control = this.ngControl?.control;
    return (!!control && control.invalid && control.touched) || this.forceInvalid();
  }

  writeValue(value: string | null): void {
    this.selected.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  protected handleChange(event: Event): void {
    const next = (event.target as HTMLSelectElement).value;
    this.selected.set(next);
    this.onChange(next);
    this.changed.emit(next);
  }

  protected handleBlur(): void {
    this.onTouched();
  }
}
