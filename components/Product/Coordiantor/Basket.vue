<template>
  <div>
    <AddProduct
      @add="addBasket($event)"
            @createList="createListPakage($event)"
      v-if="dialog_add_product.show"
      :DialogAdd="dialog_add_product"
    />
    <v-col cols="12" class="mt-5">
      <v-col cols="12" class="text-start">
        <amp-button
          icon="add_circle"
          height="40"
          @click="dialog_add_product.show = true"
     
          color="orange darken-3"
          text="افزودن محصول"
        />
      </v-col>
      <v-card class="mt-3">
        <v-col cols="12">
          <v-row class="orange lighten-3 py-2 mb-2">
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> نام محصول</small>
            </v-col>
            <v-spacer />

            <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
              <small> ویژگی های انتخابی محصول </small>
            </v-col>
            <v-spacer />
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> تعداد</small>
            </v-col>
            <v-spacer />
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> بارکد</small>
            </v-col>
            <v-spacer />
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> قیمت محصول</small>
            </v-col>
            <v-spacer />
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small> مجموع قیمت</small>
            </v-col>
            <v-spacer />
            <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
              <small>تصویر</small>
            </v-col>
            <v-col
              class="ma-0 pa-0 text-center"
              md="1"
              cols="4"
            >
              <small> حذف </small>
            </v-col>
          </v-row>
        </v-col>

        <div v-if="list_basket && list_basket.items">
          <v-col
            cols="12"
            md="12"
            v-for="(item, index) in list_basket.items"
            :key="index"
          >
            <v-row>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> {{ item.name }}</small>
              </v-col>

              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                <small> {{ item.information }}</small>
              </v-col>

              <v-spacer> </v-spacer>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <v-row class="d-flex justify-center mt-1">
                  <v-btn
                    @click="addNumber(item, true, 'product')"
                    x-small
                    text
                  >
                    <v-icon small> add </v-icon>
                  </v-btn>
                  <small> {{ item.number }}</small>
                  <v-btn
                    :disabled="item.number == 1"
                    @click="addNumber(item, false, 'product')"
                    x-small
                    text
                  >
                    <v-icon small> remove </v-icon>
                  </v-btn>
                </v-row>
              </v-col>

              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> {{ item.full_barcode }}</small>
              </v-col>

              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> {{ $price(item.price) }}</small>
              </v-col>

              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> {{ $price(item.price * item.number) }}</small>
              </v-col>

              <v-spacer />
              <v-col class="ma-0 pa-0 text-center pr-13" md="1" cols="4">
                <v-card
                  elevation="0"
                  max-width="50"
                  class="mb-3 justify-center"
                  max-height="50"
                >
                  <v-img
                    class="size-img justify-center"
                    :src="$getImage(item.main_image)"
                    height="auto"
                  />
                </v-card>
              </v-col>

              <v-col
                class="ma-0 pa-0 text-center pr-3"
                md="1"
                cols="4"
              >
                <v-btn
            @click="deleFromCard(index, item, 'product')"
                  x-small
                  text
                  class="justify-center"
                >
                  <v-icon small> delete </v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </div>
      </v-card>
<v-col cols="12" class="mt-4">
    <amp-section text="پکیج های ثبت شده" />
</v-col>
      <v-card class="mt-5">
        <div>
          <v-col cols="12">
            <v-row class="py-2 mb-2 d-flex justify-center orange lighten-3">
              <v-col class="ma-0 pa-0 text-center" md="2" cols="4">
                <small> نام پکیج</small>
              </v-col>
              <v-spacer />

              <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                <small> قیمت پکیج (ریال)</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="2" cols="4">
                <small> تعداد</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> تخفیف</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> پیش پرداخت </small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> مجموع قیمت</small>
              </v-col>
              <v-spacer />
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small>تصویر</small>
              </v-col>
              <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                <small> حذف </small>
              </v-col>
            </v-row>
          </v-col>

          <!-- ----------------------------------------------------------------------------------------------------- -->

          <v-col
            v-if="loading && load_list"
            v-for="i in 5"
            :key="i"
            class="ma-0 pa-0 text-center"
            md="12"
            cols="12"
          >
            <v-skeleton-loader v-bind="attrs" type="text"></v-skeleton-loader>
          </v-col>

          <div v-if="pckage_list_item && pckage_list_item.length != 0">
            <v-col
              cols="12"
              md="12"
              v-for="(item, index) in pckage_list_item"
              :key="index"
            >
              <v-row class="">
                <v-col class="ma-0 pa-0 text-center" md="2" cols="4">
                  <small>
                    {{ index + 1 }} -
                    {{ item.name }}
                  </small>
                </v-col>

                <v-spacer />
                <v-col class="ma-0 pa-0 text-center" md="3" cols="4">
                  <small> {{ $price(item.price) }}</small>
                </v-col>

                <v-spacer> </v-spacer>
                <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                  <v-row class="d-flex justify-center mt-1">
                    <v-btn
                      @click="addNumber(item, true, 'package')"
                      x-small
                      text
                    >
                      <v-icon small> add </v-icon>
                    </v-btn>
                    <small> {{ item.count }}</small>
                    <v-btn
                      :disabled="item.count == 1"
                      @click="addNumber(item, false, 'package')"
                      x-small
                      text
                    >
                      <v-icon small> remove </v-icon>
                    </v-btn>
                  </v-row>
                </v-col>

                <v-spacer />
                <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                  <small> {{ $price(item.discount_amount) }} </small>
                </v-col>

                <v-spacer />
                <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                  <small> {{ $price(item.prepay_amount) }}</small>
                </v-col>

                <v-spacer />
                <v-col class="ma-0 pa-0 text-center" md="1" cols="4">
                  <small> {{ $price(item.price * item.count) }}</small>
                </v-col>

                <v-spacer />
                <v-card
                  elevation="0"
                  max-width="50"
                  class="mb-3 justify-center"
                  max-height="50"
                >
                  <v-img
                    class="size-img justify-center"
                    :src="$getImage(item.logo)"
                    height="auto"
                  />
                </v-card>

                <v-col class="ma-0 pa-0 text-center pr-3" md="1" cols="4">
                  <v-btn
                    @click="deleFromCard(index, item, 'package')"
                    x-small
                    text
                    class="justify-center"
                  >
                    <v-icon small> delete </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </div>
        </div>
      </v-card>
    </v-col>

    <v-row class="d-flex justify-center mt-8">
      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
      <v-col cols="1">
        <amp-button
          block
          height="40"
          @click="backStep()"
          color="red darken-1 "
          class="ma-1"
          :text="disabl_update ? 'برگشت' : 'انصراف'"
        />
      </v-col>
      <v-col cols="1">
        <amp-button
          block
          :disabled="loading || disabl_update"
          :loading="loading"
          height="40"
          @click="updateBasket"
          color="info darken-1 "
          class="ma-1"
          text="بروزرسانی"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import AddProduct from "@/components/Product/AddProduct.vue";
import Payment from "@/components/User/Payment.vue";
import CoordinatorDialog from "@/components/CallCenter/CoordinatorDialog.vue";

export default {
  components: {
    AddProduct,
    Payment,
    CoordinatorDialog,
  },

  data: () => ({
    valid: true,
    headers: [],
    loading_for_chagne_status: false,
    form_change_step: {
      id: "",
      step: "",
      message: "",
      fiscal_manager_id: "",
    },
    headers_basket: [],
    item_basket: [],
    change_step: false,
    wallet_transactoin: {
      show: false,
      item: null,
    },
    btn_actions: [],
    pckage_list_item: [],
    question_form: [],
    baskets: [],
    root_body: "",
    list_basket: { items: [] },
    comment: "",
    username: "",
    payment_list: {
      show: false,
      item: null,
    },

    product_id: "",
    dialog_add_product: { show: false, items: null },
    basket_id: "",
    overlay: false,
    disabl_update: true,
    filters: {},
    steps: 1,
    e1: 1,

    step_index: 1,
    step: 1,
    step_basket: 1,
    loading: false,
    fical_messanger: [],
    show_history: false,
    header_history: [],
    root_body_history: {},
    coordinator_dialog: {
      itesm: null,
      show: false,
    },
    history_basket_id: "",

    step_items: [],
    admin: [
      {
        text: "ارجاع به واحد مالی",
        value: "refer_fiscal_manager",
      },
    ],
    oper: [
      {
        text: "ارجاع به واحد مالی",
        value: "refer_fiscal_manager",
      },
    ],
    firac: [
      {
        text: "تایید واحد مالی",
        value: "accept_fiscal_manager",
      },
      {
        text: "عدم تایید واحد مالی",
        value: "reject_fiscal_manager",
      },
    ],
    form: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
    },
    cahgned_step: "",
    firacl_memebers: [],
  }),
  beforeMount() {
    let admin = this.$store.state.auth.role.admin_id;
    let opr = this.$store.state.auth.role.oprator_id;
    let fac = this.$store.state.auth.role.fac_call_id;
    let roles = this.$store.state.auth.user.roles;
    roles.forEach((element) => {
      if (element.id == admin) {
        this.step_items = this.admin;
      }
      if (element.id == opr) {
        this.step_items = this.oper;
      }
      if (element.id == fac) {
        this.step_items = this.firac;
      }
    });
  },
  watch: {
    step_basket() {
      this.disabl_update = true;
    },
    "payment_list.show"() {
      if (this.payment_list.show == false) {
        this.payment_list.item = null;
      }
    },
    change_step() {
      if (this.change_step == false) {
        this.cahgned_step = "";
        this.form_change_step = {
          id: "",
          step: "",
          message: "",
        };
      }
    },
  },
  mounted() {},
  methods: {
    deleFromCard(key, item, key_name) {
      this.loading = true;
      let items = [];
      if (key_name == "product") {
        items = this.list_basket.items;
      } else {
        items = this.pckage_list_item;
      }
      items.splice(key, 1);
      this.$toast.success(`${item.name} از لیست خرید  حذف شد`);
      this.loading = false;
    },
    addNumber(item, add, key_name) {
      this.loading = true;
      if (key_name == "product") {
        if (Boolean(add)) {
          item.number++;
        } else {
          item.number--;
        }
      } else {
        if (Boolean(add)) {
          item.count += 1;
        } else {
          item.count -= 1;
        }
      }

      this.$emit("chek_save");
      this.loading = false;
    },
    loadListBAskets(id) {
      this.loading = true;
      this.list_basket.items = [];
      this.$reqApi("basket-item", { basket_id: id })
        .then((response) => {
          for (let index = 0; index < response.model.data.length; index++) {
            const x = response.model.data[index];

            this.list_basket.items.push({
              information: x.information,

              number: x.number,
              price: x.price,

              full_barcode: x.full_barcode,
              discount: x.discount,
              id: x.product_varcomb_id,
              name: x.product.name,
              main_image: x.product.main_image,
            });
          }
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      // this.list_basket.items.unshift({
      //     information:
      //       event.product.variation1.variation_type.value +
      //       " " +
      //       event.product.variation1.value +
      //       " - " +
      //       event.product.variation2.variation_type.value +
      //       " " +
      //       event.product.variation2.value +
      //       " - " +
      //       event.product.variation3.variation_type.value +
      //       " " +
      //       event.product.variation3.value,
      //     number: event.number,
      //     price: event.product.price
      //       ? event.product.price
      //       : event.product.variation1.product.base_price,

      //     full_barcode: event.product.full_barcode,
      //     discount: event.product.discount,
      //     id: event.product.id,
      //     name: event.product.variation1.product.name,
      //     main_image: event.product.variation1.product.main_image,
      //   });
    },
    updateBasket() {
      this.loading = true;
      let form = {};
      let items = [];
      form["id"] = this.product_id;
      for (let index = 0; index < this.list_basket.items.length; index++) {
        const x = this.list_basket.items[index];
        items.push({
          number: x.number,
          product_varcomb_id: x.id,
        });
      }
      form["array_items"] = items;
      this.$reqApi("basket/update", form)
        .then((response) => {
          this.$toast.success("سبد خرید با موفقیت ویراش سبد");
          this.$emit("basket_costumer_id", response);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
      this.loading = false;
    },
    addBasket(event) {
      this.loading = true;
      let repetitious_item = false;

      for (let index = 0; index < this.list_basket.items.length; index++) {
        const element = this.list_basket.items[index];
        if (element.id == event.product.id) {
          element.number = element.number + event.number;
          repetitious_item = true;
          this.$toast.success(`${event.name} بروزرسانی شد `);
        }
      }

      if (!Boolean(repetitious_item)) {
        this.list_basket.items.unshift({
          information:
            event.product.variation1.variation_type.value +
            " " +
            event.product.variation1.value +
            " - " +
            event.product.variation2.variation_type.value +
            " " +
            event.product.variation2.value +
            " - " +
            event.product.variation3.variation_type.value +
            " " +
            event.product.variation3.value,
          number: event.number,
          price: event.product.price
            ? event.product.price
            : event.product.variation1.product.base_price,

          full_barcode: event.product.full_barcode,
          discount: event.product.discount,
          id: event.product.id,
          name: event.product.variation1.product.name,
          main_image: event.product.variation1.product.main_image,
        });
        this.$toast.success("محصول به سبد خرید اضافه شد");
      }
      this.disabl_update = false;
      this.loading = false;
    },
    backStep() {
      this.$emit("backStep");
    },
    createListPakage(event) {
        console.log(event);
      this.pckage_list_item.push(event);
    },
  },
};
</script>
