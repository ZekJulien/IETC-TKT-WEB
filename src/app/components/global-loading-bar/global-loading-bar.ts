import { Component, effect, inject, signal } from '@angular/core';
import { LoadingStore } from '../../state/loading';

const SHOW_DELAY = 150;

@Component({
  selector: 'app-global-loading-bar',
  imports: [],
  templateUrl: './global-loading-bar.html',
  styleUrl: './global-loading-bar.css',
})
export class GlobalLoadingBar {
  private readonly loading = inject(LoadingStore);

  protected readonly visible = signal(false);

  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    effect(() => {
      if (this.loading.active()) {
        this.timer ??= setTimeout(() => {
          this.visible.set(true);
          this.timer = null;
        }, SHOW_DELAY);
      } else {
        if (this.timer !== null) {
          clearTimeout(this.timer);
          this.timer = null;
        }
        this.visible.set(false);
      }
    });
  }
}
