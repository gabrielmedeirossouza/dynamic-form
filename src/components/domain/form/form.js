export class Form {
  #id
  #metadataIds
  #templates

  constructor(id, metadataIds, templates) {
    this.#id = id
    this.#metadataIds = metadataIds
    this.#templates = templates
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
    const biggestTemplateByBreakpoint = this.templates.reduce((prev, current, index) => {
      if (index === 0) return current

      return prev.breakpoint > current.breakpoint ? prev : current
    })

    return biggestTemplateByBreakpoint
  }

  get minimumBreakpoint() {
    const breakpoints = this.templates.map(template => template.breakpoint)
    return Math.min(...breakpoints)
  }

  get isFormResponsive() {
    const MIN_MOBILE_SCREEN_WIDTH = 320
    return this.minimumBreakpoint <= MIN_MOBILE_SCREEN_WIDTH
  }

  addTemplate(template) {
    const isTemplateValid = this.isTemplateValid(template.id)
    if (!isTemplateValid && !template.draft) return

    this.templates.push(template)
  }

  addDraftTemplate(template) {
    if (template.draft === false) throw new Error(`Template with id ${template.id} is not a draft template.`)
    this.templates.push(template)
  }

  isTemplateValid(templateId) {
    if (!this.#templates.length) return true

    const template = this.getTemplateById(templateId)

    return template.breakpoint < this.minimumBreakpoint
  }

  moveTemplateColumn(templateId, columnId, position, targetColumnId) {
    const template = this.getTemplateById(templateId)

    template.moveColumn(columnId, position, targetColumnId)
  }

  moveTemplateColumnToNewRow(templateId, columnId, rowPosition, targetRowId) {
    const template = this.getTemplateById(templateId)

    template.moveColumnToNewRow(columnId, rowPosition, targetRowId)
  }

  changeColumnType(templateId, columnId, type) {
    const template = this.getTemplateById(templateId)
    template.changeColumnType(columnId, type)
  }

  resizeColumn(templateId, columnId, value, min) {
    const template = this.getTemplateById(templateId)
    template.resizeColumn(columnId, value, min)
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
}