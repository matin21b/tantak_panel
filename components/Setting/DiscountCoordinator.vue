<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense class="d-flex justify-center">
        <v-col cols="12" md="2">
          <amp-autocomplete
            text="نقش"
            rules="require"
            v-model="form.role_id"
            :items="roles"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            is-price
            text="تخفیف"
            v-model="form.discount"
            rules="percent"
          />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input
            is-number
            text="ترتیب "
            v-model="form.sort"
            cClass="ltr-item"
            rules="number"
          />
        </v-col>
        <v-col cols>
          <amp-textarea
            :rows="1"
            text="توضیحات"
            v-model="form.description"
          ></amp-textarea>
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
    createUrl: "/discount-coordinator/insert",
    updateUrl: "/discount-coordinator/update",
    showUrl: "/discount-coordinator/show",
    roles: [],
    selected: {},
    form: {
      role_id: "",
      sort: "",
      discount: "",
      description: "",
    },
  }),

  beforeMount() {},
  mounted() {
    this.$store.dispatch("setting/getRoleServer");
    this.getRole();
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
          for (let key in response.data) {
            this.form[key] = response.data[key];
          }
          this.form.role_id = response.data.role_id;
          this.loading = false;
        })
        .catch((error) => {
          this.redirectPage();
          this.loading = false;
        });
    },
    getRole() {
      let target_ids = [
        "38d9a458-5aba-4274-a71f-877e2bf655d4",
        "7e6e5f8b-84db-48f5-bd93-7e38fcc30c2e",
        "b659c438-531d-4aab-93e0-58f5835c1cb2",
      ];
      let roles = this.$store.state.setting.roles;
      let items = [];
      for (let index = 0; index < roles.length; index++) {
        const x = roles[index];
        target_ids.filter((y) => {
          if (y == x.id) {
            items.push({
              text: x.name,
              value: y,
            });
          }
        });
      }
      this.roles = items;
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    }
  },
};
</script>
