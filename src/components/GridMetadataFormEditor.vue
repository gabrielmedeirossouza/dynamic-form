<script>
import { MetadataRepositoryRegistry } from './application/metadata-repository-registry'
import { InMemoryFormRepository } from './infra/in-memory-form-repository';
import { InMemoryMetadataRepository } from './infra/in-memory-metadata-repository';
import { FakeUserProfileGateway } from './fake-user-profile-gateway';
import { FormLayoutService } from './ui/services/form-layout-service';
import { LoadFormAndMetadataListUseCase } from './application/use-cases/load-form-and-metadata-list-use-case';
import { FormContext } from './ui/contexts/form-context';
import { GetFormUseCase } from './application/use-cases/get-form-use-case';
import { GetTemplateUseCase } from './application/use-cases/get-template-use-case';
import { GetFormMetadataListUseCase } from './application/use-cases/get-form-metadata-list-use-case';
import { FormSizeObserver } from './ui/form-size-observer';
import { FormDragAndDropEventsAdapter } from './ui/form-drag-and-drop-events-adapter';
import { MoveTemplateColumnUseCase } from './application/use-cases/move-template-column-use-case';
import { MoveTemplateColumnToNewRowUseCase } from './application/use-cases/move-template-column-to-new-row-use-case';
import { FormResizingEventsAdapter } from './ui/form-resizing-events-adapter';
import { ResizeColumnUseCase } from './application/use-cases/resize-column-use-case';
import { GetTotalRowPercentageUsageUseCase } from './application/use-cases/get-total-row-percentage-usage-use-case';

MetadataRepositoryRegistry.formRepository = new InMemoryFormRepository()
MetadataRepositoryRegistry.metadataRepository = new InMemoryMetadataRepository()

const getFormUseCase = new GetFormUseCase()
const getTemplateUseCase = new GetTemplateUseCase()
const getFormMetadataListUseCase = new GetFormMetadataListUseCase()
const moveTemplateColumnUseCase = new MoveTemplateColumnUseCase()
const moveTemplateColumnToNewRowUseCase = new MoveTemplateColumnToNewRowUseCase()
const resizeColumnUseCase = new ResizeColumnUseCase()
const getTotalRowPercentageUsageUseCase = new GetTotalRowPercentageUsageUseCase()
const loadFormAndMetadataListUseCase = new LoadFormAndMetadataListUseCase(new FakeUserProfileGateway())

const formContext = new FormContext(getFormUseCase, getTemplateUseCase, getFormMetadataListUseCase)
const formSizeObserver = new FormSizeObserver()
const formLayoutService = new FormLayoutService(formSizeObserver)
const formDragAndDropEventsAdapter = new FormDragAndDropEventsAdapter(formContext, moveTemplateColumnUseCase, moveTemplateColumnToNewRowUseCase)
const formResizingEventsAdapter = new FormResizingEventsAdapter(formContext, formLayoutService, resizeColumnUseCase, getTotalRowPercentageUsageUseCase)

export default {
  name: 'GridMetadataForm',

  data() {
    return {
      context: formContext,
      formSizeObserver: formSizeObserver,
      layoutService: formLayoutService,
      dragAndDropEventsAdapter: formDragAndDropEventsAdapter,
      resizingEventsAdapter: formResizingEventsAdapter,
    }
  },

  computed: {
    isLoaded() {
      return this.context.currentTemplate.id
    },
  },

  created() {
    loadFormAndMetadataListUseCase.execute()
    .then((formId) => {
      this.context.update(formId)

      this.$nextTick(() => {
        this.formSizeObserver.setRowElement(this.$refs.rowContainerRef)
      })
    })
  },

  beforeDestroy() {
    this.resizingEventsAdapter.clearListeners()
    this.formSizeObserver.disconnect()
  }
}
</script>

<template>
  <form
    class="grid-metadata-form"
    :class="{ 'is-dragging': dragAndDropEventsAdapter.isDragging }"
  >
    <ul
      v-if="isLoaded"
      class="row-container"
      ref="rowContainerRef"
      @dragover.prevent=""
      @drop="dragAndDropEventsAdapter.onDrop"
      @dragend="dragAndDropEventsAdapter.onStop"
    >
      <li
        v-for="(row, rowIndex) in context.currentTemplate.rows"
        :key="row.id"
      >
        <div
          class="row-container__trigger"
          data-is-row="true"
          data-position="before"
          :data-target-id="row.id"
        ></div>

        <ul class="column-container">
          <li
            v-for="(column, columnIndex) in row.columns"
            :key="column.id"
            class="field-container"
            :class="{ 'is-dragging': dragAndDropEventsAdapter.isDragging }"
          >
            <div
              class="field-container__trigger"
              data-is-column="true"
              data-position="before"
              :data-target-id="column.id"
            ></div>

            <div
              class="field-container__wireframe"
              :style="{
                '--width': layoutService.getFieldWidthInUnits(context.currentTemplate, row, column) + 'px',
                '--min-width': column.layout.size.staticValue + 'px'
              }"
            >
              <div
                class="wireframe-drag-trigger"
                draggable="true"
                @dragstart="dragAndDropEventsAdapter.onDrag(column.id)"
              >
                {{ column.metadata.label }}
              </div>
              <div
                class="wireframe-resize-trigger"
                @mousedown.prevent="resizingEventsAdapter.onStartResizing($event, row, column)"
              ></div>
            </div>

            <div
              v-if="columnIndex === row.columns.length - 1"
              class="field-container__trigger"
              data-is-column="true"
              data-position="after"
              :data-target-id="column.id"
            ></div>
          </li>
        </ul>

        <div
          v-if="rowIndex === context.currentTemplate.rows.length - 1"
          class="row-container__trigger"
          data-is-row="true"
          data-position="after"
          :data-target-id="row.id"
        ></div>
      </li>
    </ul>

    <button
      v-if="context.currentForm.isFormResponsive"
      type="button"
      @click=""
    >
      Salvar
    </button>

    <button
      v-else
      type="button"
      @click=""
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

            /* &::after {
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
            } */

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
