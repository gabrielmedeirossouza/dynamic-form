<script>
import { 
  context,
  dragAndDropEventsAdapter,
  resizingEventsAdapter,
  sizeObserver,
  getClosestTemplateUseCase,
  loadFormAndMetadataListUseCase,
  createDraftTemplateUseCase,
  removeTemplateUseCase,
  getFormUseCase,
  layoutService,
  changeColumnTypeUseCase
} from "./ui/bootstrap";

export default {
  name: "GridMetadataForm",

  data() {
    return {
      context,
      dragAndDropEventsAdapter,
      resizingEventsAdapter,
      isEditing: false
    }
  },

  computed: {
    isLoaded() {
      return Boolean(this.context.currentForm?.id)
    },

    templates() {
      return this.isLoaded ? this.context.currentForm.templates : []
    },

    currentTemplateRows() {
      return this.isLoaded ? this.context.currentTemplate.rows : []
    },

    isDragging() {
      return dragAndDropEventsAdapter.isDragging
    },

    isResizing() {
      return resizingEventsAdapter.isResizing
    },

    showSaveButton() {
      return this.isLoaded && this.isEditing && this.context.currentForm.isFormResponsive
    },

    showCreateDraftTemplateButton() {
      return (
        this.isLoaded &&
        !this.context.currentForm.isFormResponsive &&
        this.context.currentForm.isValidDraftTemplate &&
        this.isEditing
      )
    },

    showRemoveTemplateButton() {
      return this.isLoaded && !this.context.currentTemplate.main
    },

    showEditButton() {
      return this.isLoaded && this.isEditing
    },

    breakpointLine() {
      if (!this.isLoaded) return "0"

      return context.currentTemplate.breakpoint.value + "px"
    },

    templateWidth() {
      if (!this.isLoaded || this.context.currentTemplate.main) return "100%"

      return this.context.currentTemplate.breakpoint.value + "px"
    },

    templateDescription() {
      if (!this.isLoaded) return ""

      if (this.context.currentTemplate.main) {
        if (this.context.currentForm.templates.length === 1) return "Este modelo será usado em todas as resoluções."

        return `Este modelo será usado em todas resoluções maiores que <strong>${this.context.currentTemplate.breakpoint.value}px</strong>.`
      }

      const closestGreaterBreakpoint = getClosestTemplateUseCase.execute(
        this.context.currentForm.id,
        this.context.currentTemplate.id,
        "greater"
      )?.breakpoint.value
      const closestSmallerBreakpoint = getClosestTemplateUseCase.execute(
        this.context.currentForm.id,
        this.context.currentTemplate.id,
        "smaller"
      )?.breakpoint.value

      if (closestGreaterBreakpoint && closestSmallerBreakpoint) {
        return `Este modelo será usado em todas resoluções entre <strong>${closestGreaterBreakpoint}px</strong> e <strong>${this.context.currentTemplate.breakpoint.value}px</strong>.`
      }

      return `Este modelo será usado em todas resoluções menores que <strong>${closestGreaterBreakpoint}px</strong>.`
    },

    templateResolutionWarning() {
      if (!this.isLoaded || this.context.currentForm.isFormResponsive) return ""

      if (this.context.currentTemplate.draft && !this.context.currentForm.isValidDraftTemplate) {
        return `Modifique o modelo atual para uma resolução inferior a <strong>${this.context.currentForm.minimumFinalBreakpoint.value}px</strong>.`
      }

      return `O formulário não está responsivo para resoluções abaixo de <strong>${this.context.currentForm.minimumBreakpoint.value}px</strong>. Você pode ajustar o formulário atual para suportar dispositivos móveis (360px) ou então criar um novo modelo responsivo.`
    }
  },

  created() {
    loadFormAndMetadataListUseCase.execute()
      .then((formId) => {
        this.context.update(formId)

        this.$nextTick(() => {
          sizeObserver.setRowElement(this.$refs.rowContainerRef)
        })
      })
  },

  beforeDestroy() {
    resizingEventsAdapter.clearListeners()
    sizeObserver.disconnect()
  },

  methods: {
    formatColumnValue(column) {
      const fixedValue = Number.isInteger(column.layout.size.value) ? column.layout.size.value : column.layout.size.value.toFixed(2)

      return fixedValue + (column.layout.size.isFixed ? "px" : "%")
    },

    showLastRowTrigger(rowIndex) {
      return rowIndex === this.context.currentTemplate.rows.length - 1
    },

    getColumnWidth(row, column) {
      if (!this.isLoaded) return "0"

      return layoutService.getFieldWidthInUnits(this.context.currentTemplate, row, column) + "px"
    },

    getColumnMinWidth(column) {
      if (column.layout.size.isFixed) return "0"
      
      return column.layout.size.min + "px"
    },

    getTemplateLabel(index) {
      const charCodeStartWithLetterA = 65
      return index === 0 ? "Principal" : `Responsivo ${String.fromCharCode(charCodeStartWithLetterA + index - 1)}`
    },

    createDraftTemplate() {
      const templateId = createDraftTemplateUseCase.execute(
        this.context.currentForm.id,
        this.context.currentTemplate.id
      )

      this.context.useTemplate(templateId)
    },

    removeTemplate() {
      removeTemplateUseCase.execute(
        this.context.currentForm.id,
        this.context.currentTemplate.id
      )

      const form = getFormUseCase.execute(this.context.currentForm.id)
      this.context.useTemplate(form.minimumBreakpoint.templateId)
    },

    selectTemplate(templateId) {
      this.context.useTemplate(templateId)
    },

    changeColumnType(columnId, type) {
      changeColumnTypeUseCase.execute(
        this.context.currentForm.id,
        this.context.currentTemplate.id,
        columnId,
        type
      )

      this.context.update()
    },

    save() {
      // call api
      this.isEditing = false
      this.context.update()
    },

    edit() {
      const confirmed = window.confirm("Ao editar...")

      if (confirmed) {
        this.isEditing = true
      }
    },
  }
}
</script>

<template>
  <section class="grid-metadata-form-editor">
    <ul v-if="isLoaded">
      <button
        v-for="(template, index) of templates"
        :key="template.id"
        type="button"
        @click="selectTemplate(template.id)"
      >
        {{ getTemplateLabel(index) }}
      </button>
    </ul>

    <button
      type="button"
      :disabled="showEditButton"
      @click="edit()"
    >
      Editar
    </button>

    <button
      type="button"
      :disabled="!showRemoveTemplateButton"
      @click="removeTemplate()"
    >
      Excluir modelo
    </button>

    <p v-html="templateDescription" />
    <p v-html="templateResolutionWarning" />

    <button
      type="button"
      :disabled="!showSaveButton"
      @click="save()"
    >
      Salvar
    </button>

    <button
      type="button"
      :disabled="!showCreateDraftTemplateButton"
      @click="createDraftTemplate()"
    >
      Novo modelo responsivo
    </button>

    <form
      class="grid-metadata-form"
      :class="{ 'is-dragging': isDragging }"
    >
      <section class="device-area">
        <div class="min-mobile">
          Responsivo
        </div>
        <div class="mobile">
          Celulares
        </div>
        <div class="tablet">
          Tablets
        </div>
        <div class="desktop">
          Desktop
        </div>
        <div
          class="breakpoint"
          :style="{ '--breakpoint': breakpointLine }"
        />
      </section>

      <ul
        ref="rowContainerRef"
        class="row-container"
        :class="{ 'is-editing': isEditing }"
        :style="{ '--width': templateWidth }"
        @dragover.prevent=""
        @drop="dragAndDropEventsAdapter.onDrop"
        @dragend="dragAndDropEventsAdapter.onStop"
      >
        <li
          v-for="(row, rowIndex) in currentTemplateRows"
          v-if="isLoaded"
          :key="row.id"
        >
          <div
            class="row-container__trigger"
            data-is-row="true"
            data-position="before"
            :data-target-id="row.id"
          />
  
          <ul class="column-container">
            <li
              v-for="(column, columnIndex) in row.columns"
              :key="column.id"
              class="field-container"
              :class="{ 'is-dragging': isDragging }"
            >
              <div
                class="field-container__trigger"
                data-is-column="true"
                data-position="before"
                :data-target-id="column.id"
              />
  
              <div
                class="field-container__wireframe"
                :style="{
                  '--width': getColumnWidth(row, column),
                  '--min-width': getColumnMinWidth(column)
                }"
              >
                <label>{{ column.metadata.label }}</label>
                <div
                  class="wireframe-drag-trigger"
                  draggable="true"
                  @dragstart="dragAndDropEventsAdapter.onDrag(column.id)"
                >
                  {{ formatColumnValue(column) }}
                  <template v-if="column.layout.size.isPercentage">
                    <br>
                    {{ column.layout.size.min }}px
                  </template>

                  <menu :class="{ 'is-dragging': isDragging, 'is-resizing': isResizing }">
                    <div>
                      <button
                        type="button"
                        @click="changeColumnType(column.id, 'fixed')"
                      >
                        Fixo
                      </button>
                      <button
                        type="button"
                        @click="changeColumnType(column.id, 'percentage')"
                      >
                        Responsivo
                      </button>
                    </div>
                  </menu>
                </div>
                <div
                  class="wireframe-resize-trigger"
                  @mousedown.prevent="resizingEventsAdapter.onStartResizing($event, row, column)"
                />
              </div>
  
              <div
                v-if="columnIndex === row.columns.length - 1"
                class="field-container__trigger"
                data-is-column="true"
                data-position="after"
                :data-target-id="column.id"
              />
            </li>
          </ul>
  
          <div
            v-if="showLastRowTrigger(rowIndex)"
            class="row-container__trigger"
            data-is-row="true"
            data-position="after"
            :data-target-id="row.id"
          />
        </li>
      </ul>
    </form>
  </section>
</template>

<style scoped>
.grid-metadata-form-editor {
  form {
    overflow: hidden;
    margin-top: 100px;
  
    .device-area {
      display: grid;
      position: relative;
      grid-template-columns: 360px 240px 600px 1fr;
      font-size: 14px;
      border-bottom: 1px solid black;
      text-align: left;

      .breakpoint {
        display: flex;
        position: absolute;
        top: 100%;
        left: calc(var(--breakpoint));
        border-right: 2px dashed #ff6347;
        box-sizing: border-box;
        height: 9999px;
        z-index: -1;
      }
  
      & > *:not(.breakpoint) {
        position: relative;
        padding-left: 20px;
        box-sizing: border-box;
  
        &:not(.desktop)::after {
          content: '';
          display: flex;
          position: absolute;
          top: 100%;
          right: 0;
          border-right: 2px dashed rgba(80, 121, 255, 0.658);
          width: 1px;
          height: 9999px;
          z-index: -1;
        }
      }
    }
  
    &.is-dragging {
      .row-container.is-editing {
        .row-container__trigger {
          border: 1px solid #acd0ffc7;
          box-sizing: border-box;
          background: repeating-linear-gradient(
              45deg,
              #acd0ff2f,
              #acd0ff2f 2px,
              #fff 2px,
              #fff 3px
          );
        }
  
        li {
          .column-container {
            .field-container {
              .field-container__wireframe {
                border: none;
                .wireframe-resize-trigger {
                  width: 0px;
                  right: 0px;
                }
              }
  
              .field-container__trigger {
                border: 1px solid #acd0ffc7;
                border-top: none;
                border-bottom: none;
                box-sizing: border-box;
                background: repeating-linear-gradient(
                    135deg,
                    #acd0ff2f,
                    #acd0ff2f 2px,
                    #fff 2px,
                    #fff 3px
                );
              }
            }
          }
        }
      }
    }
  
    .row-container {
      position: relative;
      list-style: none;
      padding: 0;
      width: var(--width);
      overflow: auto;
      padding-top: 40px;
  
      &:not(.is-editing) {
        cursor: not-allowed;
        user-select: none;
  
        .field-container__wireframe {
          label {
            opacity: 0.5;
          }
  
          &::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 8px;
            background: rgba(255, 255, 255, 0.5);
          }
        }
  
        & > * {
          pointer-events: none;
        }
      }
  
      li {
        width: 100%;
  
        &.breakpoint {
          /* background-color: tomato; */
        }
  
        .row-container__trigger {
          width: 100%;
          height: 20px;
        }
  
        .column-container {
          display: flex;
          list-style: none;
          padding: 0;
          width: 100%;
  
          .field-container {
            display: flex;
            width: fit-content;
  
            .field-container__trigger {
              flex-shrink: 0;
              width: 20px;
              height: 100%;
            }
  
            .field-container__wireframe {
              position: relative;
              display: flex;
              width: var(--width);
              min-width: var(--min-width);
              height: 48px;
              border-radius: 8px;
              border: 1px solid #acd0ffc7;
              box-sizing: border-box;
              background: repeating-linear-gradient(
                  135deg,
                  #acd0ff2f,
                  #acd0ff2f 2px,
                  #fff 2px,
                  #fff 8px
              );
  
              &::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 8px;
                z-index: -1;
                background: white;
              }
  
              &::after {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: var(--min-width);
                border: 1px solid transparent;
                background: #ff634731;
                box-sizing: border-box;
                border-radius: 8px;
                z-index: -1;
              }
  
              label {
                position: absolute;
                left: 20px;
                top: -8px;
                background-color: white;
                z-index: 9;
              }
  
              .wireframe-resize-trigger {
                position: absolute;
                width: 16px;
                height: 100%;
                right: -8px;
                cursor: w-resize;
                z-index: 9;
              }
  
              .wireframe-drag-trigger {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                cursor: grab;
                font-size: 13px;

                menu {
                  all: unset;
                  display: none;
                  cursor: default;
                }

                &:hover {
                  menu:not(.is-dragging, .is-resizing) {
                    display: flex;
                    position: absolute;
                    bottom: 100%;
                    right: 0;
                    z-index: 99;
  
                    div {
                      display: flex;
                      gap: 8px;
                      margin-bottom: 12px;

                      button {
                        all: unset;
                        padding: 4px 12px;
                        color: rgb(32, 32, 32);
                        border-radius: 8px;
                        border: 1px solid rgb(59, 144, 255);
                        background-color: white;
                        cursor: pointer;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
