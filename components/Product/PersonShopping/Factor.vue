<template>
  <v-row>
    <v-col
      v-if="list_items.length != 0 && !loading"
      cols="12"
      md="6"
      v-for="(x, i) in list_items"
      :key="i"
    >
      <v-card
        class="elevation-1 pa-1 d-flex align-center"
        :color="x.count > x.skock ? '#fc52461a' : ''"
        outlined
        width="100%"
        v-if="x.section_name == 'ProductVariationCombination'"
      >
        <v-avatar size="45" class="mx-2">
          <img :src="$getImage(x.product_var.variation1.product.main_image)" />
        </v-avatar>
        <v-col cols="12" md="7">
          <h1>
            {{ x.product_var.variation1.product.name }}
            <br />
            <small class="mx-1 grey--text" v-if="x.product_var.price && Boolean(x.product_var.price)">
              قیمت محصول :{{ $price(x.product_var.price) }} ریال
            </small>
            <small v-else>

              قیمت محصول :{{ $price(x.product_var.product.base_price) }} ریال
            </small>
            <br />

            <small
              class="grey--text"
              v-if="Boolean(x.product_var.variation1.colors)"
            >
              {{ x.product_var.variation1.variation_type.value }}
              {{ x.product_var.variation1.colors }}
            </small>
            <small class="grey--text" v-else>
              {{ x.product_var.variation1.variation_type.value }}
              {{ x.product_var.variation1.value }}
            </small>
            <small class="mx-1 grey--text">
              {{ x.product_var.variation2.variation_type.value }}
              {{ x.product_var.variation2.value }}
            </small>
            <small class="mx-1 grey--text">
              {{ x.product_var.variation3.variation_type.value }}
              {{ x.product_var.variation3.value }}
            </small>
          </h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="3" class="text-center">
          <div class="mt-2">
            <v-chip small block>
              <h1>
                <small> موجودی </small>
              </h1>
              <h1>
                <small class="mr-3">
                  {{ x.skock }}
                </small>
              </h1>
            </v-chip>
          </div>
          <amp-input
            class="mt-6"
            v-model="x.count"
            cClass="ltr-item"
            rules="require,number"
          />
        </v-col>
      </v-card>

      <v-card
        class="elevation-1 pa-1 d-flex align-center"
        :color="x.count > x.skock ? '#fc52461a' : ''"
        outlined
        width="100%"
        v-else
      >
        <v-avatar size="45" class="mx-2">
          <img :src="$getImage(x.package.log)" />
        </v-avatar>
        <v-col cols="12" md="7">
          <h1>
            {{ x.package.name }}
            <br />

            <small class="mx-1 grey--text">
              شماره پکیج :{{ x.package.package_number }}
            </small>
            <br />
            <small
              v-if="Boolean(x.package.final_price)"
              class="mx-1 grey--text"
            >
              قیمت پکیج :{{ $price(x.package.final_price) }} ریال
            </small>
            <small class="mx-1 grey--text" v-else>
              قیمت پکیج :{{ $price(x.package.price) }} ریال
            </small>
            <br />

            <small class="mx-1 grey--text">
              {{ x.package.description }}
            </small>
          </h1>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="3" class="text-center">
          <div class="mt-2">
            <v-chip block small>
              <h1>
                <small> موجودی </small>
              </h1>
              <h1>
                <small class="mr-3">
                  {{ x.skock }}
                </small>
              </h1>
            </v-chip>
          </div>
          <amp-input
            class="mt-6"
            v-model="x.count"
            cClass="ltr-item"
            rules="require,number"
          />
        </v-col>
      </v-card>
    </v-col>
    <v-col cols="12">
      <v-divider></v-divider>
      <v-divider></v-divider>
    </v-col>
    <v-col cols="12" class="text-center">
      <amp-button
        text="ثبت موارد "
        height="38"
        icon="task_alt"
        color="blue-grey"
        @click="submit()"
        class="ma-1"
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    information: {
      default: {},
      require: false,
    },
    customerInfos: {
      default: "",
      require: false,
    },
    kindSet: {
      default: "",
      require: false,
    },
  },
  data: () => ({
    list_items: [],
    customer: {},
    sumb_price: 0,
    loading: false,
  }),

  mounted() {
    this.listItems();
  },
  methods: {
    submit() {
      this.loading = true;
      let products = [];
      let packages = [];
      let form = {};
      form = {
        ...this.customerInfos,
        sale_agency_id: this.$store.state.auth.user.sale_agency_id,
      };
      for (let i = 0; i < this.list_items.length; i++) {
        const x = this.list_items[i];
        if (x.section_name == "ProductVariationCombination") {
          products.push({
            number: x.count,
            product_varcomb_id: x.product_var.id,
          });
        } else if (Boolean(x.package)) {
          packages.push({
            count: x.count,
            id: x.package.id,
          });
        }
      }
      if (products.length > 0) {
        form["product_ids"] = products;
      }
      if (packages.length > 0) {
        form["package_ids"] = packages;
      }
      this.nexStep()
      this.$emit("formData", form);
    },
    listItems() {
      let array = [];

      if (Object.keys(this.information).length > 0) {
        let i = 0;
        do {
          let id = this.information.selected_item[i];
          i++;
          array.push(this.information.list.find((x) => x.id == id));
        } while (i < this.information.selected_item.length);
      }
      this.list_items = array;
    },
    nexStep() {
      this.$emit("basketItems" , this.list_items)
      this.$emit("nextStep");
    },
  },
};
</script>
<style scoped>
.clicabel :hover {
  color: rgb(240, 70, 70);
  border-bottom: 1px solid rgb(240, 70, 70);
  cursor: pointer;
}
</style>
