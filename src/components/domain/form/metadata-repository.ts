import { Metadata } from "../metadata/metadata";

export interface MetadataRepository {
  get(metadataId: string): Metadata
  list(metadataIds: string[]): Metadata[]
  add(metadata: Metadata): void
  populate(metadataList: Metadata[]): void
}
