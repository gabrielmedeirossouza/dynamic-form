<script>
import { fakeForm } from './fake-form'

export default {
  name: 'GridMetadataForm',
  props: {
    components: Object
  },
  data() {
    return {
      form: fakeForm,
      drag: {
        columnId: null,
        position: null,
        targetId: null,
      }
    }
  },

  computed: {
    isDragging() {
      return this.drag.columnId !== null
    }
  },

  methods: {
    removeHints () {
      const $leftHint = document.querySelector('.left-hint')
      const $rightHint = document.querySelector('.right-hint')

      $leftHint?.classList.remove('left-hint')
      $rightHint?.classList.remove('right-hint')
    },

    reset() {
      this.removeHints()
      this.drag = {
        columnId: null,
        position: null,
        targetId: null,
      }
    },

    onDragStart(columnId) {
      this.drag.columnId = columnId
    },

    onDragOver(event, rowIndex) {
      event.preventDefault()
      event.dataTransfer.dropEffect = "move";
      if (!this.isDragging) return

      const mouseX = event.clientX

      const $row = document.querySelectorAll('.row-container > li')[rowIndex]
      const $columns = $row.querySelectorAll('.column-container > li')

      let $closestColumn = null
      let minDistance = Infinity

      $columns.forEach($column => {
        const rect = $column.getBoundingClientRect()
        const columnCenterX = rect.left + rect.width / 2
        const distance = Math.abs(mouseX - columnCenterX)

        if (distance < minDistance) {
          minDistance = distance
          $closestColumn = $column
        }
      })

      const rect = $closestColumn.getBoundingClientRect()

      const isMouseOnLeftHalf = mouseX < rect.left + rect.width / 2

      this.drag.targetId = Number($closestColumn.dataset.columnId)
      this.drag.position = isMouseOnLeftHalf ? 'before' : 'after'

      this.removeHints()
      if (isMouseOnLeftHalf) {
        $closestColumn.classList.add('left-hint')
      } else {
        $closestColumn.classList.add('right-hint')
      }
    },

    onDragDrop(event) {
      event.preventDefault()
      if (!this.isDragging) return

      this.form.moveColumn(this.drag.columnId, this.drag.position, this.drag.targetId)
      this.reset()
    },

    onDragDropNewRow(event) {
      event.preventDefault()
      if (!this.isDragging) return
      
      this.form.addColumnToNewRow(this.drag.columnId)
      this.reset()
    },

    onDragEnd() {
      this.reset()
    }
  }
}
</script>

<template>
  <form class="grid-metadata-form">
    <ul class="row-container">
      <li v-for="(row, rowIndex) in form.rows" :key="rowIndex">
        <ul
          class="column-container"
          @dragover="onDragOver($event, rowIndex)"
          @drop="onDragDrop"
          @dragend="onDragEnd"
        >
          <li
            v-for="(column, columnIndex) in row.columns"
            :key="columnIndex"
            class="metadata-container"
            :class="{ 'is-dragging': drag.columnId === column.metadata.id }"
            draggable="true"
            @dragstart="onDragStart(column.metadata.id)"
            :style="{ '--width': column.layout.width, '--offset': column.layout.offset ?? '0' }"
            :data-column-id="column.metadata.id"
          >
            <component :is="components[column.metadata.type]" :data="column" />
            <div class="component-film"></div>
          </li>
        </ul>
      </li>
    </ul>

    <section class="drop-area" :class="{ 'is-dragging': isDragging }" @drop="onDragDropNewRow" @dragover.prevent="">
    </section>
  </form>
</template>

<style scoped>
.grid-metadata-form {
  overflow: hidden;

  .row-container {
    display: flex;
    flex-direction: column;
    list-style: none;
    gap: 20px;
    padding: 0;

    li {
      width: 100%;
    }
  }

  .column-container {
    display: flex;
    flex-direction: row;
    list-style: none;
    gap: 20px;
    padding: 0;

    .metadata-container {
      width: var(--width);
      margin-left: var(--offset);
      position: relative;
      transition: margin-left 0.3s;
      display: flex;

      &::before {
        content: '';
        position: absolute;
        display: block;
        background-color: transparent;
        width: 4px;
        height: 100%;
        border-radius: 2px;
        box-sizing: border-box;
        left: -12px;
        transition: all 225ms;
      }

      &.left-hint::before {
        background-color: #3d8bff;
      }

      &:first-child.left-hint::before {
        left: -12px;
        margin-left: 12px;
        position: relative;
      }

      &::after {
        content: '';
        display: block;
        position: absolute;
        background-color: transparent;
        width: 4px;
        height: 100%;
        border-radius: 2px;
        box-sizing: border-box;
        right: -12px;
        transition: all 225ms;
      }

      &.right-hint::after {
        background-color: #3d8bff;
      } 

      &:last-child.right-hint::after {
        right: -12px;
        margin-right: 12px;
        position: relative;
      }

      .component-film {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        cursor: move;
      }

      &.is-dragging {
        & > * {
          opacity: 0.2;
        }
      }
    }
  }

  .drop-area {
    display: block;
    width: 100%;
    height: 36px;
    background-color: #faf9f9;
    border: 2px dashed #4b93ff;
    border-radius: 4px;
    transition: opacity 300ms ease-in-out;
    opacity: 0;

    &.is-dragging {
      opacity: 1;
    }
  }
}
</style>
