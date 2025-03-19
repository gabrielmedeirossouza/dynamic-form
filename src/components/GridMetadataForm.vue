<script>
import { fakeForm } from './fake-user-profile-gateway'

export default {
  name: 'GridMetadataForm',
  props: {
    components: Object
  },
  data() {
    return {
      form: fakeForm
    }
  }
}
</script>

<template>
  <form class="grid-metadata-form">
    <ul class="row-container">
      <li v-for="(row, rowIndex) in form.#rows" :key="rowIndex">
        <ul class="column-container">
          <li v-for="(column, columnIndex) in row.columns" :key="columnIndex" :style="{ '--width': column.layout.width, '--offset': column.layout.offset ?? '0' }">
            <component
              :is="components[column.metadata.type]"
              :data="column"
            />
          </li>
        </ul>
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
    }
  }
}
</style>
