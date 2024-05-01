<template>
  <v-row>
    <ListOprators
      v-if="dialog_oprator_list.show"
      :operator_url="operator_url"
      :dialog_oprator_list="dialog_oprator_list"
      :show_list="show_list"
      :name_superviser="name_superviser"
    />
    <v-col cols="12" md="12" v-if="is_super_admin">
      <v-tabs v-model="tab" class="ma-3 center-div" color="white">
        <v-tab v-for="(item, index) in items_tab" :key="item" color="white">
          <v-chip dark color="primary" class="white--text" :outlined="tab != index">
            {{ item }}
          </v-chip>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item class=""
          ><BaseTable :headers="headers" :url="admin_url"
        /></v-tab-item>
        <v-tab-item class="">
          <BaseTable
            :headers="headers_superviser"
            :url="superviser_url"
            :BTNactions="btn_actions"
          />
        </v-tab-item>
      </v-tabs-items>
    </v-col>
    <v-col cols="12" md="12" v-if="url && !is_super_admin">
      <v-col cols="12" md="12" class="center-div">
        <v-col cols="12" md="6" v-if="is_admin" class="mt-2">
          <UserCreate
            :url="insert_superviser"
            title="ایجاد مرکز تماس"
            @realodList="reloadList"
            icon="account_circle"
          />
        </v-col>
        <v-col cols="12" md="6" v-if="is_superviser" class="mt-2">
          <UserCreate
            :url="insert_operator"
            title="ایجاد اپراتور"
            @realodList="reloadList"
            icon="account_circle"
          />
        </v-col>
      </v-col>
      <v-col cols="12" md="12">
        <BaseTable
          :headers="headers"
          :BTNactions="btn_actions_super"
          :url="url"
          ref="UserlIstref"
        />
        <DialogFile
            v-if="dialog_file.show"
            :opratorId="oprator_id"
            :DialogFile="dialog_file"
          />
      </v-col>
    </v-col>
  </v-row>
</template>
<script>
import UserCreate from "@/components/CallCenter/UserCreate.vue";
import ListOprators from "@/components/CallCenter/ListOprators.vue";
import DialogFile from "@/components/CallCenter/DialogFile.vue";
export default {
  components: {
    ListOprators,
    UserCreate,
    DialogFile,
  },
  data() {
    return {
      title: "لیست کارکنان",
      url: "",
      show_list: "",
      name_superviser: "",
      oprator_id: "",
      is_super_admin: false,
      dialog_oprator_list: { items: null, show: false },
      dialog_file: { items: null, show: false },
      headers: [],
      headers_superviser: [],
      btn_actions_super: [],
      btn_actions: [],
      items_tab: ["مدیر مرکز تماس", " مرکز تماس"],
      tab: null,
      admin_url: "call-center/admin-list",
      superviser_url: "call-center/superviser-list",
      operator_url: "call-center/operator-list",
      is_superviser: false,
      is_admin: false,
      insert_operator: "/call-center/insert-operator",
      insert_superviser: "/call-center/insert-superviser",
    };
  },
  beforeMount() {
    (this.btn_actions = [
      {
        color: "green",
        icon: "group",
        text: "لیست اپراتور ها",
        fun: (body) => {
          this.dialog_oprator_list.show = true;
          this.show_list = body.id;
          this.name_superviser = body.first_name + " " + body.last_name;
        },
      },
    ]),
      (this.btn_actions_super = [
        {
        text: "مشاهده پیام  ها ",
        icon:"contact_mail",
        color: "info",
        fun: (body) => {
          this.dialog_file.show = true;
          this.oprator_id = body.id;
        },
      },
      ]),
      (this.headers = [
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
        { text: "کد ملی", filterCol: "national_code", value: "national_code" },
        {
          filterable: false,
          disableSort: true,
          filterType: "date",
          filterCol: "birth_date",
          text: "تاریخ تولد",
          value: (body) => {
            if (body.birth_date) {
              return this.$toJalali(body.birth_date, "YYYY-MM-DD", "jYYYY/jMM/jDD");
            }
            return "";
          },
        },
        {
          text: "توضیحات",
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
      ]);
    this.headers_superviser = [
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
      { text: "کد ملی", filterCol: "national_code", value: "national_code" },

      {
        text: "نام مدیر",
        value: (body) => {
          if (body.parent) {
            if (body.parent.first_name) {
              return body.parent.first_name;
            } else {
              return body.parent.username;
            }
          }
        },
      },
      {
        text: "نام خانوادگی",
        value: (body) => {
          if (body.parent) {
            if (body.parent.last_name) {
              return body.parent.last_name;
            } else {
              return "--";
            }
          }
        },
      },
    ];
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.is_superviser = true;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
      this.is_admin = true;
    }
    this.$store.dispatch("setPageTitle", this.title);
    if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.is_super_admin = true;
      this.url = this.admin_url;
    } else if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.url = this.operator_url;
    } else if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
      this.url = this.operator_url;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_call_center_id)) {
      this.url = this.superviser_url;
    }
  },
  methods: {
    reloadList() {
      this.$refs.UserlIstref.getDataFromApi();
    },
  },
};
</script>
