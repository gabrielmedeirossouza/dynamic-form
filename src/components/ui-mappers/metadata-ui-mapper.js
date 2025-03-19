import { PresentationUiMapper } from "./presentation-ui-mapper";
import { ValidationUiMapper } from "./validation-ui-mapper";

export class MetadataUiMapper {
  static map(metadata, each = false) {
    if (each) return metadata.map(data => MetadataUiMapper.map(data))

    return {
      id: metadata.id,
      label: metadata.label,
      slug: metadata.slug,
      type: metadata.type,
      showOnPortal: metadata.showOnPortal,
      sensitiveData: metadata.sensitiveData,
      active: metadata.active,
      validation: ValidationUiMapper.map(metadata.validation),
      presentation: PresentationUiMapper.map(metadata.presentation)
    }
  }
}