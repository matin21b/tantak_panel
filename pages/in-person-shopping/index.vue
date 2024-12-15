<template>
  <div>
    <BaseTable
      url="/basket/sale-agency/seller/list"
      :headers="headers"
      :BTNactions="btn_actions"
      ref="refreshTabel"
      createUrl="in-person-shopping/insert"
    />
    <DetailsBasket
      v-if="show_details"
      :transactions="transactions"
      :dialog="show_details"
      :data="basket_items"
      @closeDialog="show_details = false"
    />
    <PaymentCompletion
      v-if="completion"
      :dialog="completion"
      :basket-id="basket_id"
      @closeDialog="completion = false"
      @relaod="refresh"
    />
  </div>
</template>
<script>
import DetailsBasket from "@/components/Product/PersonShopping/DetailsBasket.vue";
import PaymentCompletion from "@/components/Product/PersonShopping/PaymentCompletion.vue";
export default {
  components: { DetailsBasket, PaymentCompletion },
  data: () => ({
    headers: [],
    btn_actions: [],
    basket_items: [],
    title: "خرید حضوری",
    show_details: false,
    completion: false,
    show_transactions: false,
    basket_id: "",
    transactions: {},
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.btn_actions = [
      {
        text: "جزییات سبد",
        icon: "shopping_basket",
        color: "blue-grey",
        fun: (body) => {
          this.basket_items = body.only_items;
          this.transactions["wallet_transactions"] = body.wallet_transactions;
          this.transactions["payments"] = body.payments;
          this.show_details = true;
        },
        show_fun: (body) => {
          if (body.only_items.length > 0) {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        text: "تکیمل  پرداخت",
        icon: "receipt",
        color: "teal darken-2",
        fun: (body) => {
          this.basket_id = body.id;

          this.completion = true;
        },
        show_fun: (body) => {
          if (body.status == "open") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "کاربر",
        filterCol: "body.user.username",
        value: (body) => {
          let name = Boolean(body.user.first_name)
            ? body.user.first_name + " " + body.user.last_name
            : "";
          return `
      <h1 class="my-2">
        ${body.user.username}
        <br>
          <small class="grey--text">
            ${name}
            </small>
        </h1>
      `;
        },
      },
      {
        text: "شماره فاکتور",
        value: "factor_number",
      },
      { text: "مبلغ به ریال", value: "price" },

      {
        text: "ثبت کننده",
        filterCol: "body.seller_sale_agnecy.username",
        value: (body) => {
          let name = Boolean(body.seller_sale_agnecy.first_name)
            ? body.seller_sale_agnecy.first_name +
              " " +
              body.seller_sale_agnecy.last_name
            : "";
          return `
      <h1 class="my-2 blue-grey--text">
        ${body.seller_sale_agnecy.username}
        <br>
          <small class="grey--text">
            ${name}
            </small>
        </h1>
      `;
        },
      },
      {
        text: "پیام",
        filterCol: "description",
        type: "tooltip",
        function: (body) => {
          if (body.description) {
            return body.description;
          }
        },
        value: (body) => {
          if (typeof body.description == "string") {
            if (body.description.length < 25) {
              return body.description;
            }
            return body.description.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        text: "وشعیت ",
        filterType: "select",
        filterCol: "status",
        value: "status",
        items: this.$store.state.static.status_basket_refral,
      },
    ];
  },
  methods: {
    refresh() {
      this.$refs.refreshTabel.getDataFromApi();
    },
  },
};
</script>
