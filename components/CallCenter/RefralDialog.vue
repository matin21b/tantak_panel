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
            <v-col cols="12">
              <amp-select
                text="تغییر وضعیت"
                :items="step_items"
                v-model="form.step"
                rules="require"
              ></amp-select>
              <UserSelectForm
                v-if="show_select_user"
                :text="title_select"
                v-model="user"
                :url="url"
                rules="require"
              />
            </v-col>
            <v-col cols="12">
              <amp-textarea text="پیام" v-model="form.message"></amp-textarea>
            </v-col>

            <v-row class="ma-1 d-flex justify-center">
              <v-col cols="12">
                <amp-button
                  block
                  text="تایید"
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
  }),
  mounted() {
    this.setOPtion();
  },
  watch: {
    "form.step"() {
      if (this.form.step == "refer_fiscal_manager") {
        this.show_select_user = true;
        this.url = "user/fiscal-manager";
        this.title_select = "انتخاب مدیر واحد مالی";
      } else if (this.form.step == "manager_supervisor_fiscal") {
        this.show_select_user = true;
        this.url = "user/list-employee";
        this.title_select = "انتخاب سرپرست واحد مالی";
      } else if (this.form.step == "supervisor_to_fiscal") {
        this.show_select_user = true;
        this.url = "user/list-employee";
        this.title_select = "انتخاب  واحد مالی";
      } else if (this.form.step == "manager_supervisor_coordinator") {
        this.show_select_user = true;
        this.url = "user/list-employee";
        this.title_select = "انتخاب سرپرست";
      } else if (this.form.step == "supervisor_to_coordinator") {
        this.show_select_user = true;
        this.url = "user/list-employee";
        this.title_select = "انتخاب هماهنگ کننده";
      } else {
        this.show_select_user = false;
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
    async setOPtion() {
      await this.chekRole();
      this.setStepItems();
    },
    chekRole() {
      if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
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
    },
    setStepItems() {
      if (Boolean(this.is_admin)) {
        this.step_items = [
          { text: "بستن سبد", value: "reject" },
          { text: "ارجاع به مدیر واحد مالی", value: "refer_fiscal_manager" },
        ];
        this.url = "user/fiscal-manager";
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
      }     if (Boolean(this.is_coordinator)) {
        this.step_items = [
        {
        text: "برگشت به سرپرست",
        value: "coordinator_to_supervisor",
      },
        ];
      }
    },
  },
};
</script>
