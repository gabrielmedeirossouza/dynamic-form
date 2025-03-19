export class PresentationUiMapper {
  static map(presentation, each = false) {
    if (each) return presentation.map(data => PresentationUiMapper.map(data))

    if (!presentation) return;

    return {
      placeholder: presentation.placeholder,
      helperText: presentation.helperText,
      warningMessage: presentation.warningMessage
    }
  }
}