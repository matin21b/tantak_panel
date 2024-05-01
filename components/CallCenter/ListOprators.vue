<template>
  <div>
    <v-dialog
      persistent
      v-model="dialog_oprator_list.show"
      :model-id="dialog_oprator_list.items"
      fullscreen
    >
      <v-card class="pa-2">
        <v-card-title>
          <span class="d-flex flex-column" style="font-size: 27px"
            >لیست اپراتور

            <span class="primary--text" style="font-size: 15px">
              <v-icon size="10" color="primary"> star </v-icon>
              مرکز تماس : {{ name_superviser }}
            </span>
          </span>

          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialog">
            <v-icon> close </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <BaseTable
            :headers="headers"
            :url="operator_url"
            :rootBody="rootBody"
            :BTNactions="btn_actions"
          />
          <DialogFile
            v-if="dialog_file.show"
            :opratorId="oprator_id"
            :DialogFile="dialog_file"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DialogFile from "@/components/CallCenter/DialogFile.vue";
export default {
  props: {
    dialog_oprator_list: {
      require: false,
      default: false,
    },
    operator_url: {
      require: false,
      default: false,
    },
    operator_url: {
      require: false,
      default: false,
    },
    show_list: {
      require: false,
      default: false,
    },
    name_superviser: {
      require: false,
      default: false,
    },
  },
  components: {
    DialogFile,
  },
  data: () => ({
    headers: [],
    btn_actions: [],
    dialog_file: {
      show: false,
      items: null,
    },
    oprator_id: "",
    rootBody: { role_id: [] },
  }),
  beforeMount() {
    this.rootBody = {
      superviser_id: this.show_list,
    };
  },
  mounted() {
    this.headers = [
      { text: "نام", value: "first_name" },
      { text: "نام خانوادگی", value: "last_name" },
      { text: "نام کاربری", filterCol: "username", value: "username" },
    ];
    this.btn_actions = [
      {
        text: "مشاهده پیام  ها ",
        icon:"contact_mail",
        color: "info",
        fun: (body) => {
          this.dialog_file.show = true;
          this.oprator_id = body.id;
        },
      },
    ];
  },
  methods: {
    closeDialog() {
      this.dialog_oprator_list.show = false;
      this.dialog_oprator_list.items = null;
    },
    relod() {
      this.$emit("relod");
    },
  },
};
</script>

<style></style>
