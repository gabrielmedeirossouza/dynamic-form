import { TemplateMapper } from "../mappers/template-mapper";
import { MetadataRepositoryRegistry } from "../metadata-repository-registry";

export class GetClosestTemplateUseCase {
  execute(formId, templateId, size) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const template = form.getClosestTemplate(templateId, size)

    if (!template) return

    return TemplateMapper.map(template)
  }
}