<template>
  <v-dialog v-model="dialog" width="380" persistent>
    <v-card class="pa-3">
      <v-col cols="12" class="text-center d-flex align-center">
        <h1 class="font_16">تعیین وضعیت</h1>
        <v-spacer></v-spacer>
        <h1>
          <small
          class="grey--text"
            v-if="
              data && data.user && data.user.first_name && data.user.last_name
            "
          >
            {{ data.user.first_name }} {{ data.user.last_name }}
          </small>
          <br>
          <small>
                    شماره فاکتور :‌ {{ data.basket.factor_number }}
          </small>
        </h1>

      </v-col>
      <v-col cols="12">
        <v-form v-model="valid">
          <amp-select
            text="وضعیت محصول"
            v-model="form.status"
            :items="$store.state.static.status_return_product"
            rules="require"
          />
          <amp-input
            text="تعداد"
            v-model="form.number"
            cClass="ltr-item"
            rules="number,require"
          />
        </v-form>
        <v-row class="d-flex justify-center">
          <v-col cols="12" md="4">
            <amp-button
              text="تایید"
              height="38"
              block
              color="teal darken-2"
              type="submit"
              class="ma-1"
              :loading="loading"
              :disabled="loading || !valid"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-button
              text="انصراف"
              height="38"
              block
              color="red darken-2"
              @click="closeDialog"
              class="ma-1"
            />
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    data: {
      default: "",
    },
    dialog: {
      default: false,
    },
  },
  data: () => ({
    valid: true,
    loading: false,
    form: {},
  }),
  methods: {
    submit() {
      this.loading = true;
      this.$reqApi("return-product/change-status", form)
        .then((res) => {
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
