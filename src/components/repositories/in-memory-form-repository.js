import { FormMapper } from "../application-mappers/form-mapper"

export class InMemoryFormRepository {
  static #mappedForms = []

  getById(formId) {
    const mappedForm = InMemoryFormRepository.#mappedForms.find(f => f.id === formId)
    if (!mappedForm) throw new Error(`Form with id ${formId} does not exists.`)

    return FormMapper.from(mappedForm)
  }

  add(form) {
    const alreadyExists = InMemoryFormRepository.#mappedForms.findIndex(f => f.id === form.id)
    if (alreadyExists !== -1) throw new Error(`Form with id ${form.id} already exists.`)

    InMemoryFormRepository.#mappedForms.push(FormMapper.map(form))
  }

  update(form) {
    const formIndex = InMemoryFormRepository.#mappedForms.findIndex(f => f.id === form.id)
    if (formIndex === -1) throw new Error(`Form with id ${form.id} does not exists.`)


    InMemoryFormRepository.#mappedForms.splice(formIndex, 1, FormMapper.map(form))
  }

  load(forms) {
    for (const form of forms) {
      const formIndex = InMemoryFormRepository.#mappedForms.findIndex(f => f.id === form.id)
      if (formIndex !== -1) {
        InMemoryFormRepository.#mappedForms.splice(formIndex, 1, FormMapper.map(form))
        continue
      }

      this.add(form)
    }
  }
}