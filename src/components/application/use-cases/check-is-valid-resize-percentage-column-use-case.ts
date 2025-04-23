import { Inject, Injectable } from "../../base/di";
import { FormRepository } from "../../domain/form/form-repository";

@Injectable("checkIsValidResizePercentageColumnUseCase")
export class CheckIsValidResizePercentageColumnUseCase {
  @Inject private formRepository: FormRepository;

  public execute(formId: string, templateId: string, rowId: string, columnId: string, value: number) {
    const form = this.formRepository.get(formId);
    const template = form.getTemplateById(templateId);
    const row = template.getRowById(rowId);
    const isValid = row.checkIsValidResizePercentageColumn(columnId, value);

    return isValid;
  }
}
