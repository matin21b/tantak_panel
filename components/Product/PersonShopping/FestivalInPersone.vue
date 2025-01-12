<template>
  <v-card class="elevation-0 rounded-0">
    <v-col v-if="!loading" cols="12" v-for="(x, i) in festivals" :key="i">
      <v-window
        v-model="x.step"
        style="border-right: 2px solid orangered"
        class="elevation-2 rounded-0"
      >
        <v-window-item :value="1">
          <v-card @click="setStep(i)" class="pa-3">
            <div class="d-flex align-center">
              <v-avatar size="45">
                <v-img :src="$getImage(x.logo)" />
              </v-avatar>

              <v-spacer></v-spacer>

              <h1 class="font_12">
                جشنواره
                {{ x.name }}
              </h1>
              <v-spacer></v-spacer>
              <h1 class="font_12">
                تعداد / قیمت خرید کاربر:
                {{ $price(x.amount_start_use) }}
              </h1>
              <v-spacer></v-spacer>
              <v-icon class="ml-3"> arrow_circle_left </v-icon>
            </div>
          </v-card>
        </v-window-item>

        <v-window-item :value="2">
          <v-card @click="setStep(i)" class="pa-3">
            <div class="d-flex align-center px-4">
              <h1>جوایز جشنواره</h1>
              <v-spacer></v-spacer>
              <v-icon> redeem </v-icon>
            </div>
            <v-col cols="12">
              <v-divider></v-divider>
              <v-divider></v-divider>
              <v-divider></v-divider>
            </v-col>
            <v-card
              outlined
              v-for="(pack, packi) in x.gift_packages"
              :key="packi"
              class="d-flex align-center pa-2 ma-2 elevation-1 card-style"
              @click.stop="selectBox(pack, 'package', x)"
            >
              <v-avatar size="45">
                <v-img :src="$getImage(pack.logo)" />
              </v-avatar>

              <v-spacer></v-spacer>

              <h1>
                نام پکیج :‌
                {{ pack.name }}
              </h1>
              <v-spacer></v-spacer>
            </v-card>
            <v-card
              outlined
              v-for="(product, proi) in x.gift_products"
              :key="proi"
              class="d-flex align-center pa-2 ma-2 elevation-1 card-style"
              @click.stop="selectBox(product, 'product', x)"
            >
              <v-avatar size="45">
                <v-img :src="$getImage(product.main_image)" />
              </v-avatar>
              <v-spacer></v-spacer>
              <h1>
                نام محصول :‌
                {{ product.name }}
              </h1>
              <v-spacer></v-spacer>
            </v-card>
            <JustVariatin v-if="show_dialog" :product-id="product_id" />
            <!-- <div class="d-flex align-center" v-else>
              <v-avatar size="45">
                <v-img :src="$getImage(x.main_image)" />
              </v-avatar>

              <v-spacer></v-spacer>

              <h1>
                {{ x.name }}
              </h1>
              <v-spacer></v-spacer>
              <h1>
                تعداد :
                {{ x.number }}
              </h1>
            </div> -->
          </v-card>
        </v-window-item>
      </v-window>
    </v-col>
  </v-card>
</template>
<script>
import JustVariatin from "@/components/Product/PersonShopping/JustVariatin.vue";
export default {
  components: {
    JustVariatin,
  },
  props: {
    festivalItem: {
      default: false,
    },
    userId: {
      default: false,
    },
  },
  data() {
    return {
      festivals: [],
      loading: false,
      show_dialog: false,
      product_id:"",
    };
  },
  mounted() {
    console.log("this.festivalItem", this.festivalItem);
    console.log("this.festivalItem", this.festivalItem);

    if (Boolean(this.festivalItem)) {
      this.setItems(this.festivalItem);
    }
  },
  methods: {
    setItems(data) {
      let items = [];
      for (let i = 0; i < data.length; i++) {
        const x = data[i];
        x["step"] = "1";
        if (x.gift_products.length > 0) {
          x.gift_products["show_var"] = false;
        }
        items.push(x);
      }
      console.log("???++++?", items);

      this.festivals = items;
    },
    setStep(index) {
      this.loading = true;
      console.log(index);
      if (this.festivals[index].step == 1) {
        this.festivals[index].step++;
      } else {
        this.festivals[index].step--;
      }
      this.loading = false;
      console.log("festivals[index].step", this.festivals[index].step);
      console.log("festivals[index].step", this.festivals[index].step);
    },
    selectBox(item, key, data) {
      console.log("key ,,,,,", key);
      if (key == "package") {
        this.addGift(item, data);
      } else if (key == "product") {
        this.show_dialog = true;
        this.product_id = item.id
      }
    },
    addGift(data, festival) {
      //       console.log("festiitemitemitemitemitemval", [festival , item]);
      let form = {
        user_id: this.userId,
        festival_id: festival.id,
        gift_section_id: data.id,
        number_use: data.number,
        gift_section_name: data.package_number ? "Package" : "Product",
        section_use_name: data.package_number
          ? "Package"
          : "ProductVariationCombination",
        section_use_id: data.package_number ? data.id : "---",
      };
      this.$reqApi("basket/sale-agency/seller/insert-festival", form)
        .then((res) => {
          this.$toast.success("هدیه برای کاربر ثبت شد");
        })
        .catch((err) => {});
    },
  },
};
</script>
<style scoped>
.card-style {
  transition: all 0.4s ease;
}
.card-style:hover {
  transform: scale3d(1.04, 1.04, 1.04);
  background: linear-gradient(
    to right,
    #fc9106ad,
    #ffffff,
    #ffffff,
    #ffffff,
    #ffffff
  ) !important;
  transition: all 0.4s ease;
}
</style>
