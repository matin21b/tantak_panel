<template>
  <div>
    <v-dialog
      persistent
      v-model="dialog_defect.show"
      :model-id="dialog_defect.items"
      width="850"
    >
      <v-card class="pa-5">
        <div class="d-flex align-center">
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogDefect">
            <v-icon> close </v-icon>
          </v-btn>
        </div>

        <v-col cols="12">
          <v-expansion-panels>
            <v-expansion-panel class="elevation-3">
              <v-expansion-panel-header
                expand-icon
                class="text-center py-5 elevation-1 mb-5"
              >
                <strong style="font-size: 21px"> ایجاد نقص مدرک جدید </strong>
              </v-expansion-panel-header>

              <v-expansion-panel-content>
                <v-form
                  v-model="valid"
                  @submit.prevent="submit()"
                  :disabled="loading"
                  class="rounded-0 d-flex flex-column"
                >
                  <v-row>
                    <v-col cols="12" md="6">
                      <amp-input
                        rules="require"
                        text="مدرک مورد نظر"
                        v-model="title"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <amp-autocomplete
                        rules="require"
                        :items="type_items"
                        text="نوع مدرک"
                        v-model="type"
                      />
                    </v-col>

                    <v-col cols="12" md="12" class="ma-0">
                      <amp-textarea
                        rules="require"
                        :rows="2"
                        text="توضیحات"
                        v-model="form.message"
                      />
                    </v-col>
                    <v-col cols="12" md="12">
                      <v-row class="d-flex justify-center mb-3">
                        <v-btn
                          class="ma-2 pa-3 white--text"
                          color="#e10f00"
                          :disabled="!valid || loading"
                          :loading="loading"
                          @click="submit"
                        >
                          نقص مدرک

                          <v-icon size="20" class="mr-2"> description </v-icon>
                          <v-icon size="18"> add </v-icon>
                        </v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-form>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12">
          <v-card width="100%" class="elevation-5" outlined>
            <v-col
              cols="12"
              class="d-flex align-center justify-center mt-4 pa-0"
            >
              <strong style="font-size: 21px">لیست نقص مدرک های ثبت شده</strong>
            </v-col>
            <div class="mt-4">
              <v-divider></v-divider>
              <v-divider></v-divider>
            </div>
            <div>
              <BaseTable
                url="/defect-document"
                autoDelete="/defect-document/delete"
                :headers="headers"
                :filters="filters"
                ref="InsertDefect"
                footer
                :BTNactions="btn_actions"
              />
            </div>
            <!-- <div class="text-start ml-6 mt-4">
          <v-btn outlined color="#0faa47" @click="acceptDoc">
            <strong > تایید مدارک ارسالی </strong>
            <v-icon size="23" class="mr-2 "> task_alt </v-icon>
          </v-btn>
        </div> -->
          </v-card>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from "@/components/DataTable/BaseTable";
export default {
  props: {
    dialog_defect: {
      require: false,
      default: { show: false, items: null },
    },
    body_defect: {
      require: false,
      default: false,
    },
  },
  components: {
    BaseTable,
  },
  data: () => ({
    valid: true,
    info: [],
    type_items: [
      { text: "عکس", value: "file" },
      { text: "متن", value: "text" },
    ],
    defect: [],
    btn_actions: [],
    filters: {},
    type: "",
    title: "",
    form: {
      files: [],
      user_id: "",
      section_name: "EmploymentForm",
      section_id: "",

      message: "",
    },
    headers: [],
    tab: "all",
    items: [
      { text: "همه", key: "all" },
      { text: "مدارک دارای نقص", key: "open" },
      { text: "مدارک ارسالی ", key: "send" },
    ],
    loading: false,
  }),

  mounted() {
    this.filters = {
      section_id: {
        op: "=",
        value: this.body_defect.id,
      },
    };
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
        text: "نام فایل",
        value: (body) => {
          if (
            body.defect_document_files &&
            body.defect_document_files.length > 0
          ) {
            return body.defect_document_files[0].title;
          }
        },
      },
      {
        filterable: false,
        text: "پیام",
        filterCol: "descriptions",
        type: "tooltip",
        function: (body) => {
          if (body.message) {
            return body.message;
          }
        },
        value: (body) => {
          if (typeof body.message == "string") {
            if (body.message.length < 25) {
              return body.message;
            }
            return body.message.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
    this.form.user_id = this.body_defect.user_id;
    this.form.section_id = this.body_defect.id;

    this.btn_actions = [
      //       {
      //         icon: "visibility",
      //         color: "btn_color",
      //         text: "نمایش فایل",
      //         fun: (body) => {
      //           body.defect_document_files.map((x) => {
      //             if (x.value != null) {
      //               window.open(this.$getImage(x.value));
      //             }
      //           });
      //         },
      //         show_fun: (body) => {
      //           let have_item = false;
      //           body.defect_document_files.map((x) => {
      //             if (x.value != null) {
      //               have_item = true;
      //             }
      //           });
      //           return have_item;
      //         },
      //       },
      {
        icon: "done",
        color: "success",
        fun: (body) => {
          this.changeStatus("done", body.id);
        },
        show_fun: (body) => {
          if (body.status == "send") {
            return true;
          } else {
            return false;
          }
        },
      },
      {
        icon: "close",
        color: "red",
        fun: (body) => {
          this.changeStatus("reject", body.id);
        },
        show_fun: (body) => {
          if (body.status == "send") {
            return true;
          } else {
            return false;
          }
        },
      },
    ];
  },

  methods: {
    acceptDoc() {
      this.loading = true;
      let url = "/order/done-doc";
      this.$reqApi(url, { id: this.body_defect.id })
        .then((res) => {
          this.closeDialogDefect();
          this.$toast.success("اطلاعات تایید شد");
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    submit() {
      this.loading = true;
      let form = { ...this.form };
      form.files.push({
        title: this.title,
        type: this.type,
      });
      form.section_id = this.body_defect.id;
      form.user_id = this.body_defect.user.id;
      let url = "/defect-document/insert";
      this.$reqApi(url, form)
        .then((res) => {
          this.relod();
          (this.form.files = []),
            (this.defect = []),
            (this.form.message = ""),
            (this.type = "");
          this.title = ""((this.loading = false));
        })
        .catch((err) => {
          this.loading = false;
        });
    },
    closeDialogDefect() {
      this.$emit("relod");
      this.dialog_defect.show = false;
      this.dialog_defect.items = null;
    },
    changeStatus(status, id) {
      let form = {
        status: status,
        id: id,
      };
      this.$reqApi("defect-document/change-status", { ...form })
        .then((res) => {
          this.relod();
          this.$toast("تعییر وضعیت با موفقیت انجام شد");
        })
        .catch((err) => {});
    },
    relod() {
      this.$refs.InsertDefect.getDataFromApi();
    },
  },
};
</script>
