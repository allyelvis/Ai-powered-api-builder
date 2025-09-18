import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';

@Component({
  selector: 'app-code-viewer',
  templateUrl: './code-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeViewerComponent {
  code = input.required<string>();
  isLoading = input.required<boolean>();
  
  copyStatus = signal<'idle' | 'copied'>('idle');

  copyToClipboard() {
    navigator.clipboard.writeText(this.code()).then(() => {
      this.copyStatus.set('copied');
      setTimeout(() => this.copyStatus.set('idle'), 2000);
    });
  }
}
