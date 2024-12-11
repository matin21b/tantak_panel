<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">
      <!-- <v-col cols="12" md="3">
        <amp-select
          text="بابت"
          :items="$store.state.setting.basic_information.for_wallet"
          rules="require"
          v-model="form.for_title"
        />
      </v-col> -->
      <v-col cols="12" md="3">
        <amp-select
          :items="code_type"
          text="نوع کد"
          v-model="form.type"
          rules="require"
        />
      </v-col>
      <v-col cols="12" md="3" v-if="form.type">
        <amp-input
          v-if="form.type == 'percentage'"
          text="درصد تخفیف"
          v-model="form.value"
          rules="require,percent"
        />
        <amp-input
          v-if="form.type == 'amount'"
          text="مقدار تخفیف (ریال)"
          v-model="form.value"
          rules="require,price"
          is-price
        />
      </v-col>

  
      <v-col cols="12" md="3">
        <amp-select
          text="عمومی"
          :items="$store.state.static.bool_en"
          rules="require"
          v-model="form.public"
        ></amp-select>
      </v-col>
      <v-col cols="12" md="3" v-if="!form.public">
        <amp-select
          text="برای "
          :items="$store.state.static.discount_for"
          rules="require"
          v-model="form.send_in"
        ></amp-select>
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="form.send_in == 'countract' && !form.public"
      >
        <amp-autocomplete
          multiple
          rules="require"
          text="انتخاب قرارداد"
          :items="contract_ids"
          v-model="form.contract_ids"
        />
      </v-col>
      <v-col cols="12" md="3" v-if="form.send_in == 'user' && !form.public">
        <amp-autocomplete
          multiple
          rules="require"
          text="انتخاب کابر"
          :items="users"
          v-model="form.user_ids"
        />
      </v-col>
      <v-col cols="12" md="3" v-if="form.send_in != 'custom'">
        <amp-input
          rules="number,require"
          text="حداکثر استفاده "
          v-model="form.coupon_usage_limit"
          cClass="ltr-item"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="کد تخفیف"
          v-model="form.code"
          rules="require"
          cClass="ltr-item"
        />
      </v-col>
      <v-col cols="12" md="3" v-if="form.send_in != 'custom'">
        <amp-input
          text="حداکثر استفاده برای کاربر"
          rules="number,require"
          v-model="form.user_usage_limit"
          cClass="ltr-item"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-jdate
          text=" تاریخ شروع "
          rules="require"
          v-model="form.start_at"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-jdate
          text="تاریخ پایان"
          rules="require"
          :min="now"
          v-model="form.end_at"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-input text="ترتیب" v-model="form.sort" cClass="ltr-item" />
      </v-col>
      <v-col cols="12" md="12">
        <amp-textarea :rows="3" text="توضیحات" v-model="form.description" />
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
        :disabled="!valid || loading"
        :loading="loading"
      ></amp-button>
    </v-row>
  </v-form>
</template>

<script>
let jmoment = require("moment");
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
      loading: false,
      code_type: [
        { text: "درصد", value: "percentage" },
        { text: "مقدار", value: "amount" },
      ],
      insurance: [],
      contract_ids: [],
      company: [],
      users: [],
      show_insurance_type: false,
      now: "",
      form: {
        for_title: "",
        type: "",
        code: "",
        send_in: "",
        start_at: "",
        end_at: "",
        insurance_id: "",
        status: "active",
        company_id: "",
        value: "",
        coupon_usage_limit: "",
        user_usage_limit: "",
        description: "",
        sort: "",
        public: true,
        contract_ids: [],
        user_ids: [],
      },
    };
  },

  mounted() {
    this.now = jmoment().format("YYYY-MM-DD");
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      this.loading = true;

      if (this.form.public == "yes") {
        this.form.public = true

      }else{
        this.form.public = false
      }
      if (this.form.code.length > 7) {
        this.loading = false;
        return this.$toast.error("کد تخفیف نمیتواند بیشتر از 7 حرف باشد");
      }
      let form = { ...this.form };
      if (this.modelId) {
        form["id"] = this.modelId;
      }
      let url = this.modelId
        ? "/discount-code/update"
        : "/discount-code/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;

          this.back();
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/discount-code/show", { id: this.modelId })
        .then((res) => {
          if (Boolean(res.data.for_title)) {
            this.form.for_title = res.data.for_title.toString();
          }
          this.form.type = res.data.type;
          this.form.send_in = res.data.send_in;
          this.form.code = res.data.code;
          this.form.start_at = res.data.start_at;
          this.form.end_at = res.data.end_at;
          this.form.insurance_id = res.data.insurance_id;
          this.form.status = res.data.status;
          this.form.company_id = res.data.company_id;
          this.form.amount = res.data.amount;
          this.form.percent = res.data.percent;
          this.form.coupon_usage_limit = res.data.coupon_usage_limit;
          this.form.user_usage_limit = res.data.user_usage_limit;
          this.form.description = res.data.description;
          this.form.sort = res.data.sort;
          this.form.public = res.data.public;
          this.form.contract_ids = res.data.contracts.map((x) => x.id);
          this.form.user_ids = res.data.users.map((x) => x.id);
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadContract() {
      this.loading = true;

      this.$reqApi("/contract", { row_number: 2000 })
        .then(async (response) => {
          this.contract_ids = response.model.data.map((x) => ({
            text: x.fa_name + " | " + x.company_fa_name,
            value: x.id,
          }));
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadInsurance() {
      this.loading = true;
      this.$reqApi("/insurance", { row_number: 2000 })
        .then(async (response) => {
          this.insurance = response.model.data.map((x) => ({
            text: x.fa_name,
            value: x.id,
          }));
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadCompany() {
      this.loading = true;
      this.$reqApi(`/company`, { row_number: 2000 })
        .then(async (response) => {
          this.company = response.model.data.map((x) => ({
            text: "بیمه " + x.fa_name,
            value: x.id,
          }));
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadUser() {
      this.loading = true;
      this.$reqApi("/user", { row_number: 2000 })
        .then(async (response) => {
          this.users = response.model.data.map((x) => {
            let text = "";
            if (x.first_name) {
              if (x.last_name) {
                text = x.first_name + " " + x.last_name;
              } else {
                text = x.first_name;
              }
            } else {
              if (x.last_name) {
                text = x.last_name;
              } else {
                text = x.username;
              }
            }
            return {
              text: text,
              value: x.id,
            };
          });
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/discount-code");
      }
    },
  },
};
</script>