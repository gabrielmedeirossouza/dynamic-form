import { reactive, set } from "vue"
import { FormUiMapper } from "../mappers/form-ui-mapper"
import { TemplateUiMapper } from "../mappers/template-ui-mapper"

export class FormContext {
  currentForm = reactive({})
  currentTemplate = reactive({})

  #getFormUseCase
  #getTemplateUseCase
  #getFormMetadataListUseCase

  constructor(getFormUseCase, getTemplateUseCase, getFormMetadataListUseCase) {
    this.#getFormUseCase = getFormUseCase
    this.#getTemplateUseCase = getTemplateUseCase
    this.#getFormMetadataListUseCase = getFormMetadataListUseCase
  }

  changeCurrentTemplate(template) {
    set(this, "currentTemplate", template)
  }

  update(formId) {
    const form = this.#getFormUseCase.execute(formId || this.currentForm.id)
    const metadataList = this.#getFormMetadataListUseCase.execute(formId || this.currentForm.id)
    const template = this.#getTemplateUseCase.execute(formId || this.currentForm.id, this.currentTemplate?.id || form.mainTemplate.id)

    set(this, "currentForm", FormUiMapper.map(form, metadataList))
    set(this, "currentTemplate", TemplateUiMapper.map(template, metadataList))
  }
}