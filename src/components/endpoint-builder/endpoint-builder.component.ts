import { Component, ChangeDetectionStrategy, signal, input, output } from '@angular/core';
import { Endpoint } from '../../interfaces';

@Component({
  selector: 'app-endpoint-builder',
  templateUrl: './endpoint-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndpointBuilderComponent {
  endpoints = input.required<Endpoint[]>();
  endpointAdded = output<Endpoint>();
  endpointRemoved = output<number>();

  path = signal('');
  method = signal<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  description = signal('');

  showForm = signal(false);

  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  saveEndpoint() {
    if (this.path().trim() && this.description().trim()) {
      this.endpointAdded.emit({
        id: Date.now(),
        path: this.path(),
        method: this.method(),
        description: this.description(),
      });
      this.resetForm();
      this.showForm.set(false);
    }
  }

  resetForm() {
    this.path.set('');
    this.method.set('GET');
    this.description.set('');
  }
}
