<template>
  <q-dialog
    v-model="toggle"
    @update:model-value="handleCancel"
  >
    <q-card>
      <q-card-section>
        {{ $t('general.Q.itemDelete', {item: itemRepr}) }}
      </q-card-section>
      <q-card-actions>
        <q-btn color="primary" @click="handleCancel">{{ $t('general.cancel') }}</q-btn>
        <q-space/>
        <q-btn color="red" @click="$emit('delete')">{{ $t('general.yes') }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'DeleteDialog',
  props: ['modelValue', 'itemRepr'],
  data() {
    return {
      deleteDialog: false,
      toggle: this.modelValue,
    }
  },
  watch: {
    modelValue(newValue) {
      this.toggle = newValue
    },
  },
  methods: {
    handleCancel() {
      this.toggle = false
      this.$emit('update:modelValue', this.toggle)
    },
  },
}
</script>

<style scoped>

</style>
