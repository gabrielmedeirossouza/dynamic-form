import { Injectable } from "../base/di";
import { MetadataRepository } from "../domain/form/metadata-repository";
import { Metadata } from "../domain/metadata/metadata";

@Injectable("metadataRepository")
export class InMemoryMetadataRepository implements MetadataRepository {
  private static metadataList: Metadata[] = [];

  public get(metadataId: string): Metadata {
    const metadata = InMemoryMetadataRepository.metadataList.find(metadata => metadata.id === metadataId);
    if (!metadata) throw new Error(`Metadata with id ${metadataId} does not exists.`);

    return metadata;
  }

  public list(metadataIds: string[]): Metadata[] {
    return metadataIds.map(id => this.get(id));
  }

  public add(metadata: Metadata): void {
    const alreadyExists = InMemoryMetadataRepository.metadataList.findIndex(_metadata => _metadata.id === metadata.id);
    if (alreadyExists !== -1) throw new Error(`Metadata with id ${metadata.id} already exists.`);

    InMemoryMetadataRepository.metadataList.push(metadata);
  }

  public populate(metadataList: Metadata[]): void {
    for (const metadata of metadataList) {
      this.upsert(metadata);
    }
  }

  private upsert(metadata: Metadata): void {
    const metadataRepoIndex = InMemoryMetadataRepository.metadataList.findIndex(_metadata => _metadata.id === metadata.id);

    if (metadataRepoIndex === -1) {
      InMemoryMetadataRepository.metadataList.push(metadata);
    } else {
      InMemoryMetadataRepository.metadataList[metadataRepoIndex] = metadata;
    }
  }
}
