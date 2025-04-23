import { Inject, Injectable } from "../../base/di";
import { FormRepository } from "../../domain/form/form-repository";

@Injectable("getTemplateUseCase")
export class GetTemplateUseCase {
  @Inject private formRepository: FormRepository;

  public execute(formId: string, templateId: string) {
    const form = this.formRepository.get(formId);

    return form.getTemplateById(templateId);
  }
}
