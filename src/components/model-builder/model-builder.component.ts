import { Component, ChangeDetectionStrategy, signal, input, output } from '@angular/core';
import { Field, Model } from '../../interfaces';

@Component({
  selector: 'app-model-builder',
  templateUrl: './model-builder.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModelBuilderComponent {
  models = input.required<Model[]>();
  modelAdded = output<Model>();
  modelRemoved = output<number>();

  modelName = signal('');
  fields = signal<Field[]>([]);
  newFieldName = signal('');
  newFieldType = signal<'string' | 'number' | 'boolean'>('string');
  
  showForm = signal(false);

  addField() {
    const name = this.newFieldName().trim();
    if (name && !this.fields().some(f => f.name === name)) {
      this.fields.update(currentFields => [...currentFields, { name, type: this.newFieldType() }]);
      this.newFieldName.set('');
    }
  }

  removeField(fieldName: string) {
    this.fields.update(currentFields => currentFields.filter(f => f.name !== fieldName));
  }
  
  toggleForm() {
    this.showForm.update(v => !v);
    if (!this.showForm()) {
      this.resetForm();
    }
  }

  saveModel() {
    const name = this.modelName().trim();
    if (name && this.fields().length > 0) {
      this.modelAdded.emit({
        id: Date.now(),
        name,
        fields: this.fields()
      });
      this.resetForm();
      this.showForm.set(false);
    }
  }

  resetForm() {
    this.modelName.set('');
    this.fields.set([]);
    this.newFieldName.set('');
    this.newFieldType.set('string');
  }

  getFieldNames(fields: Field[]): string {
    return fields.map(f => f.name).join(', ');
  }
}