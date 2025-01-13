<template>
  <v-card style="overflow: hidden; border-radius: 10px" class="elevation-0">
    <v-row>
      <v-col cols="12" md="12">
        <v-col
          v-if="Boolean(check) && !loading"
          class="justify-center text-center"
          cols="12"
        >
          <v-icon color="red" size="50"> error </v-icon>
          <br />
          <small class="red--text">
            برای محصول انتخاب شده ویژگی تعیین شده</small
          >
        </v-col>
        <v-form v-model="valid_variations" v-if="!loading">
          <v-row class="align-center">
            <v-col cols="12" md="4">
              <amp-select
                v-if="Boolean(step_var_1) && Boolean(product_sort_1)"
                :text="product_sort_1.title"
                rules="require"
                v-model="var_id_1"
                :items="product_sort_1.items"
                :loading="loading"
                :disabled="
                  loading && !Boolean(step_var_1) && !Boolean(product_sort_1)
                "
            /></v-col>
            <v-col cols="12" md="3">
              <amp-select
                v-if="Boolean(step_var_2) && Boolean(product_sort_2)"
                :text="product_sort_2.title"
                rules="require"
                v-model="var_id_2"
                :items="available_items_2"
                :loading="loading"
                :disabled="!Boolean(var_id_1) || loading"
              />
            </v-col>
            <v-col cols="12" md="3">
              <amp-select
                v-if="Boolean(step_var_3) && Boolean(product_sort_3)"
                :text="product_sort_3.title"
                rules="require"
                v-model="var_id_3"
                :items="available_items_3"
                :loading="loading"
                :disabled="!Boolean(var_id_2) || loading"
              />
            </v-col>
            <v-col cols="12" md="2">
              <amp-button
                color="blue-grey"
                text="ثبت"
                height="38"
                :disabled="
                  !Boolean(var_id_1) || !Boolean(var_id_2) || !Boolean(var_id_3)
                "
                @click="getSelectedVar(variation_id)"
              />
            </v-col>
          </v-row>
        </v-form>

        <v-row class="mt-8" v-if="loading">
          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="text@2"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="text@2"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader v-bind="attrs" type="text@2"></v-skeleton-loader>
          </v-col>
          <v-col cols="12" md="12">
            <v-skeleton-loader v-bind="attrs" type="text@1"></v-skeleton-loader>
          </v-col>
        </v-row>
      </v-col>

      <v-row class="d-flex justify-center">
        <v-col cols="12" md="10"> </v-col>
      </v-row>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    clear_vaue: {
      default: false,
      require: false,
    },
    productId: {
      default: false,
      require: false,
    },
    productVar: {
      default: false,
      require: false,
    },
  },
  data: () => ({
    e1: 2,
    attrs: {
      class: "mb-6",
      boilerplate: true,
      elevation: 2,
    },
    number: 1,
    valid_variations: true,
    load_form: true,
    load_item: true,
    loading: false,
    check: false,
    show_basket_items: false,
    step_var_1: false,
    step_var_2: false,
    step_var_3: false,
    product_sort_1: {},
    product_sort_2: [],
    product_sort_3: [],
    products: [],
    variations_list: [],
    available_items_2: [],
    available_items_3: [],
    variations_Product: [],
    var_products: [],
    all_variatons_product: [],
    list_basket: [],
    parent_2: "",
    parent_3: "",
    var_id_1: "",
    var_id_2: "",
    var_id_3: "",
    main_image: "",
    first_name: "",
    last_name: "",
    username: "",
    user_id: "",
    main_price: "",
    sumb_price: "",
    product_name: "",
    variation_id: "",
    selected_product: {},
  }),
  beforeMount() {
    // this.loadProduct();
  },
  mounted() {
    if (Boolean(this.productVar)) {
      console.log("productVar", this.productVar);
      let set_title = [];
      this.all_variatons_product = this.productVar;
      // ساختار کلی variations

      if (Boolean(this.productVar[0])) {
        if (this.productVar[0].variation1) {
          this.step_var_1 = true;
          set_title[
            `var_${this.productVar[0].variation1.variation_type.sort}`
          ] = {
            title: this.productVar[0].variation1.variation_type.value,
          };
        }
        if (this.productVar[0].variation2) {
          this.step_var_2 = true;
          set_title[
            `var_${this.productVar[0].variation2.variation_type.sort}`
          ] = {
            title: this.productVar[0].variation2.variation_type.value,
          };
        }
        if (this.productVar[0].variation3) {
          this.step_var_3 = true;
          set_title[
            `var_${this.productVar[0].variation3.variation_type.sort}`
          ] = {
            title: this.productVar[0].variation3.variation_type.value,
          };
        }
      } else {
        this.check = true;
      }
      this.main_image = this.productVar[0].variation1.product.main_image;
      this.product_name = this.productVar[0].variation1.product.name;

      // set items variations
      let items_var_1 = [];
      let items_var_2 = [];
      let items_var_3 = [];
      let data = this.productVar;
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (Boolean(this.step_var_1) && Boolean(element.variation1)) {
          let text = Boolean(element.variation1.colors)
            ? element.variation1.colors
            : element.variation1.value;
          let value = element.variation1.value.startsWith("[/")
            ? JSON.parse(element.variation1.value)
            : element.variation1.id;
          items_var_1.push({
            text: text,
            value: value,
          });
        }

        if (Boolean(this.step_var_2) && Boolean(element.variation2)) {
          items_var_2.push({
            text: element.variation2.value,
            value: element.variation2.id,
            parent: element.variation_1_id,
          });
        }
        if (Boolean(this.step_var_3) && Boolean(element.variation3)) {
          items_var_3.push({
            text: element.variation3.value,
            value: element.variation3.id,
            parent: element.variation_2_id,
          });
        }
      }
      if (Boolean(this.step_var_1)) {
        this.product_sort_1["title"] = set_title.var_1.title;
        this.product_sort_1["items"] = items_var_1;
      }
      if (Boolean(this.step_var_2)) {
        this.product_sort_2["title"] = set_title.var_2.title;
        this.product_sort_2["items"] = items_var_2;
      }
      if (Boolean(this.step_var_3)) {
        this.product_sort_3["title"] = set_title.var_3.title;
        this.product_sort_3["items"] = items_var_3;
      }

      this.loading = false;
      this.load_form = false;
    }
  },
  watch: {
    clear_vaue() {
      if (!this.clear_vaue) {
      }
    },

    var_id_1() {
      let items = [];
      this.var_id_2 = "";
      this.product_sort_2.items.filter((x) => {
        if (x.parent == this.var_id_1) {
          items.push({
            text: x.text,
            value: x.value,
          });
        }
      });
      this.available_items_2 = items;
    },
    var_id_2() {
      this.var_id_3 = "";
      let items = [];
      this.product_sort_3.items.filter((x) => {
        if (x.parent == this.var_id_2) {
          items.push({
            text: x.text,
            value: x.value,
          });
        }
      });
      this.available_items_3 = items;
    },
    valid_variations() {
      if (Boolean(this.valid_variations)) {
        let product = {};
        this.all_variatons_product.filter((f) => {
          if (Boolean(this.step_var_3)) {
            if (
              this.var_id_1 == f.variation_1_id &&
              this.var_id_2 == f.variation_2_id &&
              this.var_id_3 == f.variation_3_id
            ) {
              product = f;
            }
          }
          if (Boolean(this.step_var_2) && !Boolean(this.step_var_3)) {
            if (
              this.var_id_1 == f.variation_3_id &&
              this.var_id_2 == f.variation_2_id
            ) {
              product = f;
            }
          }
          if (
            Boolean(this.step_var_1) &&
            !Boolean(this.step_var_2) &&
            !Boolean(this.step_var_3)
          ) {
            if (this.var_id_1 == f.variation_1_id) {
              product = f;
            }
          }

          if (Boolean(product) && Object.keys(product).length > 0) {
            this.variation_id = product.id;
          }
        });
      }
    },
    check() {
      this.$emit("haveVariation", this.check);
    },
  },
  methods: {
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
        .then((response) => {
          let items = [];
          for (let index = 0; index < this.productVar.length; index++) {
            const x = this.productVar[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }
          this.products = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    // loadInfoProduct(id) {
    //   this.loading = true;
    //   this.step_var_1 = false;
    //   this.step_var_2 = false;
    //   this.step_var_3 = false;
    //   this.check = false;

    //   this.$reqApi("product-variation-combination/variety-list", {
    //     product_id: id,
    //   })
    //     .then((response) => {
    //

    //     })
    //     .catch((error) => {
    //       this.loading = false;
    //       this.load_form = false;
    //     });
    // },

    loadVariationsCombinations() {
      let items = [];
      for (let index = 0; index < this.productVarcoms.length; index++) {
        const e = this.productVarcoms[index];
        let obj = {};
        obj["id"] = e.id;
        obj["count"] = e.count_product;
        if (Boolean(e.variation1)) {
          obj["variation1"] = {
            product: e.product,
            value: e.variation1.value,
          };
        }
        if (Boolean(e.variation2)) {
          obj["variation2"] = e.variation2;
        }
        if (Boolean(e.variation3)) {
          obj["variation3"] = e.variation3;
        }
        items.push(obj);
      }
      this.variations_list = items;
    },
    getSelectedVar(id) {
      this.$emit("SelectedVarId", id);
    },

    findSelectedProduct() {
      return new Promise((res, rej) => {
        if (Boolean(this.valid_variations)) {
          let product = {};
          this.all_variatons_product.filter((f) => {
            if (Boolean(this.step_var_3)) {
              if (
                this.var_id_1 == f.variation_1_id &&
                this.var_id_2 == f.variation_2_id &&
                this.var_id_3 == f.variation_3_id
              ) {
                product = f;
              }
            }
            if (Boolean(this.step_var_2) && !Boolean(this.step_var_3)) {
              if (
                this.var_id_1 == f.variation_3_id &&
                this.var_id_2 == f.variation_2_id
              ) {
                product = f;
              }
            }
            if (
              Boolean(this.step_var_1) &&
              !Boolean(this.step_var_2) &&
              !Boolean(this.step_var_3)
            ) {
              if (this.var_id_1 == f.variation_1_id) {
                product = f;
              }
            }
            if (Object.keys(product).length > 0) {
              res(product);
            }
          });
        }
      })
        .then((res) => {
          this.selected_product = res;
          this.$emit("validVariations", true);
          this.$emit("productId", res.id);
        })
        .catch((rej) => {});
    },
  },
};
</script>

<style></style>
