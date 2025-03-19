import { TemplateMapper } from "../application-mappers/template-mapper";
import { MetadataRepositoryRegistry } from "../repositories/metadata-repository-registry";

export class GetTemplateByIdUseCase {
  execute(formId, templateId) {
    const form = MetadataRepositoryRegistry.formRepository.getById(formId)
    const template = form.getTemplateById(templateId)

    return TemplateMapper.map(template)
  }
}