<template>
  <v-dialog v-model="DialogFile" persistent class="white pa-4" max-width="1000">
    <v-card class="white pa-2">
      <v-card-title>
        <span class="d-flex flex-column" style="font-size: 21px"> لیست پیام ها </span>

        <v-spacer></v-spacer>
        <v-btn icon @click="closeDialog">
          <v-icon> close </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="py-4">
        <BaseTable
          :headers="headers"
          :rootBody="rootBody"
          url="recived-message/operator-activitie"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    DialogFile: {
      type: Object,
    },
    opratorId: {
      type: String,
    },
  },
  data() {
    return {
      headers: [],
      user: "",
      rootBody: {},
    };
  },
  beforeMount() {
    this.rootBody = {
      operator_id: this.opratorId,
    };
    this.headers = [
      { text: "فرستنده", value: "sender" },
      {
        text: "پیام",
        filterCol: "message",
        type: "tooltip",
        function: (body) => {
          if (body.message && body.message) {
            return body.message;
          }
        },
        value: (body) => {
          if (body.message && typeof body.message == "string") {
            if (body.message.length < 25) {
              return body.message;
            }
            return body.message.slice(0, 25) + "...";
          } else {
            return "-";
          }
        },
      },
      {
        text: "وضعیت",
        value: "status",
        filterType: "select",
        items: this.$store.state.static.message_status,
      },
    ];
  },
  //   mounted() {
  //     if (this.opratorId) {
  //       this.rootBody["operator_id"] = this.opratorId;
  //     }
  //   },
  methods: {
    closeDialog() {
      this.DialogFile.show = false;
      this.DialogFile.items = null;
    },
  },
};
</script>
