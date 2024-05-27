<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loading"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2 d-flex justify-center">
      <v-col cols="12" md="8">
        <amp-select
          rules="require"
          text=" ارسال خرید برای"
          :items="for_buy_item"
          v-model="for_buy"
        />
      </v-col>
      <v-col cols="12" md="4">
        <amp-jdate
          text="تاریخ ارسال"
          :is-number="true"
          rules="require"
          v-model="array_profile.send_at"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          rules="require"
          :disabled="for_buy == 'user'"
          text="نام گیرنده  "
          v-model="array_profile.first_name"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          rules="require"
          :disabled="for_buy == 'user'"
          text="نام خانوادگی "
          v-model="array_profile.last_name"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="شماره همراه"
          :isNumber="true"
          v-model="array_profile.phone_number"
          rules="require,phone"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          rules="require"
          text="بازه زمانی ارسال"
          v-model="array_profile.delivery_time_id"
          :items="time_send"
        />
      </v-col>

      <v-col cols="12">
        <v-divider></v-divider>
      </v-col>
    </v-row>
    <v-col cols="12">
      <!-- <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="primary lighten-2"
          class="subheading white--text"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title> -->
      <v-card-actions>
        <v-row class="d-flex justify-center">
          <v-col cols="3">
            <amp-button
              block
              :disabled="step === 1"
              height="40"
              @click="step--"
              color="green darken-3 "
              class="ma-1"
              text="انتخاب  آدرس "
              :loading="loading"
            />
          </v-col>
          <v-col cols="3">
            <amp-button
              block
              :disabled="step === 2"
              height="40"
              @click="step++"
              color="orange darken-3 "
              class="ma-1"
              text="افزودن آدرس "
              :loading="loading"
            />
          </v-col>
        </v-row>
      </v-card-actions>
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-col cols="12" md="12" v-if="!loading">
            <amp-select
              rules="require"
              multiple
              text="آدرس گیرنده"
              v-model="array_profile.address_ids"
              :items="address"
            />
          </v-col>
        </v-window-item>

        <v-window-item :value="2">
          <v-form v-model="valid_address">
            <v-row class="d-flex justify-center">
              <v-col cols="12" md="3">
                <amp-autocomplete
                  rules="require"
                  text="استان"
                  v-model="address_form.province_id"
                  :items="province"
                />
              </v-col>

              <v-col cols="12" md="4">
                <amp-autocomplete
                  rules="require"
                  text="شهر"
                  v-model="address_form.country_division_id"
                  :items="citis"
                  :loading="loading"
                  :disabled="!Boolean(address_form.province_id)"
                />
              </v-col>
              <v-col cols="12" md="4">
                <amp-input
                  text="کد پستی"
                  is-number
                  v-model="address_form.postal_code"
                  rules="postCode"
                ></amp-input>
              </v-col>
              <v-col cols="12" md="1">
                <v-btn :disabled="!valid_address" text @click="addAddress()" class="mt-7">
                  <v-icon size="28"> add_circle </v-icon>
                </v-btn>
              </v-col>
              <v-col cols="12" md="12">
                <amp-textarea text="آدرس" :rows="3" v-model="address_form.address" />
              </v-col>
            </v-row>
          </v-form>
        </v-window-item>
      </v-window>

      <v-divider></v-divider>
    </v-col>

    <v-row class="my-4 d-flex justify-center">
      <amp-button
        icon="arrow_circle_right"
        height="40"
        @click="backStep"
        class="ma-1"
        color="red darken-2"
        text="برگشت "
      />
      <amp-button
        icon="done"
        height="40"
        @click="nextStep"
        color="green darken-3 "
        class="ma-1"
        text="تایید "
        :loading="loading"
        :disabled="loading || !valid"
      />
      <amp-button
        v-if="show_btn"
        icon="arrow_circle_left"
        height="40"
        @click="showBTN()"
        color="info darken-3 "
        class="ma-1"
        text="بعدی "
        :loading="loading"
        :disabled="loading || !valid"
      />
    </v-row>
  </v-form>
</template>

<script>
export default {
  props: {
    basket_costumer_id: {
      require: false,
      default: false,
    },
    user_id: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      valid: true,
      valid_address: true,
      loading: false,
      show_btn: false,
      for_buy: "",

      address: [],
      address_list: [],
      province: [],
      step: 1,
      citis: [],
      time_send: [],
      for_buy_item: [
        { text: "خود کاربر ", value: "user" },
        { text: "دیگران", value: "other" },
      ],
      address_form: {
        province_id: "",
        country_division_id: "",
        address: "",
        postal_code: "",
      },
      array_profile: {
        last_name: "",
        first_name: "",
        address_ids: [],
        phone_number: "",
        send_at: "",
        delivery_time_id: "",
      },
    };
  },
  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return "Sign-up";
        case 2:
          return "Create a password";
        default:
          return "Account created";
      }
    },
  },

  mounted() {
    this.getTime();
    this.getAddress();
    this.loadState().then((res) => {
      res.filter((x) => {
        this.province.push({
          text: x.name,
          value: x.id,
        });
      });
    });
  },
  watch: {
    for_buy() {
      this.loadUserInfo();
    },
    "address_form.province_id"() {
      this.loadCitis(this.address_form.province_id);
    },
  },
  methods: {
    submit() {
      this.loading = true;
      let form = {};
      form["basket_id"] = this.basket_costumer_id;
      form["for_buy"] = this.for_buy;
      form["array_profile"] = [this.array_profile];

      this.$reqApi("basket/set-form-send", form)
        .then((response) => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getTime() {
      this.loading = true;
      this.$reqApi("delivery-time")
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const element = response.model.data[index];
            let substrings = element.range_time.split(",");
            let numbers = substrings.map((substring) => Number(substring));
            items.push({
              text: " از " + numbers[0] + " تا " + numbers[1],
              value: element.id,
            });
          }

          this.time_send = items;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    getAddress() {
      this.loading = true;
      let filters = {};
      filters = {
        user_id: {
          op: "=",
          value: this.user_id,
        },
      };
      this.$reqApi("address", { filters: filters })
        .then((response) => {
          let items = [];
          for (let index = 0; index < response.model.data.length; index++) {
            const element = response.model.data[index];
            items.push({
              text: ` استان  ${element.country_division.parent.name}   ,   ${element.country_division.name} ,  به کد پستی ${element.postal_code} | آدرس :      ${element.address}

         
              `,
              value: element.id,
            });
          }
          this.address = items;
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadUserInfo() {
      this.loading = true;
      this.$reqApi("/user/show", { id: this.user_id })
        .then(async (response) => {
          this.array_profile.phone_number = response.model.username;
          this.array_profile.last_name = response.model.last_name;
          this.array_profile.first_name = response.model.first_name;

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.redirectPage();
          this.loading = false;
        });
    },
    addAddress() {
      this.loading = true;
      let url = "/address/insert";
      let form = {};
      form["user_id"] = this.user_id;
      form["postal_code"] = this.address_form.postal_code;
      form["province_id"] = this.address_form.province_id;
      form["country_division_id"] = this.address_form.country_division_id;
      form["address"] = this.address_form.address;

      this.$reqApi(url, form)
        .then((res) => {
          this.getAddress();
          this.$toast.success("آدرس با مو فقیت ثبت شد");
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
    nextStep() {
  
      this.show_btn = true;
      this.submit();
    },
    showBTN() {
      this.$emit("nextStep");

    },
    backStep() {
      this.$emit("backStep");
    },
    loadState() {
      return new Promise((response, rej) => {
        let filters = {
          level: {
            op: "=",
            value: "province",
          },
        };
        this.$reqApi("/shop/country-division", {
          filters: filters,
          row_number: 3000000,
        })
          .then((res) => {
            response(res.model.data);
          })
          .catch((err) => {
            return err;
          });
      });
    },
    filterProvince(id) {
      return new Promise((res, rej) => {
        let filter = {
          id: id,
        };
        this.$reqApi("/shop/country-division", { filters: filter })
          .then((res) => {
            if (res.model.data) {
              this.province_id = res.model.data[0].cd2_id;
              setTimeout(() => {
                this.form.country_division_id = res.model.data[0].id;
              }, 500);
            }
          })
          .catch((err) => {
            return err;
          });
      });
    },
    loadCitis(id) {
      this.citis = [];
      let filters = {
        parent_id: {
          op: "=",
          value: id,
        },
      };
      if (id) {
        let data = [];
        this.$reqApi("/shop/country-division", {
          filters: filters,
          row_number: 300000,
        })
          .then((res) => {
            data = res.model.data;
            data.filter((x) => {
              this.citis.push({
                text: x.name,
                value: x.id,
              });
            });
          })
          .catch((err) => {
            return err;
          });
      }
    },
  },
};
</script>
