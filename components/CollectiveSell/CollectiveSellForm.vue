<template>
  <div>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense>
          <v-col cols="12" md="3">
            <amp-select
              :disabled="Boolean(modelId)"
              text="انتخاب شعبه"
              rules="require"
              :items="branch_items"
              v-model="form.branch_id"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              text="اولویت فروش"
              rules="require,number"
              v-model="form.priority"
              class="ltr-item"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="12"> </v-col>
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
  </div>
</template>

<script>
import AmpSelect from "../Base/AmpSelect.vue";
export default {
  components: { AmpSelect },
  props: {
    roleId: { default: null },
    modelId: { default: null },
    path: { default: "/collective-sell" },
    showUrl: { default: "/collective-sell/show" },
    createUrl: { default: "/collective-sell/insert" },
    updateUrl: { default: "/collective-sell/update" },
  },
  data: () => ({
    valid: false,
    loading: false,
    headers: [],
    branch_items: [],
    actions: [],
    title: "ناحیه ها",
    form: {
      branch_id: "",
      priority: "",
    },
  }),
  mounted() {
    this.loadBranch();
    if (this.modelId) {
      this.loadData();
    }
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
          this.form.branch_id = response.model.branch_id;
          this.form.priority = response.model.priority;
          this.loading = false;
        })
        .catch((error) => {
          // this.redirectPage();
          this.loading = false;
        });
    },
    loadBranch() {
      this.$reqApi("/branch", { row_number: 50000 })
        .then((res) => {
          res.model.data.map((x) => {
            this.branch_items.push({
              text: x.name,
              value: x.id,
            });
            this.loading = false;
          });
        })
        .catch((err) => {
          this.loading = false;
          return err;
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

<style>
</style>