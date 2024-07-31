<template>
  <div>
    <v-dialog
      persistent
      v-model="reqToLicense.show"
      :model-id="reqToLicense.items"
      width="600"
    >
      <v-card class="card-dialog">
        <v-col cols="12" class="text-center mt-2">
          <h1 class="font_16">درخواست مجوز برای شکستن پکیج</h1>
          <v-divider class="mt-4"></v-divider>
        </v-col>
        <v-col cols="12">
          <amp-textarea
            text="توضیحات"
            v-model="form.message"
            :rows="3"
            rules="require"
          ></amp-textarea>
        </v-col>
        <v-row class="d-flex justify-center mt-4 mb-1">
          <v-col cols="2" md="3">
            <amp-button
              block
              height="40"
              @click="closeDialog"
              color="red darken-1 "
              class="ma-1"
              text="  انصراف"
            />
          </v-col>
          <v-col cols="3" md="3">
            <amp-button
              block
              :disabled="loading || !form.message"
              :loading="loading"
              height="40"
              @click="sendRequest"
              color="teal darken-1 "
              class="ma-1"
              text="ارسال درخواست"
            />
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    reqToLicense: {
      require: false,
      default: false,
    },
    packageId: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    headers: [],
    form: {
      message: "",
      id: "",
    },
    loading: false,
  }),

  methods: {
    closeDialog() {
      this.reqToLicense.show = false;
      this.reqToLicense.items = null;
    },
    sendRequest() {
      this.form.id = this.packageId;
      let form = { ...this.form };
      this.$reqApi("package/break-permission", form)
        .then((response) => {
          this.$toast.success("درخواست شما با موفقیت ارسال شد");
          this.closeDialog()
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
  },
};
</script>

<style scoped>
.card-dialog {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}
</style>
