<template>
  <div>
    <v-dialog
      persistent
      v-model="priceDialog.show"
      :model-id="priceDialog.items"
      width="620"
    >
      <v-card higth="300" class="card-dialog py-8">
        <v-col cols="12" calss="text-center">
          <v-row>
            <v-col cols="12" class="text-center">
              <v-card class="py-8">
                <v-row class="mx-4">
                  <h1>قیمت فعلی سبد</h1>
                  <v-divider class="mt-2 mx-3"></v-divider>
                  <h1 cass="ml-3">
                    <small> (ریال) </small>
                    {{ $price(basketPrice.basket) }}
                  </h1>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-card class="py-8">
                <v-row class="mx-4">
                  <h1>قیمت جدید سبد</h1>
                  <v-divider class="mt-2 mx-3"></v-divider>
                  <h1 cass="ml-3">
                    <small> (ریال) </small>
                    {{ $price(basketPrice.new_price) }}
                  </h1>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" class="text-center">
              <v-card class="py-8">
                <v-row class="mx-4">
                  <h1>تفاوت قیمت</h1>
                  <v-divider class="mt-2 mx-3"></v-divider>
                  <h1
                    cass="ml-3"
                    v-if="basketPrice.basket - basketPrice.new_price > 0"
                  >
                    <small> (ریال) </small>
                    {{ $price(basketPrice.basket - basketPrice.new_price) }}
                  </h1>
                  <h1
                    cass="ml-3"
                    v-else-if="basketPrice.basket - basketPrice.new_price < 0"
                  >
                    <small> (ریال) </small>
                    {{ $price(basketPrice.new_price - basketPrice.basket) }}
                  </h1>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" class="text-center mt-4">
              <v-icon>notifications_active</v-icon>
              <br />
              <h1 v-text="check_price"></h1>
            </v-col>
          </v-row>
        </v-col>
        <v-col>
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" class="text-center">
          <amp-input
            text="اعمال تخفیف (درصدی)"
            cClass="ltr-item"
            v-model="discount"
            rules="percent"
          />

          <h1 class="grey lighten-3 pa-2 ma-1 font_10">
            در صورت اعمال تخفبف چنانچه دسترسی مربوط را داشتید تخفیف اعمال و
            چنانچه
            <span class="primary--text font_12"> مدیر و یا سرپرست شما </span>

            دسترسی به این بخش را داشته باشد وظیفه  برای آنها تعریف میشود و
            <span class="primary--text font_12">
              در غیر این صورت تخفیف اعمال نمیشود
            </span>
          </h1>
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
              :disabled="loading"
              :loading="loading"
              height="40"
              @click="updateBasket"
              color="teal darken-1 "
              class="ma-1"
              text="به روز رسانی سبد خرید"
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
    priceDialog: {
      require: false,
      default: false,
    },
    basketPrice: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    headers: [],
    loading: false,
    discount:""
  }),
  computed: {
    check_price() {
      let price = this.basketPrice.basket - this.basketPrice.new_price;
      if (price > 0) {
        return ` چنانچه کاربر تراکنش در انتظار پرداخت نداشته باشد مبلغ  
         ${this.$price(price)}
         (ریال) به کیف پول برگشت داده میشود`;
      }
      if (price < 0) {
        price = this.basketPrice.new_price - this.basketPrice.basket;
        return `کاربر میبایست مبلغ  ${this.$price(
          price
        )} (ریال) را برای مابه التفاوت پرداخت کند`;
      }
      if (price == 0) {
        return `اختلاف قیمت وجود ندارد`;
      }
    },
  },
  methods: {
    closeDialog() {
      this.priceDialog.show = false;
      this.priceDialog.items = null;
    },
    updateBasket() {
      this.$emit("updateBasket", this.discount);
      this.closeDialog();
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
