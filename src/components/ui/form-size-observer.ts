import { ref } from "vue";

export class FormSizeObserver {
  private observer?: ResizeObserver;

  public rowWidth = ref(0);

  public setRowElement(rowElement: HTMLElement) {
    this.observer = new ResizeObserver(() => {
      this.rowWidth.value = rowElement.getBoundingClientRect().width;
    });

    this.observer.observe(rowElement);
  }

  public disconnect() {
    this.observer?.disconnect();
  }
}
