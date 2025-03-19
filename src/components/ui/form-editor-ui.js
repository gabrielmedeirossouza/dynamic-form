import { reactive, set } from "vue";
import { MetadataRepositoryRegistry } from "../repositories/metadata-repository-registry";
import { InMemoryFormRepository } from "../repositories/in-memory-form-repository";
import { InMemoryMetadataRepository } from "../repositories/in-memory-metadata-repository";
import { CheckTemplateIsValidUseCase } from "../use-cases/check-template-is-valid-use-case";
import { CreateDraftTemplateUseCase } from "../use-cases/create-draft-template-use-case";
import { GetFormMetadataListUseCase } from "../use-cases/get-form-metadata-list-use-case";
import { GetFormUseCase } from "../use-cases/get-form-use-case";
import { MoveTemplateColumnToNewRowUseCase } from "../use-cases/move-template-column-to-new-row-use-case";
import { MoveTemplateColumnUseCase } from "../use-cases/move-template-column-use-case";
import { SaveDraftTemplateUseCase } from "../use-cases/save-draft-template-use-case";
import { FormUiMapper } from "../ui-mappers/form-ui-mapper";
import { ResizeColumnUseCase } from "../use-cases/resize-column-use-case";
import { ChangeColumnTypeUseCase } from "../use-cases/change-column-type-use-case";
import { TemplateUiMapper } from "../ui-mappers/template-ui-mapper";
import { GetTemplateByIdUseCase } from "../use-cases/get-template-by-id-use-case";

export class FormEditorUI {
  $form = reactive({})

  #form
  #metadataList

  #loadFormAndMetadataListUseCase
  #checkTemplateIsValidUseCase
  #createDraftTemplateUseCase
  #getFormMetadataListUseCase
  #getFormUseCase
  #moveTemplateColumnToNewRowUseCase
  #moveTemplateColumnUseCase
  #saveDraftTemplateUseCase
  #resizeColumnUseCase
  #changeColumnTypeUseCase
  #getTemplateByIdUseCase

  constructor(loadFormAndMetadataListUseCase) {
    MetadataRepositoryRegistry.formRepository = new InMemoryFormRepository()
    MetadataRepositoryRegistry.metadataRepository = new InMemoryMetadataRepository()

    this.#loadFormAndMetadataListUseCase = loadFormAndMetadataListUseCase
    this.#checkTemplateIsValidUseCase = new CheckTemplateIsValidUseCase()
    this.#createDraftTemplateUseCase = new CreateDraftTemplateUseCase()
    this.#getFormMetadataListUseCase = new GetFormMetadataListUseCase()
    this.#getFormUseCase = new GetFormUseCase()
    this.#moveTemplateColumnToNewRowUseCase = new MoveTemplateColumnToNewRowUseCase()
    this.#moveTemplateColumnUseCase = new MoveTemplateColumnUseCase()
    this.#saveDraftTemplateUseCase = new SaveDraftTemplateUseCase()
    this.#resizeColumnUseCase = new ResizeColumnUseCase()
    this.#changeColumnTypeUseCase = new ChangeColumnTypeUseCase()
    this.#getTemplateByIdUseCase = new GetTemplateByIdUseCase()
  }

  async loadFormAndMetadataList() {
    const formId = await this.#loadFormAndMetadataListUseCase.execute()
    this.#updateForm(formId)
    this.#updateMetadataList(formId)
    this.#renderForm()
  }

  checkTemplateIsValid(templateId) {
    const isValid = this.#checkTemplateIsValidUseCase.execute(this.#form.id, templateId)
    return isValid
  }

  createDraftTemplate(templateId) {
    const template = this.#createDraftTemplateUseCase.execute(this.#form.id, templateId)
    this.#updateForm()
    this.#renderForm()

    return TemplateUiMapper.map(template, this.#metadataList)
  }

  saveDraftTemplate(templateId) {
    const success = this.#saveDraftTemplateUseCase.execute(this.#form.id, templateId)
    if (!success) return false

    this.#updateForm()
    this.#renderForm()

    return true
  }

  moveTemplateColumn(templateId, metadataId, position, targetId) {
    this.#moveTemplateColumnUseCase.execute(this.#form.id, templateId, metadataId, position, targetId)
    this.#updateForm()
    this.#renderForm()
  }

  moveTemplateColumnToNewRow(templateId, metadataId, rowPosition, targetRowId) {
    this.#moveTemplateColumnToNewRowUseCase.execute(this.#form.id, templateId, metadataId, rowPosition, targetRowId)
    this.#updateForm()
    this.#renderForm()
  }

  resizeColumn(templateId, columnId, value, min) {
    this.#resizeColumnUseCase.execute(this.#form.id, templateId, columnId, value, min)
    this.#updateForm()
    this.#renderForm()
  }

  changeColumnType(templateId, columnId, type) {
    this.#changeColumnTypeUseCase.execute(this.#form.id, templateId, columnId, type)
    this.#updateForm()
    this.#renderForm()
  }

  getTemplateById(templateId) {
    const template = this.#getTemplateByIdUseCase.execute(this.#form.id, templateId)
    return TemplateUiMapper.map(template)
  }

  #updateForm(formId) {
    this.#form = this.#getFormUseCase.execute(formId || this.#form.id)
  }

  #updateMetadataList(formId) {
    this.#metadataList = this.#getFormMetadataListUseCase.execute(formId || this.#form.id)
  }

  #renderForm() {
    const mappedForm = FormUiMapper.map(this.#form, this.#metadataList)
    set(this, "$form", mappedForm)
  }
}
