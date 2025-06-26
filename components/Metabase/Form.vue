<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="px-15">
        <v-col cols="12" md="6">
          <amp-input text="عنوان  " v-model="form.title" rules="require" />
        </v-col>
        <v-col cols="12" md="6">
          <amp-autocomplete
            text="نقش های مرتبت"
            chips
            rules="require"
            multiple
            v-model="form.role_ids"
            :items="$store.state.setting.roles"
          />
        </v-col>
        <v-col cols="12" md="4">
          <amp-select
            :items="$store.state.static.status"
            text="وضعیت"
            v-model="form.status"
          />
        </v-col>

        <v-col cols="12" md="4">
          <amp-select
            text="نوع داشبورد"
            rules="require"
            v-model="form.type"
            :items="this.$store.state.static.metabase_type"
          />
        </v-col>

        <v-col cols="12" md="4">
          <amp-input
            cClass="ltr-item"
            text="شناسه"
            v-model="form.metabase_id"
            rules="require,number"
          />
        </v-col>

        <v-col cols="12" md="4">
          <amp-select
            text="فیلتر بر اساس شماره فرد استفاده کننده"
            rules="require"
            v-model="form.send_user_phone"
            :items="this.$store.state.static.send_user_phone"
          />
        </v-col>

        <v-col cols="12" md="4">
          <amp-input
            text="عنوان فیلتر شماره فرد در متابیس"
            v-model="form.body_user_phone"
            v-if="form.send_user_phone === true"
            rules="require"
            placeholder="مثال  : phone_number"
          />
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="12" md="10">
          <v-card class="pa-5 elevation-5" outlined>
            <v-banner>
              <div class="d-flex align-center">
                <h1 class="font_20">
                  پارامتر های ورودی

                  <br />
                  <small class="font_11 grey--text">
                    ; در ثبت پارامتر , کلید های وارد شده فقط باید انگلیسی باشند
                    مثال : user_name , first_name , ...
                  </small>
                </h1>

                <v-spacer></v-spacer>
                <v-btn @click="addParameter" dark color="blue-grey">
                  <h1 class="font_15">ثبت پارامتر <v-icon> add</v-icon></h1>
                </v-btn>
              </div>
            </v-banner>
            <v-row class="mt-3">
              <v-col
                class=""
                cols="12"
                v-for="(x, i) in metabases_parameters"
                :key="i"
              >
                <v-row class="ma-0">
                  <v-col cols="12" md="1" class="pa-0 text-center">
                    <v-chip>
                      <h1>
                        {{ i + 1 }}
                      </h1>
                    </v-chip>
                  </v-col>
                  <v-col cols="12" md="3" class="pa-0 text-center">
                    <amp-input
                      text="عنوان فیلتر به انگلیسی"
                      v-model="x.en_name"
                      placeholder="مثال  : phone_number"
                      cClass="ltr-item"
                    ></amp-input>
                  </v-col>
                  <v-col cols="12" md="3" class="pa-0 text-center">
                    <amp-input
                      text="عنوان فیلتر به فارسی"
                      v-model="x.fa_name"
                      placeholder="مثال  : شماره کاربر"
                      cClass="ltr-item"
                    ></amp-input>
                  </v-col>
                  <v-col cols="12" md="3" class="pa-0 text-center">
                    <amp-input
                      text="نوع"
                      v-model="x.type"
                      placeholder="مثال  : phone, text"
                      cClass="ltr-item"
                    ></amp-input>
                  </v-col>
                  <v-col cols="12" md="2" class="pa-0 text-center">
                    <v-btn @click="deleteParameters(i)" icon>
                      <v-icon size="20" color="red">close</v-icon></v-btn
                    >
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center mt-5">
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
    createUrl: "/metabase/insert",
    updateUrl: "/metabase/update",
    showUrl: "/metabase/show",
    metabases_parameters: [],
    selected: {},
    form: {
      type: "",
      title: "",
      status: "",
      metabase_id: "",
      metabase_type: "",
      body_user_phone: "",
      request_body: [],
      role_ids: [],
    },
  }),

  beforeMount() {
    this.$store.dispatch("setting/getRoleServer");
  },
  mounted() {
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      if (this.metabases_parameters) {
        form.request_body = this.metabases_parameters;
      }
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
          const res = response.model;
          res.request_body.map((item) => {
            this.metabases_parameters.push({
              en_name: item.en_name,
              fa_name: item.fa_name,
              type: item.type,
            });
          });
          for (let key in res) {
            this.form[key] = res[key];
          }
          this.form.role_ids = res.roles.map((x) => x.id);
          // for (let i = 0; i < res.request_body.length; i++) {
          //   const x = res.request_body[i];
          //   this.metabases_parameters.push({ en_name: x.en_name , fa_name: x.fa_name , type: x.type });
          // }
          this.loading = false;
          // this.form["id"] = response.id;
          // this.form.key = response.key;
          // this.form.value = JSON.parse(response.value);
          // this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    addParameter() {
      this.metabases_parameters.push({ en_name: "", fa_name: "", type: "" });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
    deleteParameters(index) {
      this.metabases_parameters.splice(index, 1);
    },
  },
};
</script>
