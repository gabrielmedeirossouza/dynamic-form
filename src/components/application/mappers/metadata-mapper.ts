import { Metadata } from "../../domain/metadata/metadata";
import { PresentationMapper } from "./presentation-mapper";
import { ValidationMapper } from "./validation-mapper";

export class MetadataMapper {
  public static map(metadata: Metadata) {
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
    };
  }
}
