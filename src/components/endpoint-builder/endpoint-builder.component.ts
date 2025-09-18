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
  endpointUpdated = output<Endpoint>();

  path = signal('');
  method = signal<'GET' | 'POST' | 'PUT' | 'DELETE'>('GET');
  description = signal('');

  showForm = signal(false);
  editingEndpointId = signal<number | null>(null);

  startAddNewEndpoint() {
    this.resetForm();
    this.showForm.set(true);
  }

  cancelForm() {
    this.resetForm();
    this.showForm.set(false);
  }

  startEditing(endpoint: Endpoint) {
    this.editingEndpointId.set(endpoint.id);
    this.path.set(endpoint.path);
    this.method.set(endpoint.method);
    this.description.set(endpoint.description);
    this.showForm.set(true);
  }

  saveEndpoint() {
    if (this.path().trim() && this.description().trim()) {
      const endpointData: Endpoint = {
        id: this.editingEndpointId() ?? Date.now(),
        path: this.path(),
        method: this.method(),
        description: this.description(),
      };

      if (this.editingEndpointId()) {
        this.endpointUpdated.emit(endpointData);
      } else {
        this.endpointAdded.emit(endpointData);
      }
      
      this.cancelForm();
    }
  }

  resetForm() {
    this.path.set('');
    this.method.set('GET');
    this.description.set('');
    this.editingEndpointId.set(null);
  }
}
