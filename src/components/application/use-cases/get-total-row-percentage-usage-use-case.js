import { MetadataRepositoryRegistry } from "../metadata-repository-registry";

export class GetTotalRowPercentageUsageUseCase {
  execute(formId, templateId, rowId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const template = form.getTemplateById(templateId)
    const row = template.getRowById(rowId)
    const totalUsage = row.getTotalRowPercentageUsage()

    return totalUsage
  }
}