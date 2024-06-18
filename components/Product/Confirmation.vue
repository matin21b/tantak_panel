<template>
  <v-row class="d-flex justify-center my-5 mx-4">
    <v-col cols="12" md="7">
      <div class="box">
        <v-col cols="12">
          <amp-section text="       برسی پرداخت "></amp-section>
          <div class="mr-4">
            <small v-if="Boolean(userInfo.first_name)">
              {{ userInfo.first_name }} {{ userInfo.last_name }} - مبلغ :
              {{ $price(userInfo.price) }}
            </small>
            <small v-else>
              {{ userInfo.username }} - مبلغ :
              {{ $price(userInfo.price) }}
            </small>
          </div>
        </v-col>
        <v-divider class="mx-1"></v-divider>
        <v-form
          v-model="valid"
          @submit.prevent="submit()"
          :disabled="loader"
          class="rounded-0 pa-2 d-flex flex-column"
        >
          <v-row class="ma-2">
            <v-col cols="12" md="4">
              <amp-select
                text=" وضعیت پرداخت"
                rules="require"
                v-model="form.status"
                :items="status_items"
              />
            </v-col>
            <v-col cols="12" md="4" v-if="form.status == 'payed'">
              <amp-jdate
                rules="require"
                text="زمان  پرداخت"
                v-model="form.paid_date"
                :is-number="true"
              />
            </v-col>
            <v-col cols="12" md="4" v-if="form.status == 'payed'">
              <AmpUploadFile v-model="form.receipt_img" title="بارگذاری رسید" />
            </v-col>

            <v-col cols>
              <amp-textarea text="توضیحات"  :rows="1"       rules="require" v-model="form.description"></amp-textarea>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-col>
    <v-row class="ma-1 d-flex justify-center align-center">
      <v-col cols="12" class="text-center">
        <span>
          درصورت لغو پرداخت , تمامی عملیات های مربوط به سبد خرید کاربر لغو میشود
        </span>
        <v-divider class="mt-2"></v-divider>
      </v-col>

      <v-col cols="12" md="3">
        <amp-button
          block
          text="پرداخت"
          width="30"
          @click="submit"
          :disabled="!valid || loader"
          class="ma-1"
          :loading="loader"
        ></amp-button>
      </v-col>
      <v-col cols="12" md="3">
        <amp-button
          block
          width="30"
          text="برگشت"
          @click="back"
          color="error"
          class="ma-1"
        ></amp-button
      ></v-col>
    </v-row>
  </v-row>
</template>

<script>
export default {
  props: {
    userInfo: {
      require: false,
      default: false,
    },
    payId: {
      require: false,
      default: false,
    },
    updateUrl: { default: "/branch/update" },
    createUrl: { default: "/branch/insert" },
    showUrl: { default: "/branch/show" },
  },
  data() {
    return {
      valid: false,
      loader: false,
      status_items: [
        { text: "لغو پرداخت", value: "cancled" },
        { text: "پرداخت", value: "payed" },
      ],
      location: [],
      province: [],
      citis: [],
      user: [],
      form: {
        status: "",
        description: "",
        paid_date: "",
        receipt_img: "",
      },
    };
  },

  methods: {
    submit() {
      this.loader = true;
      let form = this.$copyForm(this.form);
      form["id"] = this.payId;
      this.$reqApi("payment/confirmation-manual", form)
        .then((response) => {
          this.loader = false;

          this.back();
          this.refreshed();
          this.$toast.success("پرداخت با موفقیت انجام شد");
        })
        .catch((err) => {
          this.loader = false;
        });
    },

    back() {
      this.$emit("back");
    },    refreshed() {
      this.$emit("refresh");
    },
  },
};
</script>
<style scoped>
.box {
  border: 0.08cm dashed #0000005d;
  border-radius: 5px;
}
</style>
