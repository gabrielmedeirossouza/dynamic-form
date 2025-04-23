import { Template } from "./template";

export class Form {
  constructor(
    public id: string,
    public metadataIds: string[],
    public mainTemplate: Template,
    public templates: Template[]
  ) {}

  public moveColumn(templateId: string, columnId: string, position: string, targetColumnId: string) {
    const template = this.getTemplateById(templateId);

    template.moveColumn(columnId, position, targetColumnId);
    this.removeTemplatesWithBreakpointLessThanTemplateId(templateId);
  }

  public moveColumnToNewRow(templateId: string, columnId: string, rowPosition: string, targetRowId: string) {
    const template = this.getTemplateById(templateId);

    template.moveColumnToNewRow(columnId, rowPosition, targetRowId);
    this.removeTemplatesWithBreakpointLessThanTemplateId(templateId);
    this.sortTemplates();
  }

  public resizeColumn(templateId: string, columnId: string, value: number) {
    const template = this.getTemplateById(templateId);
    template.resizeColumn(columnId, value);
    this.removeTemplatesWithBreakpointLessThanTemplateId(templateId);
  }

  public getTemplateById(templateId: string) {
    const template = this.templates.find(t => t.id === templateId);
    if (!template) throw new Error(`Template with id ${templateId} does not exists on form with id ${this.id}.`);

    return template;
  }

  // TODO
  private removeTemplatesWithBreakpointLessThanTemplateId(templateId: string) {
    const template = this.getTemplateById(templateId);

    const newTemplates = this.templates.filter(t => t.breakpoint >= template.breakpoint);

    this.templates = newTemplates;
  }

  private sortTemplates() {
    this.templates.sort((a, b) => b.breakpoint - a.breakpoint);
  }
}
