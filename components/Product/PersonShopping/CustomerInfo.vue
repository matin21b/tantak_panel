<template>
  <v-row class="justify-center align-center">
    <v-col cols="12" md="12" class="text-center">
      <amp-input
        class="ltr-item"
        text=" شماره همراه "
        rules="phone,require"
        v-model="customer.username"
      />
      <v-row
      class="mx-3 my-5"
        v-if="Boolean(customer.username) && customer.username.length == 11"
      >
        <v-btn
          outlined
          text
          width="48%"
          height="36"
          color="blue-grey"
          @click="submit"
          :disabled="!Boolean(customer.username)"
        >
          <h1>
            ثبت شماره همراه
            <v-icon color="blue-grey" class="mr-1"> task_alt </v-icon>
          </h1>
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          outlined
          text
          width="48%"
          height="36"
          color="teal darken-1"
          @click="overlay = !overlay"
          :disabled="!Boolean(customer.username)"
        >
          <h1>
            تکمیل اطلاعات
            <v-icon color="teal darken-1" class="mr-1"> person_add </v-icon>
          </h1>
        </v-btn>
      </v-row>

      <v-alert
        dense
        text
        color="blue-grey"
        border="left"
        prominent
        icon="account_circle"
        class="text-end mt-8"
      >
        <h1 class="font_12 mt-4">
          چنان چه شماره همراه وارد شده در کاربران تنتاک وجود نداشته باشد , کاربر
          جدید ایجاد میشود
        </h1>

        <v-col cols="12">
          <v-overlay :dark="false" :value="overlay">
            <v-row class="d-flex justify-center">
              <v-col cols="12">
                <v-card
                  color="white"
                  width="400"
                  style="border-radius: 15px !important"
                  class="pa-2"
                >
                  <v-col cols="12" md="12">
                    <amp-input text="نام" v-model="customer.first_name" />
                    <amp-input
                      text="نام خانوادگی"
                      v-model="customer.last_name"
                      rules=""
                    />
                  </v-col>
                  <v-row class="d-flex justify-center">
                    <v-col cols="12" md="2" class="ma-2">
                      <amp-button
                        text="تایید"
                        height="38"
                        block
                        color="teal darken-2"
                        @click="submit"
                        class="ma-1"
                        :disabled="
                          !Boolean(customer.last_name) ||
                          !Boolean(customer.first_name)
                        "
                      />
                    </v-col>
                    <v-col cols="12" md="2" class="ma-2">
                      <amp-button
                        text="انصراف"
                        height="38"
                        block
                        color="red darken-2"
                        @click="overlay = false"
                        class="ma-1"
                      />
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
          </v-overlay>
        </v-col>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    userId: {
      default: false,
      require: false,
    },
    basketCostumerId: {
      default: false,
      require: false,
    },
  },
  data: () => ({
    absolute: true,
    overlay: false,
    customer: {
      first_name: "",
      last_name: "",
      username: "",
    },
  }),

  mounted() {},
  methods: {
    submit() {
      this.$emit("customer", this.customer);
      this.overlay = false
      this.$emit("nextStep");
    },
  },
};
</script>
<style scoped>
.clicabel :hover {
  color: rgb(240, 70, 70);
  border-bottom: 1px solid rgb(240, 70, 70);
  cursor: pointer;
}
</style>
