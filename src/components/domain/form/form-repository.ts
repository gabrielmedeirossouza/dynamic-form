import { Form } from "./form";

export interface FormRepository {
  get(formId: string): Form
  add(form: Form): void
  upsert(form: Form): void
}
