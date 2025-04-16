<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="450">
      <v-card class="pb-3">
        <div class="text-center">
          <v-col cols="12" class="text-start">
            <v-btn icon @click="closeDialog">
              <v-icon> close </v-icon>
            </v-btn>
          </v-col>
          <div v-if="item.user" class="d-flex align-center mr-10">
            <v-avatar size="88" v-if="item.user">
              <v-img :src="$getImage(item.user.avatar)"></v-img>
            </v-avatar>
            <div class="mr-4 text-end mt-2">
              <strong class="font_12">
                نام و نام خانوادگی :‌
                {{ item.user.first_name }} {{ item.user.last_name }} - (
                {{ item.user.username }})</strong
              >
              <br />

              <strong class="font_12 grey--text">
                کد ملی : {{ item.user.national_code }}</strong
              >

              <br />

              <strong class="font_12 grey--text">
                تاریخ تولد :‌
                {{
                  $toJalali(item.user.birth_date, "YYYY-MM-DD", "jYYYY/jMM/jDD")
                }}
              </strong>
              <br />
              <strong class="font_12 grey--text">
                شغل قبلی :‌ {{ item.previous_workplace }}</strong
              >
              <br />
              <strong class="font_12 grey--text">
                رشته تحصیلی :‌ {{ item.highest_degree }}</strong
              >
            </div>
          </div>
          <v-col cols="12" class="mt-4">
            <amp-textarea
              rules="require"
              :rows="3"
              label="علت رد درخواست استخدام"
              v-model="form.message"
            ></amp-textarea>
            <v-btn
              :disabled="!Boolean(form.message) || loading"
              @click="closeRequestForm"
              color="error lighten-3"
            >
              <span class="font_14 --text"> رد درخواست </span>
              <v-icon small color="" class="mr-2"> block</v-icon>
            </v-btn>
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    dialog: {
      require: false,
      default: false,
    },

    item: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        id: "",
        message: "",
      },
    };
  },

  mounted() {},
  methods: {
    closeRequestForm() {
      this.loading = true;
      let form = this.form;
      form.id = this.item.id;
      this.$reqApi("employment-form/close-form", form)
        .then((res) => {
          let user =
            this.item.user.first_name && this.item.user.first_name
              ? this.item.user.first_name + " " + this.item.user.first_name
              : this.item.user.username;
          this.$toast.success(`درخواست همکاری  ${user} با موفقیت رد شد`);
          this.closeDialog();
        this.$emit("refresh");

        })
        .catch((err) => {});
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
  },
};
</script>
