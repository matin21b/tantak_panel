<template>
  <div class="text-center">
    <v-row class="justify-center d-flex mt-2">
      <v-col cols="12" md="8">
        <v-row class="justify-center d-flex mb-2">
          <v-card
            v-if="!loading"
            @click="setSubRoles(x)"
            dark
            :class="parent_id == x.value ? 'selctd-box' : 'card-style'"
            class="pa-2 px-4 ma-2 text-center"
            v-for="(x, i) in parent_categories"
            :key="i"
          >
            <span class="font_12">
              {{ x.text }}
            </span>
          </v-card>

          <v-skeleton-loader
            v-if="loading"
            v-for="n in 6"
            class="ma-2"
            :key="n"
            width="60"
            height="45"
            type="card"
          ></v-skeleton-loader>
        </v-row>
      </v-col>
    </v-row>
    <template v-if="roles.length > 0 && !load_roles">
      <div class="text-center">
        <v-chip
          dark
          :key="index"
          class="ma-2"
          color="orange darken-2"
          @click="selectRole(item.value)"
          v-for="(item, index) in role_list"
          :outlined="roles_id != item.value"
        >
          {{ item.text }}
        </v-chip>
      </div>
    </template>
    <v-col cols="12" class="my-3 text-center" v-if="load_roles">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </v-col>
  </div>
</template>

<script>
export default {
  props: {
    value: { require: false },
  },
  data: () => ({
    load_roles: false,
    loading: true,
    roles: [],
    roles_id: "",
    parent_id: "",
    parent_categories: [],
    categories: [],
    all_roles: [],
    category_id: "",
  }),

  computed: {
    role_list() {
      return this.roles.filter(
        (x) => !Boolean(this.category_id) || x.category_id == this.category_id
      );
    },
  },
  watch: {
    "$store.state.setting.roles"() {
      this.loadData();
    },
  },
  beforeMount() {
    this.$store.dispatch("setting/getRoleServer");
    this.getCategories();
    this.loadData();
    this.roles_id = this.value;
  },
  methods: {
    getCategories() {
      let filter = {
        op: "=",
        key: "category_role",
      };
      this.$reqApi("/setting", { filters: filter, row_number: 30000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.value,
              value: x.id,
            });
          }
          items.unshift({
            text: "همه",
            value: "all",
          });
          this.parent_categories = items;
          this.loading = false;
          this.parent_id = "all"
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadData() {
      let roles = [];
      let categories = {};
      for (
        let index = 0;
        index < this.$store.state.setting.roles.length;
        index++
      ) {
        const element = this.$store.state.setting.roles[index];
        roles.push({ ...element });
      }
      this.roles = roles;
      this.all_roles = roles;
      this.categories = [
        { value: "", text: "همه" },
        ...Object.values(categories),
      ];
    },
    selectCategory(value) {
      this.category_id = value;
      let category = this.categories.find((x) => x.value == value);
      if (category && category.roles && category.roles.length > 0) {
        this.selectRole(category.roles[0]);
      }
    },
    selectRole(value) {
      this.roles_id = value;
      this.$emit("selectRole", value);
    },
    setSubRoles(parent) {
      this.load_roles = true;

      this.parent_id = parent.value;
      if (parent.value == "all") {
        this.roles = this.all_roles;
      } else {
        let roles = this.all_roles;
        let filter = roles.filter((x) => x.category_id == parent.value);
        this.roles = filter;
      }
      setTimeout(() => {
        this.load_roles = false;
      }, 1000);
    },
  },
};
</script>
<style scoped>
.card-style {
  color: #ffffff;
  transition: all 0.8s ease;
  background: linear-gradient(
    to left,
    #25aaecd3,
    #25aaecd3,
    #25aaecd3
  ) !important;
  opacity: 0.7;
  border-radius: 20px !important;
}
.card-style:hover {
  cursor: pointer;
  color: #ffffff;
  opacity: 1;
  transform: scale3d(0.6, 0.6, 0.06) !important;
  background: linear-gradient(
    to bottom,
    #25aaecd0,
    #25aaecd0,
    #0b6694b0
  ) !important;
  transform: scale3d(1.06, 1.06, 1.06) !important;
  transition: all 0.6s ease;
}
.selctd-box {
  cursor: pointer;
  color: #ffffff;
  opacity: 1;
  border-radius: 20px !important;

  background: linear-gradient(
    to bottom,
    #cc1b1bd0,
    #be1919d0,
    #940b0bb0
  ) !important;
  transform: scale3d(1.1, 1.1, 1.1) !important;
}
</style>
