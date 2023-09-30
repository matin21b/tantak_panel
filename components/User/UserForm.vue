<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="نام" rules="require" v-model="form.first_name" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="نام خانوادگی"
            rules="require"
            v-model="form.last_name"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            class="ltr-item"
            text="شماره همراه"
            rules="require,phone"
            v-model="form.username"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            type="password"
            text="رمز عبور"
            class="ltr-item"
            v-model="form.password"
            :rules="modelId ? 'password' : 'require,password'"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="!Boolean(roleId)">
          <amp-autocomplete
            text="نقش"
            chips
            multiple
            rules="require"
            v-model="form.role_id"
            :items="$store.state.setting.roles"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="وضعیت"
            rules="require"
            v-model="form.status"
            :items="$store.state.static.status"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="کد ملی"
            rules="nationalCode"
            :is-number="true"
            v-model="form.national_code"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-jdate
            text="تاریخ تولد"
            :is-number="true"
            v-model="form.birth_date"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-input
            text="پست الکترونیکی"
            cClass="ltr-item"
            rules="email"
            v-model="form.email"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="استان"
            v-model="form.province_id"
            :items="province"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="شهر"
            v-model="form.country_division_id"
            :items="citis"
            :disabled="citis.length > 0 ? false : true"
          />
        </v-col>
        <v-col cols="12" md="12">
          <v-divider></v-divider>
        </v-col>
        <v-col cols="12" md="4">
          <amp-textarea
            text="توضیحات"
            v-model="form.description"
          ></amp-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <amp-textarea text="شغل" v-model="form.job"></amp-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <amp-textarea text="آدرس" v-model="form.address"></amp-textarea>
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
    roleId: { default: null },
    modelId: { default: null },
    path: { default: "/user" },
    showUrl: { default: "/user/show" },
    createUrl: { default: "/user/insert" },
    updateUrl: { default: "/user/update" },
  },
  data: () => ({
    valid: false,
    loading: false,
    supervisor_status: "",
    supervisor: [],
    sales_manager: [],
    psychologist: [],
    supervisor_status_items: [],
    province: [],
    citis: [],
    form: {
      sort: -1,
      username: "",
      password: "",
      last_name: "",
      first_name: "",
      role_id: [],
      birth_date: "",
      address: "",
      job: "",
      email: "",
      description: "",
      national_code: "",
      province_id: "",
      country_division_id: "",
      status: "active",
    },
  }),
  watch: {
    "form.province_id"() {
      this.loadCitis(this.form.province_id);
    },
  },
  mounted() {
    if (Boolean(this.roleId)) {
      this.form.role_id = [this.roleId];
    }
    if (this.modelId) {
      this.loadData();
    }
    this.loadState().then((res) => {
      res.filter((x) => {
        this.province.push({
          text: x.name,
          value: x.id,
        });
      });
    });
  },
  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = this.createUrl;
      if (this.modelId) {
        url = this.updateUrl;
        form["id"] = this.modelId;
      }
      form.username = this.$FarsiToEnglishNumber(form.username);
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success("اطلاعات ویرایش شد");
          } else {
            this.$toast.success("اطلاعات ثبت شد");
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
          this.form.id = this.modelId;
          this.form.job = response.model.job;
          this.form.email = response.model.email;
          this.form.status = response.model.status;
          this.form.address = response.model.address;
          this.form.username = response.model.username;
          this.form.last_name = response.model.last_name;
          this.form.first_name = response.model.first_name;
          this.form.description = response.model.description;
          this.form.birth_date = response.model.birth_date;
          this.form.province_id = response.model.province_id;
          this.form.national_code = response.model.national_code;
          setTimeout(() => {
            this.form.country_division_id = response.model.country_division_id;
          }, 400);
          if (Array.isArray(response.model.roles)) {
            this.form.role_id = response.model.roles.map((x) => x.id);
          }

          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
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
        this.$reqApi("/country-division", {
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
    loadCitis(id) {
      this.citis = [];
      if (id) {
        this.$reqApi("/country-division/get-cities", {
          id: id,
          row_number: 300000,
        }).then((res) => {
          res.filter((x) => {
            this.citis.push({
              text: x.name,
              value: x.id,
            });
          });
        });
      }
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
