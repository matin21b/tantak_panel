<template>
  <div>
    <v-col cols="12" class="d-flex align-center justify-center">
      <v-chip
        dark
        label
        class="ma-2 pa-3"
        color="teal"
        v-for="(x, i) in items"
        :key="i"
        @click="tab = x.value"
        :outlined="tab != x.value"
      >
        {{ x.text }}
      </v-chip>
    </v-col>
   
    <CreateDialog
      v-if="add_allocation"
      :dialog="add_allocation"
      @closeDialog="add_allocation = false"
      @reload="refresh"
      :section-name="tab"
    />
    <RefralItem
      v-if="refral_item"
      :dialog="refral_item"
      :item-id="section_id"
      @closeDialog="refral_item = false"
      @reload="refresh"
      :section-name="tab"
    />
    <BaseTable
      url="/product-allocation"
      ref="TabaleItems"
      :autoDelete="delete_url"
      :headers="headers"
      :rowColor="rowColor"
      :filters="filters"
      :extraBtn="extra_btn"
      :BTNactions="btn_actions"
      :root-body="root_body"
    >
    </BaseTable>
  </div>
</template>

<script>
import CreateDialog from "@/components/NewCallCenter/productAllocation/CreateDialog.vue";
import RefralItem from "@/components/NewCallCenter/productAllocation/RefralItem.vue";
export default {
  components: {
    CreateDialog,
    RefralItem,
  },
  data: () => ({
    items: [
      { text: "محصولات", value: "Product" },
      { text: "پکیج ها", value: "Package" },
    ],
    add_allocation: false,
    refral_item: false,
    tab: "",
    section_id: "",
    delete_url: "",
    headers: [],
    btn_actions: [],
    extra_btn: [],
    title: "تخصیص محصولات",
    root_body: {},
    filters: {},
    getter: null,
  }),
  beforeMount() {
    if (Boolean(this.$store.state.auth.action.indexOf("product_allocations/insert") > -1)) {
      this.delete_url = "product-allocation/delete"
    }
    //
    if (
      Boolean(
        this.$store.state.auth.action.indexOf("product_allocations/root") > -1
      ) || this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
    ) {

      this.extra_btn.push({
        text: "تخصیص جدید",
        icon: "add_circle",
        color: "primary",
        fun: () => {
          this.add_allocation = true;
        },
      },
      {
        text: "برگشت",
        icon: "redo",
        color: "red",
        fun: () => {
          this.$router.push("/new-call-center/product-allocation");
        },
        show_fun: () => {
          if (
            Boolean(
              this.$store.state.auth.action.indexOf(
                "product_allocations/root"
              ) > -1
            )
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    );
    }

    if (Boolean(this.$route.query.getter)) {
     

      this.filters = {
        getter_id: {
          op: "=",
          value: this.$route.query.getter,
        },
      };
    }
    this.btn_actions = [
      {
        text: "تخصیص کالا",
        icon: "swap_vert",
        color: "blue-grey",
        fun: (body) => {
          this.refral_item = true;
          this.section_id =
            this.tab == "Product" ? body.product.id : body.package.id;
        },
        show_fun: (body) => {
          if (
            Boolean(!this.$checkRole(this.$store.state.auth.role.admin_id)) &&
            body.getter_id == this.$store.state.auth.user.id
          ) {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
    this.tab = "Product";
 

    this.$store.dispatch("setPageTitle", this.title + ` - ${this.$route.query.name}`);
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
      // {
      //   text: "ارسال کننده",
      //   filtrabel: false,
      //   disabled: true,
      //   value: (body) => {
      //     let us = body.sender;
      //     if (Boolean(us)) {
      //       let user =
      //         Boolean(us.first_name) && Boolean(us.last_name)
      //           ? `${us.first_name} ${us.last_name}`
      //           : us.username;

      //       return `
      //            <h1 class="my-2">
      //               ${user}
      //   <br />
      //   <small class="grey--text">
      //     ${us.username}
      //     </small>
      // </h1>
              
      //         `;
      //     } else {
      //       return "--";
      //     }
      //   },
      // },
      // {
      //   text: "شماره ارسال کننده",
      //   filterCol: "sender.username",
      //   value: (body) => {
      //     let user_name = Boolean(body.sender) ? body.sender.username : "--";
      //     return user_name;
      //   },
      // },
      // {
      //   text: "گیرنده",
      //   filtrabel: false,
      //   disabled: true,
      //   value: (body) => {
      //     let us = body.getter;
      //     if (Boolean(us)) {
      //       let user =
      //         Boolean(us.first_name) && Boolean(us.last_name)
      //           ? `${us.first_name} ${us.last_name}`
      //           : us.username;

      //       return `
      //            <h1 class="my-2">
      //               ${user}
      //   <br />
      //   <small class="grey--text">
      //     ${us.username}
      //     </small>
      // </h1>
              
      //         `;
      //     } else {
      //       return "--";
      //     }
      //   },
      // },
      // {
      //   text: "شماره گیرنده",
      //   filterCol: "sender.username",
      //   value: (body) => {
      //     let user_name = Boolean(body.getter) ? body.getter.username : "--";
      //     this
      //     return user_name;
      //   },
      // },
      {
        text: "محصول / پکیج",
        value: (body) => {
          if (body.section_name == "Product") {
            this.getter = body.getter
            let x = body.product;
            return `
                 <h1 class="my-2 blue-grey--text">
                    ${x.name}
        <br />
        <small class="grey--text">
          بارکد
          ${x.barcode}
          </small>
      </h1>
              
              `;
          } else if (body.section_name == "Package") {
            let x = body.package;
            if (!Boolean(x)) {
              return "--";
            } else {
              return `
                 <h1 class="my-2 blue-grey--text">
                    ${x.name}
                    <br />
                      <small class="grey--text">
                       شماره پکیج
                       ${x.package_number}
                          </small>
                  </h1>
              
              `;
            }
          }
        },
      },
    ];
  },
  watch: {
    tab() {
      this.root_body = { section_name: this.tab };
    },
  },
  methods: {
    refresh() {
      this.$refs.TabaleItems.getDataFromApi();
    },
        rowColor(body) {
      if (body.item.getter_id != this.$store.state.auth.user.id) {
        return "orange lighten-5";
      }
    },
  },
};
</script>
