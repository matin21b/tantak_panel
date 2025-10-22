<template>
  <div>
    <v-col cols="12 mb-8">
      <v-card outlined class="pa-3 text-center elevation-1">
        <v-col cols="12 " class="pr-10">
          <h1 class="font_12">
            کیف پول نقدی :
            <b class="mx-1 teal--text font_18 mr-3">
              <small> ریال </small>
              {{ $price(user.cash_wallt) }}
            </b>
          </h1>
          <h1 class="font_12 mt-4">
            کیف پول اعتباری :

            <b class="mx-1 teal--text font_18 mr-3">
              <small> ریال </small>
              {{ $price(user.credit_wallt) }}
            </b>
          </h1>
          <h1 class="font_12 mt-4" v-if="cheke_role">
            موجودی غیر قابل برداشت :

            <b class="mx-1 red--text font_18 mr-3">
              <small> ریال </small>
              {{ $price(unremovable_cash_wallet) }}
            </b>
          </h1>
        </v-col>
        <v-btn
          text
          rounded
          :plain="selected_key == x.value ? false : true"
          :class="
            selected_key == x.value
              ? 'elevation-5 primary--text'
              : 'elevation-1 blue-grey--text'
          "
          outlined
          class="ma-2 px-8"
          v-for="(x, i) in items"
          color=""
          :disabled="!Boolean(cheke_role) && x.value != 'info'"
          @click="selected_key = x.value"
        >
          <v-icon size="15" v-if="selected_key == x.value" small>
            fiber_smart_record
          </v-icon>
          <v-icon size="14" v-else> trip_origin </v-icon>
          <b class="mr-1">
            {{ x.text }}
          </b>
        </v-btn>
      </v-card>
    </v-col>

    <v-form
      v-if="selected_key == 'info'"
      v-model="valid"
      @submit.prevent="submit()"
      :disabled="loading"
    >
      <v-container fluid class="px-8">
        <v-row dens>
          <v-col cols="12" md="3">
            <amp-input
              readonly
              text="نام"
              rules="require,fa_chart"
              v-model="form.first_name"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              readonly
              text="نام خانوادگی"
              rules="require,fa_chart"
              v-model="form.last_name"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-input
              text="رمز عبور"
              type="password"
              class="ltr-item"
              rules="password"
              v-model="form.password"
            />
          </v-col>
          <v-col cols="12" md="3">
            <amp-upload-file v-model="form.avatar" />
          </v-col>

          <v-col cols="12" md="3" v-if="Boolean(user)">
            <amp-input
              readonly
              text="کد معرف "
              cClass="ltr-item"
              v-model="user.reagent_code"
            />
          </v-col>
          <v-col cols="12" md="3" v-if="Boolean(user)">
            <amp-input
              readonly
              text="کد پرسنلی"
              cClass="ltr-item"
              v-model="user.personnel_code"
            />
          </v-col>
        </v-row>

        <v-row dense>
          <v-col cols="12" md="12">
            <v-divider />
          </v-col>
          <v-col cols="12" md="12" class="text-center">
            <amp-button
              large
              icon="done"
              class="my-1"
              type="submit"
              text="ویرایش"
              color="success"
              :loading="loading"
              :disabled="!valid || loading"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>

    <v-col
      v-if="Boolean(cheke_role)"
      v-show="selected_key == 'transactions'"
      cols="12"
      md="12"
    >
      <MyWallet />
    </v-col>
    <v-col
      v-if="Boolean(cheke_role)"
      v-show="selected_key == 'request_mony'"
      cols="12"
    >
      <MoneyRequestPersonal />
    </v-col>
  </div>
</template>

<script>
import MyWallet from "@/components/Cartabl/MyWallet.vue";
import MoneyRequestPersonal from "@/components/MoneyRequest/MoneyRequestPersonal.vue";

export default {
  components: {
    MyWallet,
    MoneyRequestPersonal,
  },
  props: { modelId: { default: null } },
  data: () => ({
    valid: false,
    loading: false,
    user: {},
    selected_key: "info",
    form: {
      avatar: "",
      password: "",
      last_name: "",
      first_name: "",
    },
    user_id: "",
    unremovable_cash_wallet: null,
    desserts: [],
    items: [
      { text: "اطلاعات", value: "info" },
      { text: "تراکنش ها", value: "transactions" },
      { text: "درخواست وجه", value: "request_mony" },
    ],
    title: "پروفایل",
  }),
  mounted() {
    this.$store.dispatch("setPageTitle", this.title);
    this.user = this.$store.state.auth.user;
    this.loadData();
    this.unremovableCashWallet();
  },
  computed: {
    cheke_role() {
      if (this.$checkRole(this.$store.state.auth.role.admin_id)) {
        return false;
      } else {
        return true;
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      this.$reqApi("/user/profile", {
        avatar: this.form.avatar,
        password: this.form.password,
      })
        .then((response) => {
          this.$toast.success("اطلاعات ویرایش شد");
          this.$store.dispatch("auth/nuxtServerInit");
          this.loading = false;
          this.redirectPage();
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi("/auth/user")
        .then(async (response) => {
          this.user_id = response.user.id;
          this.form.avatar = response.user.avatar;
          this.form.password = response.user.password;
          this.form.last_name = response.user.last_name;
          this.form.first_name = response.user.first_name;
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
        });
    },
    unremovableCashWallet() {
      const request = this.$reqApi("fee-log/unremovable-cash-wallet");
      request
        .then((res) => {
          this.unremovable_cash_wallet = res;
        })
        .catch((err) => {});
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    },
  },
};
</script>
<!-- <style scoped>
.width_box {
  width: 20.255555555%;
}
</style> -->
