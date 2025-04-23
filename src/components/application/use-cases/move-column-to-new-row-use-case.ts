import { Inject, Injectable } from "../../base/di";
import { FormRepository } from "../../domain/form/form-repository";

@Injectable("moveColumnToNewRowUseCase")
export class MoveColumnToNewRowUseCase {
  @Inject private formRepository: FormRepository;

  public execute(formId: string, templateId: string, columnId: string, rowPosition: string, targetRowId: string) {
    const form = this.formRepository.get(formId);
    form.moveColumnToNewRow(templateId, columnId, rowPosition, targetRowId);
  }
}
