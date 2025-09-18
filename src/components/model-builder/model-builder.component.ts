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
  modelUpdated = output<Model>();

  modelName = signal('');
  fields = signal<Field[]>([]);
  newFieldName = signal('');
  newFieldType = signal<'string' | 'number' | 'boolean'>('string');
  
  showForm = signal(false);
  editingModelId = signal<number | null>(null);

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
  
  startAddNewModel() {
    this.resetForm();
    this.showForm.set(true);
  }

  cancelForm() {
    this.resetForm();
    this.showForm.set(false);
  }

  startEditing(model: Model) {
    this.editingModelId.set(model.id);
    this.modelName.set(model.name);
    this.fields.set([...model.fields]);
    this.showForm.set(true);
  }

  saveModel() {
    const name = this.modelName().trim();
    if (name && this.fields().length > 0) {
      const modelData: Model = {
        id: this.editingModelId() ?? Date.now(),
        name,
        fields: this.fields()
      };

      if (this.editingModelId()) {
        this.modelUpdated.emit(modelData);
      } else {
        this.modelAdded.emit(modelData);
      }
      this.cancelForm();
    }
  }

  resetForm() {
    this.modelName.set('');
    this.fields.set([]);
    this.newFieldName.set('');
    this.newFieldType.set('string');
    this.editingModelId.set(null);
  }

  getFieldNames(fields: Field[]): string {
    return fields.map(f => f.name).join(', ');
  }
}
