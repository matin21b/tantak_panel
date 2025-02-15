<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input
            text="شماره همراه"
            v-model="form.phone_number"
            rules="require,phone"
            cClass="ltr-item"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text=" دسته بندی"
            v-model="form.category_id"
            rules="require"
            :items="category_contact"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text=" نام مخاطب"
            v-model="form.first_name"
            rules="require"
          />
        </v-col>        <v-col cols="12" md="3">
          <amp-autocomplete
            text="نوع شخص"
            rules="require"
            v-model="form.person_type"
            :items="$store.state.static.person_type"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="نام خانوادگی"
            v-model="form.last_name"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input text="طریقه آشنایی" v-model="form.how_know" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text=" داخلی"
            :items="internal_items"
            v-model="form.internal_id"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.person_type == 'legal'">
          <amp-select
            text="شرکت"
            rules="require"
            v-model="form.company_id"
            :items="companies"
          />
        </v-col>   
          <v-col cols="12" md="3" v-if="form.person_type == 'legal'">
            <amp-input
            text="سمت (پست)"
            rules="require"
            v-model="form.post"
          />
        </v-col>
        <v-col cols="12">
          <amp-textarea text="توضیحات " v-model="form.description" />
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
    createUrl: "/contact/insert",
    updateUrl: "/contact/update",
    showUrl: "/contact/show",
    companies: [],
    settings: [],
    category_contact: [],
    internal_items: [],
    selected: {},
    form: {
      phone_number: "",
      category_id: "",
      first_name: "",
      last_name: "",
      description: "",
      how_know: "",
      internal_id: "",
      person_type: "",
      company_id: "",
      post: "",
    },
  }),

  beforeMount() {
    this.loadInternals();
    this.loadCategouryes();
    this.companiesList();
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      this.loading = true;
      let form = { ...this.form };
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
    loadCategouryes() {
      let filters = {
        key: {
          op: "=",
          value: "category_contact",
        },
      };

      this.$reqApi("/setting", { filters: filters })
        .then((response) => {
          this.category_contact = response.model.data.map((x) => ({
            text: x.value,
            value: x.id,
          }));

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadInternals() {
      this.$reqApi("/internal")
        .then(async (response) => {
          let items = [];
          response.model.data.forEach((x) => {
            items.push({
              text: x.server_name + " | " + x.start_port + " - " + x.end_port,
              value: x.id,
            });
          });
          this.internal_items = items;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl, { id: this.modelId })
        .then(async (response) => {
          let data = response.model;
          for (let i in data) {
            this.form[i] = data[i];
          }
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    companiesList(){
      this.loading = true
this.$reqApi("company").then((res)=>{
let items  = []
for (let i = 0; i < res.model.data.length; i++) {
  const x = res.model.data[i];
  items.push({
    text:x.fa_name + " | " + x.en_name,
    value:x.id
  })
  this.companies = items
  this.loading = false

}
}).catch((err)=>{
  this.loading = false
})
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
