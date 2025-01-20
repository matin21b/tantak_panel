<template>
  <div>
    <v-expansion-panels v-for="(x, i) in peoples" :key="i" class="my-2">
      <v-expansion-panel class="expan-style">
        <v-expansion-panel-header>
          <h1 class="font_17">نفر {{ x.number }}</h1>
        </v-expansion-panel-header>
        <div
          class="text-center mb-2"
          v-if="x.gift_items.length == 0"
        >
          <h1 class="error--text">جایزه ثبت نشده</h1>
        </div>
        <v-expansion-panel-content>
          <v-row class="align-center">
            <v-col md="12" cols="12" class="text-center">
              <v-btn
                @click="addGift(y.value, y, x, i)"
                v-for="y in types"
                :key="y.value"
                class="mx-1"
              >
                <h1 class="mx-2 blue-grey--text">
                  {{ y.text }}
                </h1>
              </v-btn>
              <v-card v-if="x.gift_items.label != 0" class="pa-3 text-center">
                <div v-for="(gift , index) in x.gift_items" :key="index">
                  <v-row v-if="gift.key =='coupon_items'">
                    <v-col
                      cols="12"
                      md="4"
                      v-for="item in gift.items"
                      :key="item.value"
                    >
                      <v-card class="text-center pa-3">
                      {{ item }}
                        <h1>
                          {{ item.text }}
                        </h1>
                        <h1>
                          <small>
                            {{ item.date }}
                          </small>
                           <br />
                          <small></small>
                        </h1>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>

    <v-dialog persistent width="500" v-model="dialog">
      <v-card class="pa-0">
        <v-col cols="12" class="d-flex align-center justify-center">
          <v-divider></v-divider>
          <h1 class="mx-3">
            {{ dialog_title }}
          </h1>
          <v-divider></v-divider>
        </v-col>
        <div class="pa-4">
          <div v-if="dialog_key == 'coupon_items'" class="d-flex align-center">
            <v-col cols="12" class="mt-1">
              <v-autocomplete
                clearable
                multiple
                outlined
                dense
                prepend-inner-icon="newspaper"
                v-model="coupon_ids"
                :items="coupon_list"
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
          </div>
        </div>

        <v-col cols="12" class="d-flex justify-center">
          <v-col cols="12" md="3">
            <amp-button
              text="تایید"
              height="36"
              block
              color="teal darken-2"
              @click="submit(dialog_key, dialog_user)"
              class="ma-1"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-button
              text="انصراف"
              height="36"
              block
              color="red darken-2"
              @click="dialog = false"
              class="ma-1"
            />
          </v-col>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {

  props: {
    products: {
      default: [],
      type: Array,
    },
    usersCount: {
      default: "",
      type: String,
    },


  },
  data: () => ({
    types: [
      { text: "محصول ", value: "product_var_com_items" },
      { text: "پکیج ", value: "package_items" },
      { text: "کد تخفیف", value: "coupon_items" },
      { text: "شارژ کیف پول نقدی", value: "cash" },
      { text: "اعتباری", value: "credit" },
    ],
    dialog: false,
    step: 1,
    package_id: "",
    product_id: "",
    dialog_title: "",
    dialog_key: "",
    dialog_user: {},
    coupon_ids: [],
    peoples: [],
    products: [],
    coupon_list: [],
    package: [],
  }),
  mounted() {
    this.loadPackages();
    this.loadProduct();
    this.loadFestivalCoupon();
    if (Boolean(this.usersCount)) {
      let people_count = +Number(this.usersCount);
      console.log("people_count", people_count);
      console.log("people_count", people_count);
      let peoples = [];
      for (let i = 1; i <= people_count; i++) {
        peoples.push({
          number: i,
          gift_items: [],
        });
      }
      this.peoples = peoples;
    }
  },
  methods: {
    addGift(key, type, user, index) {
    
      this.dialog = true;
      this.dialog_title = `${type.text} ( نفر ${user.number} )`;
      this.dialog_key = key;
      this.dialog_user = user;
    },
    submit(key, user) {
      switch (key) {
        case "product_var_com_items":
          break;
        case "package_items":
          this.dialog = true;
          this.dialog_title = `${type.text} ( نفر ${user.number} )`;

          break;
        case "coupon_items":
          let items = [];
          for (let i in this.coupon_list) {
            let find = {};
            this.coupon_list.find((x) => x.value == this.coupon_list[i]);
            if (Boolean(find)) {
              items.push(find);
            }
          }

          user.gift_items.push({
            type: key,
            type_name: this.dialog_title,
            valeu: this.coupon_ids,
            items: items,
          });
this.dialog = false
this.coupon_ids = false
          break;
        case "cash":
          this.dialog = true;
          this.dialog_title = `${type.text} ( نفر ${user.number} )`;
          user.gift_items.push({
            type: key,
            type_name: this.dialog_title,
            valeu: this.coupon_ids,
            items: items,
          });
          break;
        case "credit":
          this.dialog = true;
          this.dialog_title = `${type.text} ( نفر ${user.number} )`;
          user.gift_items.push({
            type: key,
            type_name: this.dialog_title,
            valeu: this.coupon_ids,
            items: items,
          });
          break;
      }
    },

    // deleteItem(index) {
    //   let items = this.list_item;
    //   items.splice(index, 1);
    // },

    loadPackages() {
      let filter = {
        type: {
          op: "=",
          value: "Package",
        },
      };
      this.$reqApi("/package", { filters: filter, row_number: 2000 })
        .then((res) => {
          let data = res.model.data;
          let items = [];
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
            items.push({
              text: x.name,
              value: x.id,
            });
          }

          this.package = items;
        })
        .catch((error) => {});
    },
    loadProduct() {
      this.load_item = true;
      this.$reqApi("/product/low-search", { row_number: 50000 })
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
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
    loadFestivalCoupon() {
      this.load_item = true;
      let filters = {
        is_festival: {
          op: "=",
          value: true,
        },
      };
      this.$reqApi("/coupon", { row_number: 50000, filters: filters })
        .then((response) => {
          let items = [];
          let data = response.model.data;
          for (let index = 0; index < data.length; index++) {
            const x = data[index];
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
            items.push({
              text: x.for_title,
              date: date,
              value: x.id,
              discount_value: discount_value,
            });
          }
          this.coupon_list = items;
          this.load_item = false;
        })
        .catch((error) => {
          this.load_item = false;
        });
    },
  },
};
</script>
<style scoped>
.expan-style {
  border-right: 3px solid #0c84a1a8;
}
</style>
