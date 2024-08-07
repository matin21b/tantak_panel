<template>
  <v-card style="overflow: hidden;border: grey 1px dashed; border-radius: 10px;" class="pa-5 elevation-0"  >
    <v-row class="d-flex justify-center">
      <v-col cols="12" class="text-center">
        <v-icon size="60"> account_circle </v-icon>

        <h1 v-if="data.first_name && data.last_name" class="mx-2">
          {{ data.first_name }} {{ data.last_name }}
        </h1>
      </v-col>
      <v-col cols="12" md="12" class="text-center mb-5">
        <v-row class="align-center pa-3">
          <h1 class="font_11">کد پستی </h1>

          <v-divider  class="mx-2"></v-divider>
          <h1 class="font_11" >
            {{ data.postal_code }}
          </h1>
        </v-row>

        <v-row class="align-center pa-3">
          <h1 class="font_11">بازه زمانی ارسال</h1>

          <v-divider class="mx-2"></v-divider>
          <h1 class="font_11">{{ data.delivery_time }} روز</h1>
        </v-row>
        <v-row class="align-center pa-3">
          <h1 class="font_11">تاریخ ارسال </h1>

          <v-divider class="mx-2"></v-divider>
          <h1 class="font_11">
            {{ $toJalali(data.send_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") }}
          </h1>
        </v-row>
        <v-col  cols="12"class="text-end  pa-3 pt-5">
          <v-row class="align-center">
            <h1 class="font_13 ml-2">آدرس گیرنده :</h1>
     
     <span class="font_11">
       {{ data.address }}
     </span>
          </v-row>

        </v-col>
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    data: {
      require: false,
      default: false,
    },
  },

  data: () => ({}),
  mounted() {
  },
};
</script>

<style></style>
