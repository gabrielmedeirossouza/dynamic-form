import { set } from "vue";
import { Inject, Injectable } from "../../base/di";
import { GetFormUseCase } from "../../application/use-cases/get-form-use-case";
import { FormDto } from "../../application/mappers/form-mapper";
import { TemplateDto } from "../../application/mappers/template-mapper";
import { GetTemplateUseCase } from "../../application/use-cases/get-template-use-case";

@Injectable("formLayoutService")
export class FormContext {
  @Inject private getFormUseCase: GetFormUseCase;
  @Inject private getTemplateUseCase: GetTemplateUseCase;

  public currentForm?: FormDto;
  public currentTemplate?: TemplateDto;

  public update(params: { formId?: string, templateId?: string }) {
    const formId = params.formId || this.currentForm?.id;
    if (!formId) throw new Error("Form id is not provided.");

    const form = this.getFormUseCase.execute(formId);
    const template = this.getTemplateUseCase.execute(formId, params.templateId || this.currentTemplate?.id || form.mainTemplate.id);

    set(this, "currentForm", form);
    set(this, "currentTemplate", template);
  }
}
