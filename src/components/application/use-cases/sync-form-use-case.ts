import { Inject, Injectable } from "../../base/di";
import { FormRepository } from "../../domain/form/form-repository";
import { MetadataRepository } from "../../domain/form/metadata-repository";
import { FormGateway } from "../form-gateway";

@Injectable("syncFormUseCase")
export class SyncFormUseCase {
  @Inject private formGateway: FormGateway;
  @Inject private formRepository: FormRepository;
  @Inject private metadataRepository: MetadataRepository;

  public async execute(formId: string) {
    const [form, metadataList] = await this.formGateway.fetch(formId);

    this.formRepository.upsert(form);
    this.metadataRepository.populate(metadataList);
  }
}
