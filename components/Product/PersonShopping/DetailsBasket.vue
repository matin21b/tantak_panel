<template>
  <v-dialog v-model="dialog" persistent max-width="800">
    <v-card style="overflow: hidden !important" class="pa-5">
      <v-row class="d-flex align-center pa-5 mb-4">
        <h1 class="font_18">جزییات سبد خرید</h1>
        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon> close </v-icon>
        </v-btn>
      </v-row>
      <v-row class="d-flex justify-center mb-8">
        <v-col cols="12" md="3" v-if="step == 2">
          <amp-button
            text="موجودی سبد"
            height="38"
            block
            icon="local_mall"
            color="blue-grey"
            @click="step--"
            class="ma-1"
          />
        </v-col>

        <v-col cols="12" md="3" v-if="step == 1">
          <amp-button
            icon="document_scanner"
            text="تراکنش ها"
            height="38"
            block
            color="blue-grey"
            @click="step++"
            class="ma-1"
          />
        </v-col>
      </v-row>
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text
            style="border-right: 3px solid orange"
            v-for="(x, i) in data"
            :key="i"
            class="pa-3 elevation-1 my-4"
            outlined
          >
            <h1 v-if="Boolean(x.product)">
              <small> {{ i + 1 }} - </small>
              {{ x.product.name }}

              <br />
              <small>
                {{ x.information }}
              </small>
            </h1>
            <h1 v-else>
              <small> {{ i + 1 }} - </small>
              {{ x.information }}
              <small> ( پکیج ) </small>
            </h1>
            <h1>
              <v-row class="justify-space-between pa-3">
                <small>
                  بارکد :‌
                  {{ x.full_barcode }}
                </small>
                <small> قیمت :‌ {{ $price(x.price) }} ریال </small>
                <small>
                  تعداد :‌
                  {{ x.number }}
                </small>
                <small>
                  جمع کل :‌
                  {{ $price(x.price * x.number) }} ریال
                </small>
              </v-row>
            </h1>
          </v-card-text>
        </v-window-item>

        <v-window-item :value="2">
          <div
            class="text-center"
            v-if="Object.keys(transactions).length > 0"
          ></div>
          <div
            class="text-center"
            v-if="
              Object.keys(transactions).length > 0 &&
              transactions.payments.length == 0 &&
              transactions.wallet_transactions.length == 0
            "
          >
            <v-icon size="45"> receipt_long </v-icon>
            <h1 class="font_15 grey--text">تراکنشی ثبت نشده</h1>
          </div>
        </v-window-item>
      </v-window>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: [],
    },
    transactions: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      valid: true,
      loading: false,
      form: {
        status: "",
        file: "",
        message: "",
        id: "",
      },
      items: [],
      step: 1,
    };
  },
  mounted() {
    console.log("transactions? ", this.transactions);
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
