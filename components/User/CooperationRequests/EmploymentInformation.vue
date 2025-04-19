<template>
  <div class="text-center">
    <v-dialog v-model="dialog" persistent width="820">
      <v-card class="pa-3">
        <div class="text-center main-div">
          <v-col cols="12" class="d-flex align-center">
            <v-avatar size="70" v-if="item.user">
              <v-img :src="$getImage(item.user.avatar)"></v-img>
            </v-avatar>
            <div class="text-end mr-2">
              <strong class="font_14">
                {{ item.user.first_name }} {{ item.user.last_name }}
              </strong>
              <br />
              <strong class="font_14 grey--text">
                شماره همراه :
                {{ item.user.username }}
              </strong>
            </div>

            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog">
              <v-icon> close </v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" class="px-14">
            <v-divider></v-divider>
            <v-divider></v-divider>
          </v-col>
          <v-col cols="12" class="px-14">
            <v-row>
              <v-col cols="6">
                <v-card
                  width="100%"
                  outlined
                  class="pa-3 px-6 text-center elevation-4"
                >
                  <v-icon size="45" color=" blue-grey lighten-3">
                    account_circle
                  </v-icon>
                  <div
                    class="d-flex text-center justify-space-between align-center mt-3"
                  >
                    <div class="text-center">
                      <span class="font_14"> کد ملی </span>
                      <br />

                      <strong class="font_12 blue-grey--text">
                        {{ item.user.national_code }}
                      </strong>
                    </div>
                    <div class="text-center">
                      <span class="font_14"> تاریخ تولد </span>
                      <br />

                      <strong class="font_12 blue-grey--text">
                        {{
                          $toJalali(
                            item.user.birth_date,
                            "YYYY-MM-DD",
                            "jYYYY/jMM/jDD"
                          )
                        }}
                      </strong>
                    </div>
                    <div class="text-center">
                      <span class="font_14"> وضعیت تاهل </span>
                      <br />

                      <strong
                        v-if="item.marital_status == 'married'"
                        class="font_12 blue-grey--text"
                      >
                        متاهل
                      </strong>
                      <strong v-else class="font_12 blue-grey--text">
                        مجرد
                      </strong>
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card
                  width="100%"
                  outlined
                  class="pa-3 px-6 text-center elevation-4"
                >
                  <v-icon size="45" color=" blue-grey lighten-3">
                    stars
                  </v-icon>
                  <div
                    class="d-flex text-center justify-space-between align-center mt-3"
                  >
                    <div class="text-center">
                      <span class="font_14"> شغل قبلی </span>
                      <br />

                      <strong class="font_12 blue-grey--text">
                        {{ item.previous_workplace }}
                      </strong>
                    </div>
                    <div class="text-center">
                      <span class="font_14"> مدرک تحصیلی </span>
                      <br />

                      <strong class="font_12 blue-grey--text">
                        {{ item.highest_degree }}
                      </strong>
                    </div>
                    <div class="text-center">
                      <span class="font_14"> رشته تحصیلی </span>
                      <br />

                      <strong class="font_12 blue-grey--text">
                        {{ item.field_study }}
                      </strong>
                    </div>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card
                  width="100%"
                  outlined
                  class="pa-1 text-center elevation-4"
                >
                  <v-img
                    style="opacity: 0.3"
                    height="135"
                    :src="$getImage(item.pdf_path)"
                  ></v-img>
                  <v-btn @click="getImage(item.pdf_path)" outlined block class="mt-1" color="blue-grey">
                    بارگیری فایل آپلود شده
                  </v-btn></v-card
                >
              </v-col>
              <v-col cols="12">
                <v-card width="100%" class="text-end elevation-0">
                  <ul class="pa-5">
                    <li class='my-3' v-if="item.job_position.value">
                      <strong class="font_14">
                        عنوان شغلی :‌ {{ item.job_position.value }}
                      </strong>
                      <br />
                      <strong class="font_14 grey--text">
                        {{ item.job_position.value_2 }}
                      </strong>
                    </li>

                    <li class='my-3'
                      v-if="
                        item.employment_start_date && item.employment_end_date
                      "
                    >
                      <strong class="font_14">
                        تاریخ شروع اشتغال از
                        <strong class="font_14 grey--text mx-2">
                          {{
                            $toJalali(
                              item.employment_start_date,
                              "YYYY-MM-DD",
                              "jYYYY/jMM/jDD"
                            )
                          }}
                        </strong>

                        تا
                        <strong class="font_14 grey--text mx-2">
                          {{
                            $toJalali(
                              item.employment_end_date,
                              "YYYY-MM-DD",
                              "jYYYY/jMM/jDD"
                            )
                          }}
                        </strong>
                      </strong>
                    </li>

                    <li class='my-3' v-if="item.email">
                      <strong v-if="Boolean(item.email)" class="font_14">
                        آدرس الکترونیکی ثبت شده :
                        {{ item.email }}
                      </strong>
                    </li>
                    <li class='my-3' v-if="Boolean(item.separation_reason)">
                      <strong class="font_14">
                        علت جدایی:
                        {{ item.separation_reason }}
                      </strong>
                    </li>

                    <li class='my-3' v-if="Boolean(item.requested_salary)">
                      <strong class="font_14">
                        میزان حقوق دریافتی :‌ ریال
                        {{ $price(item.salary_received) }}
                      </strong>
                      -
                      <strong class="font_14 blue-grey--text">
                        میزان حقوق درخواستی :‌ ریال
                        {{ $price(item.requested_salary) }}
                      </strong>
                    </li>

                    <li class='my-3' v-if="item.educational_institution">
                      <strong class="font_14">
                        محل تحصیل :
                        {{ item.educational_institution }}
                      </strong>
                    </li>

                    <li class='my-3' v-if="(work_shift, item.work_shift)">
                      <strong class="font_14">
                        شیفت کاری :
                        {{ $getItemEnum(work_shift, item.work_shift) }}
                      </strong>
                    </li>

                    <li class='my-3'>
                      <strong class="font_14">
                        وضعیت سلامتی :
                        <strong
                          class="font_14 green--text"
                          v-if="item.health_status != 'unhealthy'"
                        >
                          دارای سلامت کامل</strong
                        >
                        <strong class="font_14 error--text" v-else>
                          عدم سلامت کامل
                          <br />
                          <strong class="grey--text font_14">
                            {{ item.description_disease }}
                          </strong>
                        </strong>
                      </strong>
                    </li>

                    <li class='my-3'>
                      <strong class="font_14">
                        وضعیت خدمت سربازی :‌
                        {{
                          $getItemEnum(
                            military_service_status,
                            item.military_service_status
                          )
                        }}
                      </strong>
                    </li>
                    <li class='my-3'>
                      <strong class="font_14"> زبان های مسلط :‌ </strong>

                      <div v-for="(l, index) in item.languages">
                        <strong class="grey--text font_14">
                          {{ index + 1 }} - {{ l.lang }} , ‌سطح {{ l.level }}
                        </strong>
                        <br />
                      </div>
                    </li>
                    <li class='my-3'>
                      <strong class="font_14"> مهارت های نرم افزاری :‌ </strong>
                      <div v-for="(t, index) in item.technical_skills">
                        <strong class="grey--text font_14">
                          {{ index + 1 }} - {{ t }}
                        </strong>
                        <br />
                      </div>
                    </li>
                    <li class='my-3' v-if="(work_shift, item.work_shift)">
                      <strong class="font_14">
                        آدرس ثبت شده :‌
                        {{ item.address }}
                      </strong>
                    </li>
                  </ul>

                  <v-card
                    
                    width="100%"
                    class="pa-3 text-center elevation-0"
                  >
                    <strong class="font_17"> شرح درباره مهارت ها </strong>
                    <br />
                    <strong class="font_12">
                      {{ item.description_skills }}
                    </strong>
                    <br>
                    <v-divider></v-divider>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>
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
      work_shift: [
        { text: "صبح", value: "morning" },
        { text: "عصر", value: "evening" },
        { text: "هردو ( صبح و عصر )", value: "both" },
      ],
      military_service_status: [
        { text: "دارای کارت پایان خدمت", value: "completed_service" },
        { text: "معافیت پزشکی", value: "medical_exemption" },
        {
          text: "معافیت های موقت مثل تحصیلی",
          value: "temporary_education_deferment",
        },
        { text: "هیچکدام", value: "none" },
      ],
    };
  },


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
          this.closeDialog(true);
        })
        .catch((err) => {});
    },
    closeDialog(refresh = false) {
      this.$emit("closeDialog");
      if (Boolean(refresh)) {
        this.$emit("refresh");
      }
    },
    getImage(path){
      let img = this.$getImage(path);
      window.open(img);
    }
  },
};
</script>
<style scoped>
.main-div {
  border: 8px double grey;
}
</style>
