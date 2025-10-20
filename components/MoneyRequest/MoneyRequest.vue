<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loader"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">

      <v-col cols="12" md="3">
        <amp-input
          text="شماره کارت"
          cClass="ltr-item"
          v-model="form.bank_number"
          rules="number"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="شماره شبا"
          cClass="ltr-item"
          v-model="form.sheba_number"
          rules="shabaCode"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="مقدار به ریال"
          cClass="ltr-item"
          is-price
          rules="require"
          v-model="form.value"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="12">
        <amp-textarea text="توضیحات" v-model="form.description" />
      </v-col>
    </v-row>
    <v-row class="ma-1 d-flex justify-center">
      <amp-button
        text="انصراف"
        icon="redo"
        @click="back"
        color="error"
        class="ma-1"
      ></amp-button>
      <amp-button
        text="تایید"
        type="submit"
        icon="done"
        class="ma-1"
        :disabled="!valid || loader"
        :loading="loader"
      ></amp-button>
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
      user: [],
      form: {
        sheba_number: "",
        bank_number: "",
        description: "",
        value: "",
      },
    };
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {

      this.loader = true;

      let form = { ...this.form };
      let url = "money-request/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loader = false;
          this.back();
        })
        .catch((err) => {
          this.loader = false;
        });
    },
    loadData() {
      this.loader = true;
      this.$reqApi("setting/show", { id: this.modelId })
        .then((res) => {
          this.form.key = res.model.key;
          this.form.value = res.model.value;
          this.form.id = res.model.id;
          this.loader = false;
        })
        .catch((err) => {
          this.loader = false;
        });
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/setting");
      }
    },
  },
};
</script>
        