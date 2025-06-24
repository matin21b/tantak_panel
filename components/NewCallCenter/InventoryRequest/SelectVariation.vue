<template>
  <v-card class="elevation-0" :disabled="loading">
    <v-col cols="12">
      <v-row cols="12" class="center-div mt-1 mx-4">
        <v-chip
          dark
          label
          class="ma-2"
          color="grey darken-1"
          v-for="item in items"
          :key="item.key"
          @click="tab = item.key"
          :outlined="tab != item.key"
        >
          <span class="font_16">
            {{ item.text }}
          </span>
          <v-icon class="mr-1">
            {{ item.icon }}
          </v-icon>
        </v-chip>
        <v-spacer></v-spacer>
        <amp-button
          text="ثبت موارد انتخابی"
          icon="task_alt"
          @click="createFactor"
          color="green"
          :disabled="loading"
          class="ma-2"
        />
      </v-row>
    </v-col>
    <v-window v-model="step">
      <v-window-item :value="1" eager>
        <Products :basketId="basketId" @data="getData($event, 'product')" />
      </v-window-item>

      <v-window-item :value="2" eager>
        <Packages :basketId="basketId" @data="getData($event, 'package')" />
      </v-window-item>
      <v-window-item :value="3" eager>
        <Boxes :basketId="basketId" @data="getData($event, 'boxes')" />
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script>
import Packages from "@/components/NewCallCenter/AddToBasket/Packages.vue";
import Products from "@/components/NewCallCenter/AddToBasket/products.vue";
import Boxes from "@/components/NewCallCenter/AddToBasket/Boxes.vue";

export default {
  components: {
    Packages,
    Products,
    Boxes,
  },
  props: {
    basketId: {
      require: false,
      default: false,
    },
    amaniShopping: {
      require: false,
      default: false,
    },
  },
  data: () => ({
    step: 1,

    number: 1,
    valid_variations: true,
    load_form: true,
    load_item: true,
    loading: false,
    check: false,
    loading_package: false,
    show_basket_items: false,
    step_var_1: false,
    step_var_2: false,
    step_var_3: false,
    packages_list: [],
    package_id: "",

    product_sort_1: {},
    selected_package: {},
    product_sort_2: [],
    product_sort_3: [],
    products: [],
    products_items: [],
    available_items_2: [],
    available_items_3: [],
    variations_Product: [],
    boxes_items: [],
    var_products: [],
    all_variatons_product: [],
    packages_items: [],
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
    product_varcomb_id: "",

    selected_product: {},
    tab: "products",
    items: [
      { text: "محصول", key: "products", icon: "local_mall" },
      { text: "پکیج ", key: "packages", icon: "bento" },
      { text: "جعبه ", key: "box", icon: "inbox" },
    ],
  }),
  beforeMount() {},
  watch: {
    tab(new_value, old_value) {
      if (old_value == "products" && new_value == "packages") {
        this.step++;
      }
      if (old_value == "products" && new_value == "box") {
        this.step += 2;
      }
      if (old_value == "packages" && new_value == "box") {
        this.step += 1;
      }
      if (old_value == "packages" && new_value == "products") {
        this.step -= 1;
      }
      if (old_value == "box" && new_value == "products") {
        this.step -= 2;
      }
      if (old_value == "box" && new_value == "packages") {
        this.step -= 1;
      }
    },
    loading() {
      this.$emit("isLoading", this.loading);
    },
  },

  methods: {
    sendVariation() {
      let variation_array = [];
      let ids = [];
      for (let index = 0; index < this.products_items.length; index++) {
        const x = this.products_items[index];
        ids.push({
          id: x.id,
          count: x.count,
        });
      }
      variation_array = ids;
      this.$emit("variation_array", variation_array);
    },

    getData(data, type) {
      if (type == "package") {
        this.packages_items = data;
      } else if (type == "product") {
        this.products_items = data;
      } else if (type == "boxes") {
        this.boxes_items = data;
      }
    },
    callSubmit(get_data, amani_shopping) {
      if (
        this.packages_items.length < 1 &&
        this.products_items.length < 1 &&
        this.boxes_items.length < 1
      ) {
        this.$toast.error("موردی انتخاب نشده ");
        this.loading = false;
        return;
      }

      if (Boolean(get_data)) {
        let data = {
          packages: [],
          products: [],
          boxes: [],
        };
        data.packages = this.packages_items;
        data.products = this.products_items;
        data.boxes = this.boxes_items;
        this.$emit("getOnlyData", {
          data,
        });
        return;
      } else {
        this.setAmaniShopping(amani_shopping);
      }
    },
    setAmaniShopping(amani_shopping) {
      const is_amani = amani_shopping == "yes" ? true : false;
      this.submit(is_amani);
    },
    submit(amani_shopping = false) {
      this.loading = true;
      let form = {};

      if (
        this.products_items &&
        Array.isArray(this.products_items) &&
        this.products_items.length > 0
      ) {
        let items = [];
        for (let index = 0; index < this.products_items.length; index++) {
          const element = this.products_items[index];
          items.push({
            id: element.id,
            count: element.count,
          });
        }
        form["product_varcom_ids"] = items;
      }
      if (this.packages_items.length > 0) {
        let packages = [];
        for (let index = 0; index < this.packages_items.length; index++) {
          const element = this.packages_items[index];
          packages.push({
            id: element.value,
            count: element.count,
          });
        }
        form["package_ids"] = packages;
      }
      if (this.boxes_items.length > 0) {
        let boxes = [];
        for (let index = 0; index < this.boxes_items.length; index++) {
          const element = this.boxes_items[index];
          boxes.push({
            id: element.value,
            count: element.count,
          });
        }
        form["box_ids"] = boxes;
      }
      form["amani_shopping"] = amani_shopping;
      let url = this.basketId
        ? "product-request/update"
        : "product-request/insert";

      if (Boolean(this.basketId)) {
        form["id"] = this.basketId;
      }
      this.$reqApi(url, form)
        .then((res) => {
          this.$emit("submit", true);

          if (Boolean(this.basketId)) {
            this.$toast.success("اطلاعات با موفقیت ویرایش شد");
          } else {
            this.$toast.success("درخواست با موفقیت ثبت شد");
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    createFactor() {
      this.$emit("createFactor");
    },
  },
};
</script>

<style></style>
