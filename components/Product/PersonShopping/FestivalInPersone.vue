<template>
  <v-card
    class="elevation-3 py-4 px-2 rounded-0 mx-2"
    color="#ff590014"
    outlined
  >
    <v-row class="align-center my-5 mx-3 justify-center">
      <v-divider style="border: 1px dashed #cbcbcb"></v-divider>
      <div class="mx-3 text-center">
        <h1>
          جشنواره های مجاز برای خرید
          <br />
          <small> شما فقط مجاز به انتخاب یکی از جوایز زیر هستید </small>
        </h1>
      </div>

      <v-divider style="border: 1px dashed #cbcbcb"></v-divider>
    </v-row>
    <v-col v-if="!loading" cols="12" v-for="(x, i) in festivals" :key="i">
      <v-window
        v-model="x.step"
        style="border-right: 2px solid teal"
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

              <h1 v-if="Boolean(x.product)" class="font_12">
                بابت خرید {{ x.product.name }}
              </h1>
              <h1 v-if="Boolean(x.package)" class="font_12">
                بابت خرید {{ x.package.name }}
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
          <v-card class="pa-3" v-if="x.type_gift == 'product_package'">
            <div class="d-flex align-center px-4">
              <div size="55" class="ml-2">
                <v-img
                  contain
                  width="65"
                  height="56"
                  v-if="Boolean(x.product)"
                  :src="$getImage(x.product.main_image)"
                />
                <v-img
                  contain
                  width="65"
                  height="65"
                  v-if="Boolean(x.package)"
                  :src="$getImage(x.package.logo)"
                />
              </div>
              <h1>جوایز جشنواره</h1>
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="setStep(i)" text>
                <v-icon>cancel</v-icon>
              </v-btn>
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
              class="pa-2 ma-2 elevation-1 card-style"
            >
              <v-col cols="12" class="d-flex align-center">
                <v-avatar size="45">
                  <v-img :src="$getImage(product.main_image)" />
                </v-avatar>
                <v-spacer></v-spacer>
                <h1>
                  نام محصول :‌
                  {{ product.name }}
                </h1>
                <v-spacer></v-spacer>
              </v-col>

              <v-col cols="12">
                <JustVariatin
                  :product-var="product.product_variation_combinations"
                  @SelectedVarId="addGift(product, x, $event)"
                />
              </v-col>
            </v-card>
          </v-card>
          <v-card
            class="text-center pa-2"
            v-if="x.type_gift == 'cash_walet' || x.type_gift == 'credit_wallt'"
          >
            <v-row class="align-center justify-center">
              <v-col cols="12" class="d-flex align-center py-0 mt-2 px-4">
                <h1 v-if="x.type_gift == 'cash_walet'">شارژ کیف پول نقدی</h1>
                <h1 v-else>شارژ کیف پول اعتباری</h1>
                <v-spacer></v-spacer>
                <v-btn icon color="red" @click="setStep(i)" text>
                  <v-icon>cancel</v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" >
              <v-divider></v-divider>
              <v-divider></v-divider>
              <v-divider></v-divider>
            </v-col>
         
              <v-col cols="8">
                <amp-input
                  text="مقدار شارژ (ریال)"
                  is-price
                  v-model="x.wallet_amount"
                  :disabled="true"
                ></amp-input>
              </v-col>
              <v-col cols="2">
                <amp-button
                  @click.stop="selectBox(x.wallet_amount, 'wallet', x)"
                  text="تایید"
                  color="blue-grey"
                  height="38"
                ></amp-button>
              </v-col>
            </v-row>
          </v-card>
          <v-card
            class="pa-3 "
            v-if="x.type_gift == 'coupon'"
          >
          <v-row class="d-flex justify-center align-center">
            <v-col cols="12" class="d-flex align-center py-0 mt-2 px-4">
              <h1>استفاده از کد تخفیف</h1>
              <v-spacer></v-spacer>
              <v-btn icon color="red" @click="setStep(i)" text>
                <v-icon>cancel</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" >
              <v-divider></v-divider>
              <v-divider></v-divider>
              <v-divider></v-divider>
            </v-col>
            <v-col cols="8" class="mt-6">
              <v-autocomplete
                clearable
                outlined
                dense
                prepend-inner-icon="newspaper"
                v-model="coupon_id"
                :items="x.coupon_list"
                label="کد های تخفیف"
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title>
                      <h1>
                        {{ data.item.text }}
                      </h1>
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      <h1>
                        <small class="blue-grey--text">
                          مقدار تخفیف :‌ {{ data.item.discount_value }}
                        </small>
                        <br />
                        <small> {{ data.item.date }} </small>
                      </h1>
                    </v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
            <v-col cols="2">
              <amp-button
                @click.stop="selectBox(coupon_id, 'coupon', x)"
                text="تایید"
                color="blue-grey"
                height="38"
              ></amp-button>
            </v-col>
          </v-row>
      
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
      product_variation_combinations: [],
      loading: false,
      show_dialog: false,
      product_id: "",
      variation_id: "",
      coupon_id: "",
    };
  },
  mounted() {

    if (Boolean(this.festivalItem)) {
      this.setItems(this.festivalItem);
    }
  },
  methods: {
    setItems(data) {
      let items = [];
      for (let i = 0; i < data.length; i++) {
        let coupon_list = [];

        const y = data[i];
        y["step"] = "1";
        if (y.gift_products.length > 0) {
          y.gift_products["show_var"] = false;
        }
        if (y.type_gift == "coupon") {
          y.coupons.map((x) => {
            let discount_value =
              x.type == "amount"
                ? `${this.$price(x.value)} ریال`
                : `${x.value} درصد`;
            let start = this.$toJalali(
              x.start_date,
              "YYYY-MM-DD",
              "jYYYY/jMM/jDD"
            );
            let end = this.$toJalali(x.end_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
            let date = `قابل استفاده از تاریخ ${start} تا ${end}`;
            coupon_list.push({
              text: x.for_title,
              date: date,
              value: x.id,
              discount_value: discount_value,
            });
          });
        }
        y["coupon_list"] = coupon_list;
        items.push(y);
      }

      this.festivals = items;
    },
    setStep(index) {
      this.loading = true;
      if (this.festivals[index].step == 1) {
        this.festivals[index].step++;
      } else {
        this.festivals[index].step--;
      }
      this.loading = false;
    },
    selectBox(item, key, data) {
      if (key == "package") {
        this.addGift(item, data, "", key);
      } else if (key == "product") {
        this.product_variation_combinations =
          item.product_variation_combinations;
        this.show_dialog = true;
        this.product_id = item.id;
      } else if (key == "wallet") {

        this.addGift(item, data, "", key);
      } else if (key == "coupon") {
        this.addGift(item, data, "", key);
      }
    },
    addGift(data, festival, event, key) {
      let form = {};
      if (key == "wallet") {
        form = {
          user_id: this.userId,
          festival_id: festival.id,
        };
      } else if (key == "coupon") {
        form = {
          user_id: this.userId,
          festival_id: festival.id,
          coupon_id: this.coupon_id,
        };
      } else {
        form = {
          user_id: this.userId,
          festival_id: festival.id,
          gift_section_id: data.id,
          number_use: data.number,
          gift_section_name: data.package_number ? "Package" : "Product",
          section_use_name: data.package_number
            ? "Package"
            : "ProductVariationCombination",
          section_use_id: data.package_number ? data.id : event,
        };
      }

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
  transform: scale3d(1.02, 1.02, 1.02);
  transition: all 0.4s ease;
}
</style>
