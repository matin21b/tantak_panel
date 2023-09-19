<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loader" class="rounded-0 pa-2 d-flex flex-column">
    <v-row class="ma-2">
      <v-col cols="12" md="3">
        <amp-input text="کلید" v-model="form.key" rules="require"></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input text="مقدار" dir="ltr"  v-model="form.value"></amp-input>
      </v-col>
    </v-row>
    <v-row class="ma-1 d-flex justify-center">
      <amp-button text="انصراف" icon="redo" @click="back" color="error" class="ma-1"></amp-button>
      <amp-button text="تایید" type="submit" icon="done" class="ma-1" :disabled="!valid || loader" :loading="loader"></amp-button>
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
  },
  data() {
    return {
      valid: true,
      loader: false,
      form: {
        key:'',
        value:'',
        id: '',
      },
    }
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData()
    }
  },
  methods: {
    submit() {
      this.loader = true
      let form = { ...this.form }
      let url = this.modelId ? 'setting/update' : 'setting/insert'
      this.$reqApi(url, form)
        .then((res) => {
          this.loader = false
          this.back()
        })
        .catch((err) => {
          this.loader = false
        })
    },
    loadData() {
      this.loader = true
      this.$reqApi('setting/show', { id: this.modelId })
        .then((res) => {
          this.form.key = res.model.key
          this.form.value = res.model.value
          this.form.id = res.model.id
          this.loader = false
        })
        .catch((err) => {
          this.loader = false
        })
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push('/setting')
      }
    },
  },
}
</script>
