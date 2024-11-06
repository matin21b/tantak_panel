<template>
  <div class="mt-15 pt-15 main_contact">
    <v-row class="justify-center align-center">
      <v-col cols="12" md="6">
        <v-card class="d-flex align-center">
          <div>
            <img :src="$store.state.logo" width="auto" height="60" class="bg_image" />
          </div>

          <v-card width="100%" outlined class="elevation-0">
            <v-col cols="12" class="text-center 3">
              <v-icon> </v-icon>
              <h1 class="my-3">
                {{ user }}
              </h1>
              <v-divider v-for="i in 2" :key="i"></v-divider>
            </v-col>
            <!-- <v-alert icon="account_circle" class="primary lighten-1" dark prominent>
      <strong class="font_16">
    
      </strong>
    </v-alert> -->
            <v-card-text v-if="!loading">
              <v-card class="pa-2 my-2 elevation-1" outlined>
                <h1>
                  #
                  {{ data.text }}
                </h1></v-card
              >
              <v-card class="pa-2 my-2 elevation-1" outlined>
                <h1>
                  مبلغ پرداختی :‌
                  {{ $price(data.price) }} ریال
                </h1>
              </v-card>
              <v-card class="pa-2 my-2 elevation-1" outlined>
                <h1>شماره تراکنش : {{ data.transaction_number }}</h1>
              </v-card>
              <v-card class="pa-2 my-2 elevation-1" outlined>
                <h1>
                  وضعیت تراکنش :
                  {{
                    $getItemEnum($store.state.static.status_payment_invitor, data.status)
                  }}
                </h1>
              </v-card>
            </v-card-text>

            <v-row class="mt-3 mb-2 justify-center" v-if="this.status == 'wait'">
              <amp-button
                text="ادامه پرداخت"
                icon="task_alt"
                @click="paymentPortal"
                color="success"
                class="ma-2"
                :loading="loading_pay"
                :disabled="loading_pay"
              />
            </v-row>

            <div v-else class="text-center my-15">
              <v-progress-circular color="grey" indeterminate></v-progress-circular>
            </div>
          </v-card>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  layout: "empty",
  data() {
    return {
      data: {},
      user: "",
      random_id: "",
      loading: true,
      loading_pay: false,
      title: "پرداخت",
      status: "",
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    if (Boolean(this.$route.query.random_id)) {
      this.random_id = this.$route.query.random_id;
      this.showDetails(this.random_id);
    }
  },
  methods: {
    showDetails(id) {
      this.$reqApi("/shop/payment/show", { link_id: id })
        .then((res) => {
          this.data = res.data;
          if (Object.keys(this.data.user).length > 0) {
            if (Boolean(this.data.user.first_name && this.data.user.last_name)) {
              this.user = this.data.user.first_name + " " + this.data.user.last_name;
            } else {
              this.user = this.data.user.username;
            }
          }
          this.status = this.data.status;
          this.loading = false;
        })

        .catch((err) => {
          this.loading = false;
        });
    },
    paymentPortal() {
      this.loading_pay = true;
      let url = "product-request/pay";
      this.$reqApi(url, { random_id: this.random_id })
        .then((res) => {
          window.open(res.url, "_blank");
          this.loading_pay = false;
        })
        .catch((err) => {
          this.loading_pay = false;
        });
    },
  },
};
</script>
<style scoped>
h1 {
  margin-top: 8px !important;
  font-size: 15px !important;
}
.card-style {
  border: 7px double #00000083 !important;
  border-radius: 8px;
}
</style>
