<template>
  <v-card class="pa-4 elevation-0" :disabled="Boolean(loading)">
    <v-card-text>
      <v-form v-model="valid" @submit.prevent="submit()">
        <v-row>
          <v-col cols="12" md="3">
            <amp-input
              text="تام سرور"
              v-model="form.server_name"
              rules="require"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              text="مسیر سرور (به صورت کامل)"
              v-model="form.server_url"
              rules="require"
            />
          </v-col>

          <v-col cols="12" md="3">
            <amp-input
              text="شروع پورت از "
              v-model="form.start_port"
              rules="require,number"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              text="تا (پایان پورت)"
              v-model="form.end_port"
              rules="require,number"
              cClass="ltr-item"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-select
              text="وضعیت"
              rules="require"
              v-model="form.status"
              :items="$store.state.static.status"
            />
          </v-col>
          <v-col cols>
            <amp-textarea
              :rows="1"
              rules="require"
              text="توضیحات"
              v-model="form.description"
            ></amp-textarea>
          </v-col>
        </v-row>

        <v-row class="d-flex justify-center">
          <v-col cols="12" md="2">
            <amp-button
              text="انصراف"
              block
              icon="redo"
              color="red "
              @click="back"
              class="ma-1"
            />
          </v-col>
          <v-col cols="12" md="2">
            <amp-button
              text="تایید"
              block
              icon="done"
              color="success"
              type="submit"
              class="ma-1"
              :loading="loading"
              :disabled="loading || !valid"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  props: {
    modelId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    loading: false,

    form: {
      status: "active",
      start_port: "",
      end_port: "",
      server_url: "",
      description: "",
      server_name: "",
    },
  }),

  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      let chek = this.form.end_port - this.form.start_port;
      if (chek == 0 || chek < 0) {
        this.$toast.error("لطفا در انتخاب بازه پورت دقت کنید");
        return;
      }
      this.loading = true;

      let form = { ...this.form };
      let url = this.modelId ? "internal/update" : "internal/insert";
      this.$reqApi(url, form)
        .then((response) => {
          this.loading = false;
          this.back();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("internal/show", { id: this.modelId })
        .then((response) => {
          for (let key in response.model) {
            this.form[key] = response.model[key];
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    back() {
      this.$router.back();
    },
  },
};
</script>

<style></style>
