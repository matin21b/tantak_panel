<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input text="عنوان وظیفه" v-model="form.title" rules="require" />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="دسته بندی"
            v-model="form.category"
            rules="require"
            :items="categorys"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            text="برای"
            v-model="for_person"
            :items="for_items"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3">
          <amp-select
            v-if="for_person == 'role'"
            multiple
            text="انتخاب نقش"
            v-model="form.role_ids"
            :items="roles"
            rules="require"
          />
          <UserSelectForm
            v-else
            text="انتخاب کاربر"
            v-model="user"
            url="user"
            rules="require"
            :role-id="[]"
          />
        </v-col>

        <v-col cols="12" md="2">
          <amp-jdate
            text="تاریخ شروع "
            :is-number="true"
            v-model="form.start_task"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-jdate
            text="تاریخ پایان"
            :is-number="true"
            v-model="form.end_task"
          />
        </v-col>

        <v-col cols="12" md="2">
          <amp-input text="اولویت" cClass="ltr-item" v-model="form.sort" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input text=" لینک کامل" v-model="form.link" rules="" />
        </v-col>
        <v-col cols="12" md="2">
          <AmpUploadFile title="بارگذاری فایل" v-model="form.file" />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input text=" مکان" v-model="form.place" />
        </v-col>
        <v-col cols="12" md="12">
          <amp-textarea text="توضیحات " v-model="form.text" :rows="5" />
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
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  props: {
    modelId: { default: null },
  },
  components: { UserSelectForm },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/task/insert",
    updateUrl: "/task/update",
    showUrl: "/task/show",
    categorys: [],
    for_person: "user",
    for_items: [
      { text: "کاربر", value: "user" },
      { text: "نقش", value: "role" },
    ],
    user: [],
    roles: [],
    selected: {},
    form: {
      file: "",
      link: "",
      text: "",
      sort: "",
      title: "",
      place: "",
      category: "",
      end_task: "",
      start_task: "",
      user_get_id: "",
      role_ids: [],
    },
  }),

  beforeMount() {
    this.loadCatgurys();
  },
  watch: {
    for_person() {
      if (this.for_person == "role") {
        this.$store.dispatch("setting/getRoleServer");
      }
    },
  },
  mounted() {
    this.setRole();
    if (this.modelId) {
      this.loadData();
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      if (this.for_person == "user") {
        form.user_get_id = this.user[0].id;
        form.role_ids = [];
      } else {
        form.user_get_id = "";
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
          for (let i in response.data) {
            this.form[i] = response.data[i];
          }
          if (response.data.roles.length > 0) {
            this.for_person = "role";
            this.form.role_ids = response.data.roles.map((x) => x.id);
          } else {
            this.for_person = "user";
          }
          this.user = response.data.user_get;
          // response = response.model;
          // this.form["id"] = response.id;
          // this.form.key = response.key;
          // this.form.value = response.value;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadCatgurys() {
      this.$reqApi("/category-task")
        .then((response) => {
          let items = [];
          let data = response.model.data;
          data.forEach((element) => {
            items.push({
              text: element.value,
              value: element.value,
            });
          });
          this.categorys = items;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    setRole() {
      let roles = this.$store.state.setting.roles;
      let user_role = "5246f14d-1906-4e34-a412-8fb689d20f23";
      let items = [];
      roles.forEach((x) => {
        if (x.id != user_role) {
          items.push(x);
        }
      });
      this.roles = items;
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
