<template>
  <v-row>
    <v-col cols="12" md="12" v-if="is_super_admin">
      <v-tabs v-model="tab" class="ma-3 center-div" color="white">
        <v-tab v-for="(item, index) in items_tab" :key="item" color="white">
          <v-chip
            dark
            color="primary"
            class="white--text"
            :outlined="tab != index"
          >
            {{ item }}
          </v-chip>
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item class=""
          ><BaseTable :headers="headers" :url="superviser_url"
        /></v-tab-item>
        <v-tab-item class=""
          ><BaseTable :headers="headers" :url="operator_url"
        /></v-tab-item>
      </v-tabs-items>
    </v-col>
    <v-col cols="12" md="12">
      <v-row class="d-flx justify-center">
        <v-col cols="12" md="5" v-if="is_admin" class="mt-2">
          <DistributeOperator
            :url="superviser_distribute"
            title="توضیح دستی پیام"
            :userListUrl="superviser_list"
            icon="send"
          />
        </v-col>
        <v-col cols="12" md="6" v-if="is_admin" class="mt-2">
          <UserCreate
            :url="insert_superviser"
            title="ایجاد سوپروایزر"
            icon="account_circle"
          />
        </v-col>
        <v-col cols="12" md="5" v-if="is_superviser">
          <v-row class="pa-5">
            <v-col cols="12" md="3" class="ma-2">
              <v-btn class="primary" @click="autoDistribute">
                <span>تخصیص خودکار</span>
                <v-icon class="mx-2">storage</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="3" class="ma-2">
              <v-btn class="success" @click="manualDistribute">
                <span>تخصیص دستی</span>
                <v-icon class="mx-2">checklist_rtl</v-icon>
              </v-btn>
              <DialogUserSelect
                :UserDialog="dialog_user_manual"
                title="انتخاب اپراتور"
                :listUrl="operator_list"
                @selectUser="setManualDistribute"
                @close="dialog_user_manual = false"
              />
            </v-col>
            <v-col cols="12" md="4" class="ma-2">
              <v-btn class="blue" dark @click="percentDistribute">
                <span> تخصیص بر اساس سابقه فروش</span>
                <v-icon class="mx-2">storefront</v-icon>
              </v-btn>
              <DialogUserSelect
                :UserDialog="dialog_serperviser"
                title="انتخاب سوپروایزر"
                :listUrl="superviser_list"
                @selectUser="setPrcentDistrubute"
                @close="dialog_serperviser = false"
              />
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" md="6" v-if="is_superviser" class="mt-2">
          <UserCreate
            :url="insert_operator"
            title="ایجاد اپراتور"
            icon="account_circle"
          />
        </v-col>
      </v-row>
    </v-col>
    <v-col cols="12" md="12" v-if="url && !is_super_admin">
      <BaseTable :headers="headers" :url="url" v-model="selected_item" />
    </v-col>
  </v-row>
</template>
<script>
import DistributeOperator from "@/components/CallCenter/DistributeSuperviser.vue";
import DialogUserSelect from "~/components/CallCenter/DialogUserSelect.vue";
import UserCreate from "~/components/CallCenter/UserCreate.vue";
export default {
  components: { DistributeOperator, DialogUserSelect, UserCreate },
  data() {
    return {
      title: "پیام های دریافتی",
      url: "",
      tab: null,
      dialog_user_manual: false,
      dialog_serperviser: false,
      is_super_admin: false,
      is_superviser: false,
      is_admin: false,
      selected_item: [],
      is_operator: false,
      items_tab: ["پیام های دریافتی  سرپرست", "پیام های دریافتی اپراتور"],
      headers: [],
      superviser_url: "/call-center/superviser-messages",
      operator_url: "/call-center/operators-messages",
      superviser_distribute: "/call-center/distribute-superviser",
      operator_distribute: "/call-center/distribute-operator ",
      operator_distribute_manul: "/call-center/distribute-operator-manual ",
      operator_distrubute_by_sell_percent:"/call-center/distribute-by-sell-percent ",
      superviser_list: "/call-center/superviser-list",
      operator_list: "/call-center/operator-list ",
      insert_operator: "/call-center/insert-operator",
      insert_superviser: "/call-center/insert-superviser",
    };
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    if (this.$checkRole(this.$store.state.auth.role.superviser_id)) {
      this.is_superviser = true;
      this.headers.unshift({
        text: "",
        width: "30px",
        type: "checkbox",
        disableSort: true,
        filterable: false,
      });
      this.url = this.superviser_url;
    } else if (this.$checkRole(this.$store.state.auth.role.oprator_id)) {
      this.is_operator = true;
      this.url = this.operator_url;
    } else if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
      this.is_super_admin = true;
    } else if (
      this.$checkRole(this.$store.state.auth.role.admin_call_center_id)
    ) {
      this.url = this.superviser_url;
      this.is_admin = true;
    }
  },
  methods: {
    manualDistribute() {
      if (this.selected_item) {
        this.$toast.error("موردی انتخاب نشده است");
        return;
      }
      this.dialog_user_manual = true;
    },
    setManualDistribute(event) {
      if (!event) {
        this.$toast.error("اپراتور فروش انتخاب نشده است");
        return;
      }

      console.log(this.selected_item);
      console.log(event);
      let form = {
        operator_id: event,
        message_id: this.selected_item,
      };
      this.$refs("/call-center/distribute-operator-manual", form)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    autoDistribute() {
      this.$reqApi("/call-center/distribute-operator")
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
    },
    percentDistribute() {
      this.dialog_serperviser = true;
    },
    setPrcentDistrubute(event) {
      if (event) {
        console.log(event);
        let form = {
          superviser_id: event,
        };
        this.$reqApi("/call-center/distribute-by-sell-percent", form)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err);
            return err;
          });
      }
    },
  },
};
</script>
