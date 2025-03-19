<script>
import Vue from 'vue';
import { FormController } from './presentation/form-controller';
import { FakeUserProfileGateway } from './fake-user-profile-gateway';
import { FormLayoutService } from './ui/form-layout-service';
import { LoadFormAndMetadataListUseCase } from './application/use-cases/load-form-and-metadata-list-use-case';

export default {
  name: 'GridMetadataForm',
  props: {
    components: Object
  },
  data() {
    return {
      rowWidth: 0,
      resizeObserver: null,
      mouseMoveCallback: this.onResize.bind(this),
      mouseUpCallback: this.onResizeEnd.bind(this),
      formLayoutService: new FormLayoutService(),
      loaded: false,
      formEditor: new FormController(new LoadFormAndMetadataListUseCase(new FakeUserProfileGateway())),
      dragging: {
        columnId: null,
        row: {
          position: null,
          targetRowId: null,
          triggerId: null
        },
        column: {
          position: null,
          targetColumnId: null,
          triggerId: null
        }
      },

      resizing: {
        started: false,
        row: null,
        column: null,
        targetElement: null,
        startedAt: 0
      },
      wireframeWidth: 0
    }
  },

  computed: {
    isDragging() {
      return this.dragging.columnId !== null
    },

    isDraggingColumn() {
      return this.dragging.column.targetColumnId !== null 
    },

    isDraggingRow() {
      return this.dragging.row.targetRowId !== null
    }
  },

  created() {
    this.formEditor.loadFormAndMetadataList()
      .then(() => {
        this.loaded = true
        this.$nextTick(() => {
          this.resizeObserver = new ResizeObserver(() => {
            this.rowWidth = this.$refs.rowContainerRef.getBoundingClientRect().width
          });

          this.resizeObserver.observe(this.$refs.rowContainerRef);
        })
      })

    window.addEventListener("mousemove", this.mouseMoveCallback)
    window.addEventListener("mouseup", this.mouseUpCallback)
  },

  beforeDestroy() {
    window.removeEventListener("mousemove", this.mouseMoveCallback)
    window.removeEventListener("mouseup", this.mouseUpCallback)

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  },

  methods: {
    reset() {
      Vue.set(this, "dragging", {
        columnId: null,
        row: {
          position: null,
          targetRowId: null,
          triggerId: null
        },
        column: {
          position: null,
          targetColumnId: null,
          triggerId: null
        }
      })
    },

    onDragColumnStart(columnId) {
      this.dragging.columnId = columnId
    },

    onDragColumnMoveOverColumnTrigger(event, triggerId, triggerPosition, columnTargetId) {
      const isColumn = (event.target instanceof HTMLElement) && event.target.dataset.isColumn
      if (!isColumn) return

      this.dragging.row.targetRowId = null
      this.dragging.row.position = null
      this.dragging.row.triggerId = null

      this.dragging.column.triggerId = triggerId
      this.dragging.column.position = triggerPosition
      this.dragging.column.targetColumnId = columnTargetId
    },

    onDragColumnMoveOverRowTrigger(event, triggerId, triggerPosition, targetRowId) {
      const isRow = (event.target instanceof HTMLElement) && event.target.dataset.isRow
      if (!isRow) return

      this.dragging.column.triggerId = null
      this.dragging.column.position = null
      this.dragging.column.targetColumnId = null

      this.dragging.row.triggerId = triggerId
      this.dragging.row.position = triggerPosition
      this.dragging.row.targetRowId = targetRowId
    },

    onDragDropColumn(event) {
      event.preventDefault()
      const isRow = (event.target instanceof HTMLElement) && event.target.dataset.isRow
      const isColumn = (event.target instanceof HTMLElement) && event.target.dataset.isColumn
      if (!this.isDragging || (!isRow && !isColumn)) {
        this.reset()
        return
      }

      if (this.isDraggingColumn) {
        this.formEditor.moveTemplateColumn(
          this.formEditor.$form.mainTemplate.id,
          this.dragging.columnId,
          this.dragging.column.position,
          this.dragging.column.targetColumnId
        )
      }

      if (this.isDraggingRow) {
        this.formEditor.moveTemplateColumnToNewRow(
          this.formEditor.$form.mainTemplate.id,
          this.dragging.columnId,
          this.dragging.row.position,
          this.dragging.row.targetRowId
        )
      }

      this.reset()
    },

    onDragEnd() {
      this.reset()
    },

    onResizeStart(event, row, column) {
      this.resizing.started = true
      this.resizing.row = row
      this.resizing.column = column
      this.resizing.targetElement = event.target
      this.resizing.startedAt = event.x
    },

    onResize(event) {
      if (!this.resizing.started) return

      const mouseDiff = event.x - this.resizing.startedAt

      if (this.resizing.column.layout.size.isFixed) {
        const columnSize = this.resizing.column.layout.size.value + mouseDiff
        
        if (columnSize < 100 || columnSize > 320) return
  
        this.formEditor.resizeColumn(
          this.formEditor.$form.mainTemplate.id,
          this.resizing.column.id,
          columnSize,
          this.resizing.column.layout.size.min
        )

        return
      }

      const percentageWidthInPixels = this.formLayoutService.getFieldWidth(
        this.rowWidth,
        this.formEditor.$form.mainTemplate,
        this.resizing.row,
        this.resizing.column
      )
      const totalUsablePercentageAreaInPixels = this.formLayoutService.getTotalUsablePercentageAreaInPixels(
        this.rowWidth,
        this.formEditor.$form.mainTemplate,
        this.resizing.row
      )

      const normalizedPercentageArea = (percentageWidthInPixels + mouseDiff) / totalUsablePercentageAreaInPixels
      const columnSize = normalizedPercentageArea * 100
      const percentageDiff = (mouseDiff / totalUsablePercentageAreaInPixels) * 100

      const outsidePercentageRange =
        columnSize < 20 ||
        columnSize > 100 ||
        (percentageDiff + this.formLayoutService.getTotalRowPercentageUsage(this.resizing.row)) > 100
      if (outsidePercentageRange) return

      this.formEditor.resizeColumn(
        this.formEditor.$form.mainTemplate.id,
        this.resizing.column.id,
        columnSize,
        this.resizing.column.layout.size.min
      )
    },

    onResizeEnd() {
      if (!this.resizing.started) return
      this.resizing.started = false
      this.resizing.row = null
      this.resizing.column = null
      this.resizing.targetElement = null
      this.resizing.startedAt = 0
      this.wireframeWidth = 0
    },

    newTemplate() {

    }
  }
}
</script>

<template>
  <form
    class="grid-metadata-form"
    :class="{ 'is-dragging': isDragging }"
  >
    <ul
      v-if="loaded"
      class="row-container"
      ref="rowContainerRef"
      @dragover.prevent=""
      @drop="onDragDropColumn"
      @dragend="onDragEnd"
    >
      <li
        v-for="(row, rowIndex) in formEditor.$form.mainTemplate.rows"
        :key="rowIndex"
      >
        <div
          class="row-container__trigger"
          data-is-row="true"
          @dragover="onDragColumnMoveOverRowTrigger($event, rowIndex, 'before', row.id)"
        ></div>

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
              @dragover="onDragColumnMoveOverColumnTrigger($event, columnIndex, 'before', column.id)"
            ></div>

            <div
              class="field-container__wireframe"
              :style="{
                '--width': formLayoutService.getFieldWidth(rowWidth, formEditor.$form.mainTemplate, row, column) + 'px',
                '--min-width': column.layout.size.staticValue + 'px'
              }"
            >
              <div
                class="wireframe-drag-trigger"
                draggable="true"
                @dragstart="onDragColumnStart(column.id)"
              >
                {{ column.metadata.label }}
              </div>
              <div
                class="wireframe-resize-trigger"
                @mousedown.prevent="onResizeStart($event, row, column)"
              ></div>
            </div>

            <div
              v-if="columnIndex === row.columns.length - 1"
              class="field-container__trigger"
              data-is-column="true"
              @dragover="onDragColumnMoveOverColumnTrigger($event, columnIndex, 'after', column.id)"
            ></div>
          </li>
        </ul>

        <div
          v-if="rowIndex === formEditor.$form.mainTemplate.rows.length - 1"
          class="row-container__trigger"
          data-is-row="true"
          @dragover="onDragColumnMoveOverRowTrigger($event, rowIndex, 'after', row.id)"
        ></div>
      </li>
    </ul>

    <button
      v-if="formEditor.$form.isFormResponsive"
      type="button"
    >
      Salvar
    </button>

    <button
      v-else
      @click="newTemplate"
      type="button"
    >
      Próximo
    </button>
  </form>
</template>

<style scoped>
.grid-metadata-form {
  overflow: hidden;

  &.is-dragging {
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

    .row-container {
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
          }
        }
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

  .row-container {
    list-style: none;
    padding: 0;

    li {
      width: 100%;

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

            &::after {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              bottom: 0;
              width: var(--min-width);
              border: 1px solid rgba(255, 99, 71, 0.411);
              background: #ff63471c;
              box-sizing: border-box;
              border-radius: 8px;
              z-index: -1;
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
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%;
              cursor: grab;
            }
          }
        }
      }
    }
  }
}
</style>
