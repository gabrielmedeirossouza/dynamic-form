export class Form {
  #id
  #metadataIds
  #templates

  constructor(id, metadataIds, templates) {
    this.#id = id
    this.#metadataIds = metadataIds
    this.#setTemplates(templates)
  }

  get id() {
    return this.#id
  }

  get metadataIds() {
    return this.#metadataIds
  }

  get templates() {
    return this.#templates
  }

  get mainTemplate() {
    const template = this.#templates.find(t => t.main)

    if (!template) throw new Error("There is no main template.")

    return template
  }

  get minimumFinalBreakpoint() {
    let breakpoint = {}

    for (const template of this.templates) {
      if (template.draft) continue

      if (!breakpoint.templateId) {
        breakpoint.templateId = template.id
        breakpoint.rowId = template.breakpoint.rowId
        breakpoint.value = template.breakpoint.value
        continue
      }

      if (template.breakpoint.value < breakpoint.value) {
        breakpoint.templateId = template.id
        breakpoint.rowId = template.breakpoint.rowId
        breakpoint.value = template.breakpoint.value
      }
    }

    return breakpoint
  }

  get minimumBreakpoint() {
    let breakpoint = {}

    for (const template of this.templates) {
      if (!breakpoint.templateId) {
        breakpoint.templateId = template.id
        breakpoint.rowId = template.breakpoint.rowId
        breakpoint.value = template.breakpoint.value
        continue
      }

      if (template.breakpoint.value < breakpoint.value) {
        breakpoint.templateId = template.id
        breakpoint.rowId = template.breakpoint.rowId
        breakpoint.value = template.breakpoint.value
      }
    }

    return breakpoint
  }

  get isFormResponsive() {
    const MIN_MOBILE_SCREEN_WIDTH = 360

    return this.minimumBreakpoint.value <= MIN_MOBILE_SCREEN_WIDTH
  }

  get existsDraftTemplate() {
    return this.#templates.some(t => t.draft)
  }

  get isValidDraftTemplate() {
    const template = this.#templates.find(t => t.draft)
    if (!template) return true

    return template.breakpoint.value < this.minimumFinalBreakpoint.value
  }

  addDraftTemplate(template) {
    if (template.draft === false) throw new Error("Template must be a draft.")

    for (const template of this.#templates) {
      template.draft = false
    }

    this.#templates.push(template)
    this.#sortTemplates()
  }

  isValidTemplate(templateId) {
    if (!this.#templates.length) return true

    const template = this.getTemplateById(templateId)

    return template.breakpoint.value < this.minimumBreakpoint.value
  }

  moveTemplateColumn(templateId, columnId, position, targetColumnId) {
    const template = this.getTemplateById(templateId)

    template.moveColumn(columnId, position, targetColumnId)
    this.#removeTemplatesWithBreakpointLessThanTemplateId(templateId)
  }

  moveTemplateColumnToNewRow(templateId, columnId, rowPosition, targetRowId) {
    const template = this.getTemplateById(templateId)

    template.moveColumnToNewRow(columnId, rowPosition, targetRowId)
    this.#removeTemplatesWithBreakpointLessThanTemplateId(templateId)
    this.#sortTemplates()
  }

  changeColumnType(templateId, columnId, type) {
    const template = this.getTemplateById(templateId)
    template.changeColumnType(columnId, type)
    this.#removeTemplatesWithBreakpointLessThanTemplateId(templateId)
  }

  resizeColumn(templateId, columnId, value, min) {
    const template = this.getTemplateById(templateId)
    template.resizeColumn(columnId, value, min)
    this.#removeTemplatesWithBreakpointLessThanTemplateId(templateId)
  }

  removeTemplate(templateId) {
    const template = this.getTemplateById(templateId)
    if (template.main) throw new Error(`Cannot exclude a main template.`)

    this.#removeTemplatesWithBreakpointLessThanTemplateId(templateId)
    this.#templates = this.#templates.filter(t => t.id !== templateId)
    this.#sortTemplates()
  }

  getTemplateById(templateId) {
    const template = this.#templates.find(t => t.id === templateId)
    if (!template) throw new Error(`Template with id ${templateId} does not exists on form with id ${this.#id}.`)

    return template
  }

  getColumnById(templateId, columnId) {
    const template = this.getTemplateById(templateId)
    return template.getColumnById(columnId)
  }

  getClosestTemplate(templateId, size) {
    const templateIndex = this.#getTemplateIndexById(templateId)

    if (size === "smaller") {
      if (templateIndex === this.#templates.length - 1) return

      return this.#templates[templateIndex + 1]
    }

    if (templateIndex === 0) return

    return this.#templates[templateIndex - 1]
  }

  #getTemplateIndexById(templateId) {
    const templateIndex = this.#templates.findIndex(t => t.id === templateId)
    if (templateIndex === -1) throw new Error(`Template with id ${templateId} does not exists on form with id ${this.#id}.`)

    return templateIndex
  }

  #removeTemplatesWithBreakpointLessThanTemplateId(templateId) {
    const template = this.getTemplateById(templateId)

    const newTemplates = this.#templates.filter(t => (t.breakpoint.value >= template.breakpoint.value) || template.draft)

    this.#templates = newTemplates
  }

  #setTemplates(templates) {
    const mainTemplates = templates.filter(t => t.main)

    if (!mainTemplates.length) throw new Error("At least one template must be the main one.")
    if (mainTemplates.length >= 2) throw new Error("There should be only 1 main template.")

    this.#templates = templates
  }

  #sortTemplates() {
    this.#templates.sort((a, b) => b.breakpoint.value - a.breakpoint.value)
  }
}