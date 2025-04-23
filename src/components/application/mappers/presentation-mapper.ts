import { Presentation } from "../../domain/metadata/presentation";

export class PresentationMapper {
  public static map(presentation?: Presentation) {
    if (!presentation) return;

    return {
      placeholder: presentation.placeholder,
      helperText: presentation.helperText,
      warningMessage: presentation.warningMessage
    };
  }
}
