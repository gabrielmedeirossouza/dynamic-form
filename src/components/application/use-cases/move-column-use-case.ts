import { Inject, Injectable } from "../../base/di";
import { FormRepository } from "../../domain/form/form-repository";

@Injectable("moveColumnUseCase")
export class MoveColumnUseCase {
  @Inject private formRepository: FormRepository;

  public execute(formId: string, templateId: string, columnId: string, position: string, targetId: string) {
    const form = this.formRepository.get(formId);
    form.moveColumn(templateId, columnId, position, targetId);
  }
}
