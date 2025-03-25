import { MetadataRepositoryRegistry } from "../metadata-repository-registry";

export class CheckIsValidResizePercentageColumnUseCase {
  execute(formId, templateId, rowId, columnId, value) {
    // TODO - jogar a responsabilidade de verificar se é valido ou não para o form. Evitar vazamento de domínio.
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const template = form.getTemplateById(templateId)
    const row = template.getRowById(rowId)
    const isValid = row.checkIsValidResizePercentageColumn(columnId, value)

    return isValid
  }
}