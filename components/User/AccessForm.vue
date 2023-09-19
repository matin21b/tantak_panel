<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loader" class="rounded-0 pa-2 d-flex flex-column">
    <v-row class="ma-2">
      <v-col cols="12" md="3">
        <amp-input text="عنوان" v-model="form.name" rules="require"></amp-input>
      </v-col>
      <v-col cols="12" md="12">
        <amp-textarea text="توضیحات" v-model="form.description" />
      </v-col>
    </v-row>
    <v-row class="ma-1 d-flex justify-center">
      <amp-button text="انصراف" icon="redo" @click="back" color="error" class="ma-1"></amp-button>
      <amp-button text="ویرایش" type="submit" icon="done" class="ma-1" :loading="loader"></amp-button>
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: {
      require: false,
      default: false,
    },
    updateUrl: { default: 'action/update' },
    showUrl: { default: 'action/show' },
  },
  data() {
    return {
      valid: true,
      loader: false,
      form: {
        name: '',
        description: '',
        id: '',
      },
    }
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData()
    } else {
      this.back()
    }
  },
  methods: {
    submit() {
      this.loader = true
      let form = { ...this.form }
      let url = this.updateUrl
      this.$reqApi(url, form)
        .then((response) => {
          this.loader = false
          this.back()
        })
        .catch((err) => {
          this.loader = false
        })
    },
    loadData() {
      this.loader = true
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then((response) => {
          this.form.id = this.modelId
          this.form.name = response.model.name
          this.form.description = response.model.description
          this.loader = false
        })
        .catch((error) => {
          this.loader = false
        })
    },
    back() {
      this.$router.back()
    },
  },
}
</script>
