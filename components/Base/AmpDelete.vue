<template>
  <v-dialog v-model="value" max-width="380" persistent dark>
    <v-card class="pa-4" color="accent" v-if="value">
      <v-card-text>
        <div class="font_18 white--text">{{ message }}</div>
        <div class="center-div py-2" v-if="time != 0">
          امکان حذف بعد از {{ time }} ثانیه دیگر
        </div>
      </v-card-text>
      <v-card-actions class="d-block">
        <amp-button
          block
          text="حذف"
          class="mb-2"
          color="error"
          @click="submit()"
          :loading="loading"
          test-tag="bad-delete"
          :disabled="time != 0 || loading"
        />
        <amp-button
          block
          text="بستن"
          class="ma-0"
          test-tag="bad-close"
          @click="closeDialog()"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    id: { default: 0 },
    value: { type: Boolean },
    deleteUrl: { type: String },
    message: {
      type: String,
      default: 'آیا از حذف این مورد اطمینان دارید؟',
    },
  },
  data: () => ({
    loading: false,
    time: 3,
    timeInterval: null,
  }),
  watch: {
    id() {
      this.activeDialog()
    },
    value() {
      this.activeDialog()
    },
  },
  methods: {
    submit() {
      this.loading = true
      this.$reqApi(this.deleteUrl, { id: this.id })
        .then((response) => {
          this.$toast.success('حذف انجام شد')
          this.closeDialog(true)
          this.$emit('reloadTable', true)
        })
        .catch((error) => {
          this.loading = false
        })
    },
    closeDialog(delete_item = false) {
      this.$emit('input', false)
      this.$emit('closeDialog', true)
      if (delete_item) {
        this.$emit('deleteItem', true)
      }
      if (this.timeInterval) {
        clearInterval(this.timeInterval)
      }
      this.loading = false
    },
    activeDialog() {
      if (!(this.value && this.id)) {
        this.closeDialog()
      }
      if (this.timeInterval) {
        clearInterval(this.timeInterval)
      }
      this.time = 3
      this.timeInterval = setInterval(() => {
        if (this.time > 0) {
          this.time -= 1
        } else {
          clearInterval(this.timeInterval)
        }
      }, 1000)
    },
  },
}
</script>
