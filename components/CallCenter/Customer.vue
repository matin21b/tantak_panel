<template>
  <div>
    <v-dialog
      persistent
      v-model="DialogCustomer.show"
      :model-id="DialogCustomer.items"
      fullscreen
    >
      <v-card>
        <v-card color="primary">
          <v-card-title>
            <span style="font-size: 21px" class="white--text"> اطلاعات مشتری</span>
            <v-spacer></v-spacer>
            <v-btn icon @click="closeDialog">
              <v-icon color="white" size="26"> cancel </v-icon>
            </v-btn>
          </v-card-title>
          <v-stepper   value="1">
            <v-row class="justify-center mt-4">
              <v-stepper-step complete editable edit-icon="content_paste_search" step="1">
                <span class="font_16"> سوابق خرید </span>
                <small class="pt-2">
                  خریدهای ثبت شده برای
                  {{ username }}
                </small>
              </v-stepper-step>
              <v-stepper-step complete editable edit-icon="comment" step="2">
                <span class="font_16">نظرات </span>
                <small class="pt-2">نظرات ثبت شده برای مشتری</small>
              </v-stepper-step>

              <v-stepper-step complete editable edit-icon="account_circle" step="3">
                <span class="font_16"> تکمیل پروفایل </span>
                <small class="pt-2">
                  در صورت مغایرت اطلاعات ,اطلاعات را تکمیل کنید
                </small></v-stepper-step
              >
            </v-row>
            <v-row class="justify-center">
              <v-col cols="9">
                <v-divider />
                <v-divider />
              </v-col>
            </v-row>

            <v-stepper-items>
              <v-stepper-content step="1">
     
                <v-col cols="12">
                  <BaseTable
                    url="basket/list-user"
                    :rootBody="{ user_id: customer.id }"
                    :headers="headers"
                  />
                </v-col>
              </v-stepper-content>
              <v-stepper-content step="2">
                <v-col cols="12">
                  <BaseTable
                    url="user-comment"
                    :rootBody="{ user_id: customer.id }"
                    :headers="header_comments"
                  />
                </v-col>
              </v-stepper-content>
              <v-stepper-content step="3">
              <v-row class="d-flex justify-center ">
                <v-col md="9" cols="12" clss="center-div">
                  <v-row class="d-flex justify-center ">
                  <v-col md="4" cols="12">
                    <amp-input text="نام مشتری" v-model="form.first_name" />
                  </v-col>
                  <v-col md="4" cols="12">
                    <amp-input v-model="form.last_name" text=" نام خانوادگی" />
                  </v-col>
                  <v-col md="4" cols="12">
                    <amp-input v-model="form.email" text="آدرس الکترونیکی" rules="email" />
                  </v-col>
                  <v-col md="12" cols="12">
                    <amp-textarea text="آدرس" v-model="form.address"></amp-textarea>
                  </v-col>
                </v-row>
                  </v-col>
              </v-row>
      
      
                <v-row class="d-flex justify-center mb-4">
                  <amp-button
                    text="تایید"
                    @click="profileCustomer()"
                    icon="done"
                    class="ma-1"
                    :disabled="loading"
                    :loading="loading"
                  ></amp-button>
                </v-row>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card>



      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    DialogCustomer: {
      require: false,
      default: false,
    },
    customer: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    headers: [],
    comment: "",
    username: "",

    steps: 1,
    loading: false,
    form: {
      first_name: "",
      last_name: "",
      email: "",
      address: "",
    },
  }),
  beforeMount() {
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },

      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },

      {
        text: "وضعیت خرید",
        value: "status",
        filterType: "select",
        items: [{
          text:"پرداخت شده" , value:"payed"
        }],
      },
    ];
    this.header_comments = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      {
        text: "ثبت کننده",
        value: (body) => {
          if (body.personnel.first_name && body.personnel.last_name) {
            return body.personnel.first_name + " " + body.personnel.last_name;
          } else {
            return body.personnel.username;
          }
        },
      },
      {
        text: "شماره همراه مشتری",
        value: (body) => {
          if (body.user) {
            if (body.user.username) {
              let start = body.user.username.slice(0, 3);
              let end = body.user.username.slice(-4);

              let phone_number = end + "****" + start;
              return phone_number;
            }
          }
        },
      },
      {
        text: "توضیحات",
        filterCol: "comment",
        type: "tooltip",
        function: body => {
          if (body.comment) {
            return body.comment;
          }
        },
        value: body => {
          if (typeof body.comment == "string") {
            if (body.comment.length < 25) {
              return body.comment;
            }
            return body.comment.slice(0, 25) + "...";
          } else {
            return "-";
          }
        }
      }
    ];

    if (this.customer.username) {
      this.phoneNumber(this.customer.username);
    }
  },
  mounted() {
    this.loadProfile();
  },
  methods: {
    profileCustomer() {
      this.loading = true;
      let form = { ...this.form };
      form["id"] = this.customer.id;
      let url = "/user/profile";
      this.$reqApi(url, form)
        .then((res) => {
          this.loading = false;
          this.$toast.success("اطلاعات مشتری با موفقیت ویرایش شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    loadProfile() {
      this.loading = true;
      let url = "/user/profile";
      this.$reqApi(url, { id: this.customer.id })
        .then((res) => {
          this.loading = false;
          for (let key in res.user) {
            this.form[key] = res.user[key];
          }
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialog() {
      this.DialogCustomer.show = false;
      this.DialogCustomer.items = null;
    },
    relod() {
      this.$emit("relod");
    },
    phoneNumber(username) {
      let start = username.slice(0, 3);
      let end = username.slice(-4);

      let phone_number = end + "****" + start;
      let name = this.customer.first_name
        ? this.customer.first_name + " " + this.customer.last_name
        : phone_number;
      this.username = name;
    },
  },
};
</script>

<style></style>
