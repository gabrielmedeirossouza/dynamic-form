export class Metadata {
  constructor(id, label, slug, type, showOnPortal, sensitiveData, active, validation, presentation) {
    this.id = id;
    this.label = label;
    this.slug = slug;
    this.type = type;
    this.showOnPortal = showOnPortal;
    this.sensitiveData = sensitiveData;
    this.active = active;
    this.validation = validation;
    this.presentation = presentation;
  }
}