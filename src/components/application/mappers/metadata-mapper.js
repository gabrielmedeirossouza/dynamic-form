import { Metadata } from "../../domain/metadata/metadata";
import { PresentationMapper } from "./presentation-mapper";
import { ValidationMapper } from "./validation-mapper";

export class MetadataMapper {
  static map(metadata, each = false) {
    if (each) return metadata.map(data => MetadataMapper.map(data))

    return {
      id: metadata.id,
      label: metadata.label,
      slug: metadata.slug,
      type: metadata.type,
      showOnPortal: metadata.showOnPortal,
      sensitiveData: metadata.sensitiveData,
      active: metadata.active,
      validation: ValidationMapper.map(metadata.validation),
      presentation: PresentationMapper.map(metadata.presentation)
    }
  }

  static from(metadata, each = false) {
    if (each) return metadata.map(data => MetadataMapper.from(data))

    return new Metadata({
      id: metadata.id,
      label: metadata.label,
      slug: metadata.slug,
      type: metadata.type,
      showOnPortal: metadata.showOnPortal,
      sensitiveData: metadata.sensitiveData,
      active: metadata.active,
      presentation: PresentationMapper.from(metadata.presentation),
      validation: ValidationMapper.from(metadata.validation)
    })
  }
}