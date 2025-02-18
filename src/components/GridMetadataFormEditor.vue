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

  methods: {
    removeHints () {
      const $leftHint = document.querySelector('.left-hint')
      const $rightHint = document.querySelector('.right-hint')

      $leftHint?.classList.remove('left-hint')
      $rightHint?.classList.remove('right-hint')
    },

    onDragStart(columnId) {
      this.drag.columnId = columnId
    },

    onDragOver(event, rowIndex) {
      event.preventDefault()

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

      console.log(this.drag.columnId, this.drag.position, this.drag.targetId)

      this.removeHints()
      if (isMouseOnLeftHalf) {
        $closestColumn.classList.add('left-hint')
      } else {
        $closestColumn.classList.add('right-hint')
      }
    },

    onDragDrop(event) {
      event.preventDefault()
      this.form.moveColumn(this.drag.columnId, this.drag.position, this.drag.targetId)
      this.onDragEnd()
    },

    onDragDropNewRow(event) {
      event.preventDefault()
      this.form.addColumnToNewRow(this.drag.columnId)
      this.onDragEnd()
    },

    onDragEnd() {
      this.drag = {
        columnId: null,
        position: null,
        targetId: null,
      }
      this.removeHints()
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
          </li>
        </ul>

        <div v-if="rowIndex === form.rows.length - 1" @drop="onDragDropNewRow" @dragover.prevent="">
          new row here
        </div>
      </li>
    </ul>
  </form>
</template>

<style scoped>
.grid-metadata-form {
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

    li {
      width: var(--width);
      margin-left: var(--offset);
      position: relative;
      transition: margin-left 0.3s;
      display: flex;

      &.left-hint::before {
        content: '';
        display: block;
        background-color: #3d8bff;
        width: 4px;
        height: 100%;
        border-radius: 2px;
        box-sizing: border-box;
        margin-right: 12px;
      }

      &.right-hint::after {
        content: '';
        display: block;
        background-color: #3d8bff;
        width: 4px;
        height: 100%;
        border-radius: 2px;
        box-sizing: border-box;
        margin-left: 12px;
      }

      &.is-dragging {
        & > * {
          opacity: 0.2;
        }
      }
    }
  }
}
</style>
