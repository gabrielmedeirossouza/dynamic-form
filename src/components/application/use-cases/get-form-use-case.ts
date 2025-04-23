import { Inject, Injectable } from "../../base/di";
import { FormRepository } from "../../domain/form/form-repository";
import { MetadataRepository } from "../../domain/form/metadata-repository";
import { FormMapper } from "../mappers/form-mapper";

@Injectable("getFormUseCase")
export class GetFormUseCase {
  @Inject private formRepository: FormRepository;
  @Inject private metadataRepository: MetadataRepository;

  public execute(formId: string) {
    const form = this.formRepository.get(formId);
    const metadataList = this.metadataRepository.list(form.metadataIds);

    return FormMapper.map(form, metadataList);
  }
}
