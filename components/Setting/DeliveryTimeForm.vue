<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loader"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2 d-flex justify-center">
      <v-col cols="12" md="3">
        <amp-input
          cClass="ltr-item"
          text="ساعت شروع "
          v-model="start"
          rules="number,require"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          cClass="ltr-item"
          text="ساعت پایان"
          v-model="end"
          rules="number,require"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          cClass="ltr-item"
          text="ترتیب"
          v-model="form.sort"
          rules="number"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          text="وضعیت"
          v-model="form.status"
          :items="$store.state.static.status"
          rules="require"
        />
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
        :text="modelId ? 'ویرایش' : 'افزودن'"
        type="submit"
        icon="done"
        :disabled="!valid || loader"
        class="ma-1"
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
    updateUrl: { default: "/delivery-time/update" },
    createUrl: { default: "/delivery-time/insert" },
    showUrl: { default: "/delivery-time/show" },
  },
  data() {
    return {
      valid: false,
      loader: false,
      start: "",
      end: "",
      form: {
        status: "",
        sort: "",
      },
    };
  },
  computed: {},
  watch: {
    location() {
      if (this.location.length > 0) {
        this.form.lat = this.location[0].toString();
        this.form.long = this.location[1].toString();
      }
    },
    "form.province_id"() {
      this.loadCitis(this.form.province_id);
    },
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      this.loader = true;
      if (Boolean(this.modelId)) {
        this.form["id"] = this.modelId;
      }
      let form = this.$copyForm(this.form);
      form["range_time"] = this.start + "," + this.end;
      let url = this.modelId ? this.updateUrl : this.createUrl;
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
          }
          this.loader = false;
          this.back();
        })
        .catch((err) => {
          this.loader = false;
        });
    },
    loadData() {
      this.loader = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then((response) => {
          this.loader = false;
          this.form.status = response.model.status;
          this.form.sort = response.model.sort;
          let substrings = response.model.range_time.split(",");
          let numbers = substrings.map((substring) => Number(substring));
          this.start = numbers[0];
          this.end = numbers[1];
        })
        .catch((error) => {
          this.loader = false;
        });
    },
    loadState() {
      return new Promise((response, rej) => {
        let filters = {
          level: {
            op: "=",
            value: "province",
          },
        };
        this.$reqApi("/shop/country-division", {
          filters: filters,
          row_number: 3000000,
        })
          .then((res) => {
            response(res.model.data);
          })
          .catch((err) => {
            return err;
          });
      });
    },
    filterProvince(id) {
      return new Promise((res, rej) => {
        let filter = {
          id: id,
        };
        this.$reqApi("/shop/country-division", { filters: filter }).then((res) => {
          if (res.model.data) {
            this.form.province_id = res.model.data[0].cd2_id;
            setTimeout(() => {
              this.form.country_division_id = res.model.data[0].id;
            }, 500);
          }
        });
      });
    },
    loadCitis(id) {
      this.citis = [];
      let filters = {
        parent_id: {
          op: "=",
          value: id,
        },
      };
      if (id) {
        let data = [];
        this.$reqApi("/shop/country-division", {
          filters: filters,
          row_number: 300000,
        }).then((res) => {
          data = res.model.data;
          data.filter((x) => {
            this.citis.push({
              text: x.name,
              value: x.id,
            });
          });
        });
      }
    },
    back() {
      this.$router.back();
    },
  },
};
</script>
