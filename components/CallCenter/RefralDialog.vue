<template>
  <div>
    <v-dialog
      persistent
      v-model="refralDialog.show"
      :model-id="refralDialog.items"
      width="600"
    >
      <v-card>
        <v-row class="mx-3 pt-8">
          <h1 style="font-size: 16px">برسی سفارش ثبت شده</h1>
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-row>
        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>

        <v-card-text>
          <v-form v-model="valid" @submit.prevent="submit()">
            <v-row>
              <v-col cols="12" md="7">
                <amp-select
                  text="تغییر وضعیت"
                  :items="step_items"
                  v-model="form.step"
                  rules="require"
                ></amp-select>
              </v-col>
              <v-col cols="12" md="5" >
                <AmpUploadFileNew title="بارگذاری فایل" v-model="form.file" />
              </v-col>
            <v-col cols="12" v-if="show_select_user">
              <UserSelectForm
                :text="title_select"
                v-model="user"
                :url="url"
                rules="require"
              />
            </v-col>

            <v-col cols="12">
              <amp-textarea
                text="پیام"
                v-model="form.message"
                rules="require"
              ></amp-textarea>
            </v-col>
          </v-row>

            <v-row class="ma-1 d-flex justify-center">
              <v-col cols="3">
                <amp-button
                  block
                  text="تایید"
                  color="teal darken-3"
                  type="submit"
                  class="ma-1"
                  :loading="loading"
                  :disabled="!valid || loading"
                ></amp-button>
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  props: {
    basketId: {
      require: false,
      default: false,
    },
    stepOrder: {
      require: false,
      default: false,
    },
    refralDialog: {
      require: false,
      default: false,
    },
  },
  components: { UserSelectForm },

  data: () => ({
    valid: true,
    url: "",
    message: "",
    title_select: "",
    form: {
      step: "",
      message: "",
      file: "",
    },
    valid_comment: true,
    step_items: [],
    user: [],
    loading: false,
    show_select_user: false,
    is_admin: false,
    is_financial_unit: false,
    supervisor_coordinator: false,
    is_supervisor_coordinator: false,
    manager_financial_unit: false,
    is_manager_financial_unit: false,
    is_head_financial_unit: false,
    is_coordinating_manager: false,
    is_coordinator: false,
    delivery_coordination_manager: false,
    delivery_coordination_supervisor: false,
    delivery_coordination: false,
  }),
  mounted() {
    this.setOPtion();
  },
  watch: {
    "form.step"() {
      switch (this.form.step) {
        case "refer_fiscal_manager":
          this.show_select_user = true;
          this.url = "user/fiscal-manager";
          this.title_select = "انتخاب مدیر واحد مالی";
          break;

        case "manager_supervisor_fiscal":
          this.show_select_user = true;
          this.url = "user/list-employee";
          this.title_select = "انتخاب سرپرست واحد مالی";
          break;

        case "supervisor_to_fiscal":
          this.show_select_user = true;
          this.url = "user/list-employee";
          this.title_select = "انتخاب  واحد مالی";
          break;

        case "manager_supervisor_coordinator":
          this.show_select_user = true;
          this.url = "user/list-employee";
          this.title_select = "انتخاب سرپرست";
          break;

        case "supervisor_to_coordinator":
          this.show_select_user = true;
          this.url = "user/list-employee";
          this.title_select = "انتخاب هماهنگ کننده";
          break;

        case "admin_manager_send":
          this.show_select_user = true;
          this.url = "user/send-manager";
          this.title_select = "انتخاب  مدیر هماهنگی ارسال";
          break;
        case "manager_supervisor_send":
          this.show_select_user = true;
          this.url = "user/list-employee";
          this.title_select = "انتخاب  سرپرست هماهنگی ارسال";
          break;
        case "supervisor_to_send":
          this.show_select_user = true;
          this.url = "user/list-employee";
          this.title_select = "انتخاب   هماهنگ کننده ارسال";
          break;
        default:
          this.show_select_user = false;
          break;
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = {};
      form = { ...this.form };
      form["id"] = this.basketId;
      if (Boolean(this.user) && Boolean(this.user[0])) {
        form["user_refer_id"] = this.user[0].id;
      }

      let url = "basket/referral";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.closeDialog();
          this.relod();
          this.$toast.success("سفارش با موفقیت به هماهنگ کننده ارجاع داده شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.refralDialog.show = false;
      this.refralDialog.items = null;
    },
    relod() {
      this.$emit("relod");
    },
    setOPtion() {
      this.chekRole();
      this.setStepItems();
    },
    chekRole() {
      if (this.$checkRole(this.$store.state.auth.role.admin_id) || this.$checkRole(this.$store.state.auth.role.oprator_id)) {
        this.is_admin = true;
      }
      if (this.$checkRole(this.$store.state.auth.role.financial_unit_id)) {
        this.is_financial_unit = true;
      }
      if (this.$checkRole(this.$store.state.auth.role.supervisor_coordinator)) {
        this.is_supervisor_coordinator = true;
      }
      if (this.$checkRole(this.$store.state.auth.role.coordinating_manager)) {
        this.is_coordinating_manager = true;
      }
      if (this.$checkRole(this.$store.state.auth.role.manager_financial_unit)) {
        this.is_manager_financial_unit = true;
      }
      if (this.$checkRole(this.$store.state.auth.role.head_financial_unit)) {
        this.is_head_financial_unit = true;
      }
      if (this.$checkRole(this.$store.state.auth.role.coordinator_id)) {
        this.is_coordinator = true;
      }
      if (
        this.$checkRole(
          this.$store.state.auth.role.delivery_coordination_manager
        )
      ) {
        this.delivery_coordination_manager = true;
      }
      if (
        this.$checkRole(
          this.$store.state.auth.role.delivery_coordination_supervisor
        )
      ) {
        this.delivery_coordination_supervisor = true;
      }
      if (this.$checkRole(this.$store.state.auth.role.delivery_coordination)) {
        this.delivery_coordination = true;
      }
    },
    setStepItems() {
      if (Boolean(this.is_admin)) {
        if (this.stepOrder == "accept_coordinator") {
          this.step_items = [
            { text: "بستن سبد", value: "reject" },
            {
              text: "ارجاع به مدیر  هماهنگی ارسال",
              value: "admin_manager_send",
            },
          ];
          this.url = "user/send-manager";
        } else {
          this.step_items = [
            { text: "بستن سبد", value: "reject" },
            { text: "ارجاع به مدیر واحد مالی", value: "refer_fiscal_manager" },
          ];
          this.url = "user/fiscal-manager";
        }
      }
      if (Boolean(this.is_manager_financial_unit)) {
        this.step_items = [
          {
            text: "ارجاع به سرپرست واحد مالی",
            value: "manager_supervisor_fiscal",
          },
          { text: "برگشت سبد خرید", value: "reject_fiscal_manager" },
        ];
      }
      if (Boolean(this.is_head_financial_unit)) {
        this.step_items = [
          { text: "ارجاع به واحد مالی", value: "supervisor_to_fiscal" },
          { text: "برگشت سبد خرید", value: "supervisor_manager_fiscal" },
        ];
      }
      if (Boolean(this.is_financial_unit)) {
        this.step_items = [
          { text: "تایید سفارش", value: "accept_fiscal" },
          { text: "عدم تایید و برگشت سفارش", value: "fiscal_to_supervisor" },
        ];
      }
      if (Boolean(this.is_coordinating_manager)) {
        this.step_items = [
          { text: "برگشت", value: "manager_admin_coordinator" },
          {
            text: "ارجاع به سرپرست هماهنگ کننده",
            value: "manager_supervisor_coordinator",
          },
        ];
      }
      if (Boolean(this.is_supervisor_coordinator)) {
        this.step_items = [
          { text: "برگشت سفارش", value: "supervisor_manager_coordinator" },
          {
            text: "ارجاع  به هماهنگ کننده",
            value: "supervisor_to_coordinator",
          },
        ];
      }
      if (Boolean(this.is_coordinator)) {
        this.step_items = [
          {
            text: "برگشت به سرپرست",
            value: "coordinator_to_supervisor",
          },
          {
            text: "تایید سفارش",
            value: "accept_coordinator",
          },
        ];
      }
      if (Boolean(this.delivery_coordination_manager)) {
        this.step_items = [
          {
            text: "برگشت ",
            value: "manager_admin_send",
          },
          {
            text: " ارجاع به سرپرست هماهنگی ارسال",
            value: "manager_supervisor_send",
          },
        ];
      }
      if (Boolean(this.delivery_coordination_supervisor)) {
        this.step_items = [
          {
            text: "برگشت ",
            value: "supervisor_manager_send",
          },
          {
            text: " ارجاع به هماهنگ کننده ارسال",
            value: "supervisor_to_send",
          },
        ];
      }
      if (Boolean(this.delivery_coordination)) {
        this.step_items = [
          {
            text: "برگشت ",
            value: "send_to_supervisor",
          },
        ];
      }
    },
  },
};
</script>
