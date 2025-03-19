import { Presentation } from "../domain/metadata/presentation";

export class PresentationMapper {
  static map(presentation, each = false) {
    if (each) return presentation.map(data => PresentationMapper.map(data))

    if (!presentation) return;

    return {
      placeholder: presentation.placeholder,
      helperText: presentation.helperText,
      warningMessage: presentation.warningMessage
    }
  }

  static from(presentation, each = false) {
    if (each) return presentation.map(data => PresentationMapper.from(data))

    if (!presentation) return;

    return new Presentation({
      placeholder: presentation.placeholder,
      helperText: presentation.helperText,
      warningMessage: presentation.warningMessage
    })
  }
}