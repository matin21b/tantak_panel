<template>
  <div>
    <BaseTable
      v-if="
        this.$checkRole(this.$store.state.auth.role.admin_id) ||
        $checkRole(this.$store.state.auth.role.admin_call_center_id)
      "
      :url="url"
      ref="TabaleItems"
      :headers="headers"
      :extraBtn="extra_btn"
      :BTNactions="btn_actions"
      :root-body="root_body"
    >
    </BaseTable>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    items: [
      { text: "محصولات", value: "Product" },
      { text: "پکیج ها", value: "Package" },
    ],
    add_allocation: false,
    refral_item: false,
    tab: "",
    url: "",
    section_id: "",
    headers: [],
    btn_actions: [],
    extra_btn: [],
    title: "تخصیص محصولات",
    root_body: {},
  }),
  beforeMount() {
    if (
      this.$checkRole(this.$store.state.auth.role.admin_id) ||
      this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
    ) {
      if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
        this.url = "/user/searchByRole";
        this.root_body = {
          role_id: [this.$store.state.auth.role.admin_call_center_id],
        };
      } else {
        this.url = "/user/list-employee";
      }
    } else {
      this.$router.push(`/new-call-center/product-allocation/allocation`);
    }
    // this.btn_actions = [
    //   {
    //     text: "تخصیص کالا",
    //     icon: "swap_vert",
    //     color: "blue-grey",
    //     fun: (body) => {
    //       this.refral_item = true;
    //       this.section_id =
    //         this.tab == "Product" ? body.product.id : body.package.id;
    //     },
    //     show_fun: () => {
    //       if (Boolean(!this.$checkRole(this.$store.state.auth.role.admin_id))) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     },
    //   },
    // ];

    this.btn_actions = [
      {
        text: "روند تخصیص",
        icon: "swap_vert",
        color: "blue-grey",
        fun: (body) => {
          // `?getter=${}`
          let name =
            Boolean(body.first_name) && Boolean(body.last_name)
              ? `${body.first_name} ${body.last_name}`
              : body.username;
          this.$router.push({
            path: "/new-call-center/product-allocation/allocation",
            query: {
              getter: body.id,
              name: name,
            },
          });
        },
      },
    ];
    this.$store.dispatch("setPageTitle", this.title);
    this.headers = [
      {
        text: "تصویر",
        value: "avatar",
        type: "image",
        disableSort: "true",
        filterable: false,
      },
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
    ];
  },
  watch: {
    tab() {},
  },
  methods: {
    refresh() {
      this.$refs.TabaleItems.getDataFromApi();
    },
  },
};
</script>
