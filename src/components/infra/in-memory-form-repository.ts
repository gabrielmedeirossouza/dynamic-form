import { Injectable } from "../base/di";
import { Form } from "../domain/form/form";
import { FormRepository } from "../domain/form/form-repository";

@Injectable("formRepository")
export class InMemoryFormRepository implements FormRepository {
  private static forms: Form[] = [];

  public get(formId: string): Form {
    const form = InMemoryFormRepository.forms.find(form => form.id === formId);
    if (!form) throw new Error(`Form with id ${formId} does not exists.`);

    return form;
  }

  public add(form: Form): void {
    const alreadyExists = InMemoryFormRepository.forms.findIndex(_form => _form.id === form.id);
    if (alreadyExists !== -1) throw new Error(`Form with id ${form.id} already exists.`);

    InMemoryFormRepository.forms.push(form);
  }

  public upsert(form: Form): void {
    const formRepoIndex = InMemoryFormRepository.forms.findIndex(_form => _form.id === form.id);

    if (formRepoIndex === -1) {
      InMemoryFormRepository.forms.push(form);
    } else {
      InMemoryFormRepository.forms[formRepoIndex] = form;
    }
  }
}
