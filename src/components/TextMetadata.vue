<script>
export default {
  name: 'TextMetadata',
  props: {
    data: Object
  }
}
</script>

<template>
  <div class="text-metadata" :class="{ disabled: !data.metadata.active }">
    <label :for="data.metadata.id">{{ data.metadata.label }}</label>
    <input :id="data.metadata.id" type="text" :placeholder="data.metadata.presentation?.placeholder" />
  </div>
</template>

<style scoped>
.text-metadata {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
  width: 100%;

  input {
    height: 32px;
    padding: 0 8px;
  }

  &.disabled {
    opacity: 0.5;
  }
}
</style>
