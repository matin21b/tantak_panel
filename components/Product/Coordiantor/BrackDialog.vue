<template>
  <div>
    <v-dialog
      persistent
      v-model="brackDialog.show"
      :model-id="brackDialog.items"
      width="800"
    >
      <v-card
        higth="300"
        class="card-dialog py-2 "
      >
        <v-col cols="12" class="text-center mb-7">
          <h1 class="font_16 mt-10">از ویرایش پکیج اطمینان دارید ؟‌</h1>
          <small class="font_14 mb-4">
            در صورت تایید , پکیج از لیست مربوط حذف شده و محصولات آن به لیست
            محصولات سبد خرید اضافه میگردد
          </small>
        </v-col>
        <v-row dense>
          <v-col
            cols="12"
            md="12"
            v-for="(item, index) in productPackage"
            :key="index"
          >
            <v-card class="mx-4 pa-3 mb-2 elevation-3">
              <v-row class="d-flex justify-center align-center">
                <v-col cols="2" class="text-center pa-5">
                  <v-img
                    class="size-img justify-center"
                    :src="$getImage(item.main_image)"
                    height="auto"
                  />
                </v-col>
                <v-spacer></v-spacer>
                <small>
                  {{ item.name }}
                </small>
                <v-spacer></v-spacer>
                <small>
                  {{ item.information }}
                </small>
                <v-spacer></v-spacer>
                <small class="ml-4">
                  <small> (ریال) </small>
                  {{ $price(item.price) }}
                </small>
              </v-row>
              <v-row class="text-center px-4 pb-2">
                <v-col cols="12">
                  <v-divider></v-divider>
                </v-col>
                <h1 class="font_10">
                  مجموع قیمت :‌
                  <small>(ریال)</small>
                  {{ $price(item.number * item.price) }}
                </h1>
                <v-spacer></v-spacer>

                <h1 class="font_10">
                  تعداد محصول موجود در پکیج :
                  {{ item.number }}
                </h1>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row class="d-flex justify-center mt-4 mb-1">
          <v-col cols="2">
            <amp-button
              block
              height="40"
              @click="closeDialog"
              color="red darken-1 "
              class="ma-1"
              text="  انصراف"
            />
          </v-col>
          <v-col cols="2">
            <amp-button
              block
              :disabled="loading"
              :loading="loading"
              height="40"
              @click="continueBreack"
              color="teal darken-1 "
              class="ma-1"
              text="تایید و ادامه"
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
    brackDialog: {
      require: false,
      default: false,
    },
    productPackage: {
      require: false,
      default: [],
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    headers: [],
    loading: false,
  }),

  methods: {
    closeDialog() {
      this.brackDialog.show = false;
      this.brackDialog.items = null;
    },
    continueBreack() {
      this.$emit("continueBreack", this.productPackage);
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
