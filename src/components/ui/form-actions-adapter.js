MetadataRepositoryRegistry.formRepository = new InMemoryFormRepository()
MetadataRepositoryRegistry.metadataRepository = new InMemoryMetadataRepository()

import { TemplateUiMapper } from "./mappers/template-ui-mapper"

export class FormActionsAdapter {
  #formContext
  #loadFormAndMetadataListUseCase
  #checkTemplateIsValidUseCase
  #createDraftTemplateUseCase
  #saveDraftTemplateUseCase
  #changeColumnTypeUseCase
  #moveTemplateColumnUseCase
  #moveTemplateColumnToNewRowUseCase
  #resizeColumnUseCase
  #getTotalRowPercentageUsageUseCase

  constructor(param) {
    this.#formContext = param.formContext
    this.#loadFormAndMetadataListUseCase = param.loadFormAndMetadataListUseCase
    this.#checkTemplateIsValidUseCase = param.checkTemplateIsValidUseCase
    this.#createDraftTemplateUseCase = param.createDraftTemplateUseCase
    this.#saveDraftTemplateUseCase = param.saveDraftTemplateUseCase
    this.#changeColumnTypeUseCase = param.changeColumnTypeUseCase
    this.#moveTemplateColumnUseCase = param.moveTemplateColumnUseCase
    this.#moveTemplateColumnToNewRowUseCase = param.moveTemplateColumnToNewRowUseCase
    this.#resizeColumnUseCase = param.resizeColumnUseCase
    this.#getTotalRowPercentageUsageUseCase = param.getTotalRowPercentageUsageUseCase
  }

  async loadFormAndMetadataList() {
    const formId = await this.#loadFormAndMetadataListUseCase.execute()
    this.#formContext.update(formId)
  }

  checkTemplateIsValid() {
    const isValid = this.#checkTemplateIsValidUseCase.execute(
      this.#formContext.currentForm.id,
      this.#formContext.currentTemplate.id
    )

    return isValid
  }

  createDraftTemplate() {
    const template = this.#createDraftTemplateUseCase.execute(
      this.#formContext.currentForm.id,
      this.#formContext.currentTemplate.id
    )

    this.#formContext.update()
    this.#formContext.changeCurrentTemplate(
      TemplateUiMapper.map(
        template,
        this.#formContext.currentForm.metadataList
      )
    )
  }

  saveDraftTemplate() {
    const success = this.#saveDraftTemplateUseCase.execute(
      this.#formContext.currentForm.id,
      this.#formContext.currentTemplate.id
    )

    if (!success) return false

    this.#formContext.update()

    return true
  }

  changeColumnType(columnId, type) {
    this.#changeColumnTypeUseCase.execute(
      this.#formContext.currentForm.id,
      this.#formContext.currentTemplate.id,
      columnId,
      type
    )

    this.#formContext.update()
  }

  moveTemplateColumnUseCase() {

  }

  moveTemplateColumnToNewRowUseCase() {

  }

  resizeColumnUseCase() {

  }

  getTotalRowPercentageUsageUseCase() {

  }
}
