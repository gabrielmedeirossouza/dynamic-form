import { ref, set } from "vue";
import { fakeForm } from "./fake-user-profile-gateway";

export class FormPresentationModel {
  form = ref(fakeForm)

  addTemplate() {
    this.form.addTemplate()
    this.#updateReactivity()
  }

  #updateReactivity() {
    set(this.form, "currentTemplate", this.form.currentTemplate)
    // set(this.form, "isFormResponsive", this.form.isFormResponsive)
    set(this.form, "metadataList", this.form.metadataList)
    // set(this.form, "minimumBreakpoint", this.form.minimumBreakpoint)
    set(this.form, "templates", this.form.templates)
  }
}