<template>
  <v-row>
    <v-dialog v-model="dialog" persistent max-width="450">
      <v-card
        :disabled="loading"
        class="elevation-0 pa-4"
        style="overflow: hidden !important"
      >
        <v-row class="mx-2 mt-1 align-center mb-4">
          <h1 class="font_16 mr-2">{{ title }}</h1>
          <v-spacer></v-spacer>
          <v-col cols="12">
            <v-divider v-for="i in 3" :key="i"></v-divider>
          </v-col>
          <v-col cols="12">
            <v-form class="my-3">
              <amp-autocomplete
                multiple
                v-if="sectionName == 'Product'"
                text="محصول مورد نظر ار انتخاب کنید"
                rules="require"
                :items="products"
                v-model="form.section_ids"
              ></amp-autocomplete>
              <amp-autocomplete
                multiple
                v-if="sectionName == 'Package'"
                text="پکیج مورد نظر ار انتخاب کنید"
                rules="require"
                :items="package_list"
                v-model="form.section_ids"
              ></amp-autocomplete>
              <v-card width="100%">
                <v-img />
                <div></div>
              </v-card>
              <!-- <UserSelectForm
                v-if="!this.$checkRole(this.$store.state.auth.role.admin_id) || $checkRole(this.$store.state.auth.role.admin_call_center_id)"
                text="انتخاب کاربر"
                v-model="user"
                url="/user/list-employee"
                rules="require"
              /> -->
            </v-form>
          </v-col>

          <v-row class="d-flex justify-center">
            <v-col cols="12" md="4">
              <amp-button
                text="تایید"
                height="38"
                block
                color="teal darken-2"
                @click="submit"
                class="ma-1"
                :loading="loading"
                :disabled="loading || !valid"
              />
            </v-col>
            <v-col cols="12" md="4">
              <amp-button
                text="انصراف"
                height="38"
                block
                color="red darken-2"
                @click="closeDialog"
                class="ma-1"
              />
            </v-col>
          </v-row>
        </v-row>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: { UserSelectForm },
  props: {
    dialog: {
      default: false,
      type: Boolean,
    },

    sectionName: {
      default: false,
      require: false,
    },
  },
  data() {
    return {
      title: "",
      loading: false,
      valid: true,
      products: [],
      package_list: [],
      user: [],
      role_id: [],
      form: {
        section_name: "",
        section_ids: "",
        getter_id: "",
      },
    };
  },
  mounted() {
    this.role_id = [this.$store.state.auth.role.admin_call_center_id];
    if (this.sectionName == "Product") {
      this.title = "ثبت محصول";
      this.loadProduct();
    } else {
      this.title = "ثبت  پکیج";
      this.loadPackages();
    }
  },
  methods: {
    loadProduct() {
      this.loading = true;
      let url = this.$checkRole(this.$store.state.auth.role.admin_id)
        ? "/product/list-by-personnel"
        : "product-allocation/product-list";
      this.$reqApi(url, { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }

          this.products = items;

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadPackages() {
      this.loading = true;
      let filters = {
        type: {
          op: "=",
          value: "Package",
        },
      };
      let url = this.$checkRole(this.$store.state.auth.role.admin_id)
        ? '/package'
        : "product-allocation/package-list";
      this.$reqApi(url, { filters: filters, row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.package_list = items;

          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.section_name = this.sectionName;
      if (this.user.length > 0) {
        form.getter_id = this.user[0].id;
      } else {
        form.getter_id = this.$route.query.getter;
      }
      this.$reqApi("product-allocation/insert", form)
        .then((res) => {
          this.$toast.success("عملیات با موفقیت انجام شد");
          this.closeDialog();
          this.loading = false;
          this.$emit("reload");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
<style scoped>
strong {
  font-size: 18px;
}
h1 {
  font-size: 12px;
}
</style>
