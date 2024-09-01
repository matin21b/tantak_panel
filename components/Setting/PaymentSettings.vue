<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="4">
          <amp-input text="عنوان" v-model="form.value" rules="require" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            text="تعداد چک"
            v-model="demand_note"
            rules="require,number"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-select
            text="  نوع پیش پرداخت"
            v-model="prepaid_type"
            rules="require"
            :items="$store.state.static.prepaid_type"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            v-if="prepaid_type == 'amount'"
            text="مقدار پیش پرداخت"
            v-model="prepaid_amount"
            rules="require,price"
            is-price
          />
          <amp-input
            v-else
            text="مقدار پیش پرداخت"
            v-model="prepaid_amount"
            rules="require,percent"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            text="فاصله بین هر چک (روز)"
            v-model="time_difference"
            rules="require,number"
            cClass="ltr-item"
          />
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button
            large
            icon="redo"
            class="my-1"
            color="error"
            text="انصراف"
            @click="redirectPage()"
          />
          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: { default: null },
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/setting/insert",
    updateUrl: "/setting/update",
    showUrl: "/setting/show",
    demand_note: "",
    prepaid_amount: "",
    prepaid_type: "amount",
    time_difference: "",
    settings: [],
    selected: {},
    form: {
      id: "",
      key: "day_delete_basket ",
      value: "",
    },
  }),

  beforeMount() {},
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      let items = {
        demand_note: this.demand_note,
        prepaid_amount: this.prepaid_amount,
        prepaid_type: this.prepaid_type,
        time_difference: this.time_difference,
      };
      let value_json = JSON.stringify(items);
      form["value_json"] = value_json;
      this.loading = true;
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (!this.modelId) {
            this.$toast.success("اطلاعات ثبت شد");
          } else {
            this.$toast.success("اطلاعات ویرایش شد");
          }
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          response = response.model;
          let json_val = JSON.parse(response.value_json);
          this.demand_note = json_val.demand_note;
          this.prepaid_amount = json_val.prepaid_amount;
          this.prepaid_type = json_val.prepaid_type;
          this.time_difference = json_val.time_difference;
          this.form["id"] = response.id;
          this.form.key = response.key;
          this.form.value = response.value;
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>
