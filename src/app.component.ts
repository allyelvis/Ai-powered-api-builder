import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Model, Endpoint } from './interfaces';
import { GeminiService } from './gemini.service';
import { ModelBuilderComponent } from './components/model-builder/model-builder.component';
import { EndpointBuilderComponent } from './components/endpoint-builder/endpoint-builder.component';
import { CodeViewerComponent } from './components/code-viewer/code-viewer.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ModelBuilderComponent, EndpointBuilderComponent, CodeViewerComponent],
})
export class AppComponent {
  models = signal<Model[]>([]);
  endpoints = signal<Endpoint[]>([]);
  generatedCode = signal<string>('');
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  // Generation options
  useDatabase = signal<boolean>(false);
  useAuth = signal<boolean>(false);

  constructor(private geminiService: GeminiService) {}

  addModel(model: Model) {
    this.models.update(currentModels => [...currentModels, model]);
  }

  updateModel(updatedModel: Model) {
    this.models.update(currentModels =>
      currentModels.map(model => (model.id === updatedModel.id ? updatedModel : model))
    );
  }

  addEndpoint(endpoint: Endpoint) {
    this.endpoints.update(currentEndpoints => [...currentEndpoints, endpoint]);
  }
  
  updateEndpoint(updatedEndpoint: Endpoint) {
    this.endpoints.update(currentEndpoints =>
      currentEndpoints.map(endpoint => (endpoint.id === updatedEndpoint.id ? updatedEndpoint : endpoint))
    );
  }

  removeModel(id: number) {
    this.models.update(models => models.filter(m => m.id !== id));
  }

  removeEndpoint(id: number) {
    this.endpoints.update(endpoints => endpoints.filter(e => e.id !== id));
  }

  async handleGenerateCode() {
    this.isLoading.set(true);
    this.error.set(null);
    this.generatedCode.set('');

    try {
      const options = {
        useDatabase: this.useDatabase(),
        useAuth: this.useAuth(),
      };
      const code = await this.geminiService.generateServerCode(this.models(), this.endpoints(), options);
      // Clean up the response from Gemini to ensure it's just code
      const cleanedCode = code.replace(/^```javascript\n|```$/g, '').trim();
      this.generatedCode.set(cleanedCode);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : String(err));
    } finally {
      this.isLoading.set(false);
    }
  }
}