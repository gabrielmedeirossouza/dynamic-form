import { Inject, Injectable } from "../../base/di";
import { FormRepository } from "../../domain/form/form-repository";

@Injectable("resizeColumnUseCase")
export class ResizeColumnUseCase {
  @Inject private formRepository: FormRepository;

  public execute(formId: string, templateId: string, columnId: string, value: number) {
    const form = this.formRepository.get(formId);
    form.resizeColumn(templateId, columnId, value);
  }
}
