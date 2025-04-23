import { Form } from "../domain/form/form";
import { Metadata } from "../domain/metadata/metadata";

export interface FormGateway {
  fetch(formId: string): Promise<[form: Form, metadataList: Metadata[]]>
}
