<template>
  <v-dialog v-model="UserDialog" persistent class="white pa-4" max-width="500">
    <v-card class="white pa-4">
      <v-card-title v-if="title">
          {{ title }}
      </v-card-title>
      <v-card-text class="py-4" >
        <amp-select
          text="انتخاب کاربر"
          :items="user_items"
          v-model="user"
        ></amp-select>
        <v-card class="d-flex align-center justify-space-around elevation-0">
          <v-btn class="success" @click="submit">تایید</v-btn>
          <v-btn class="error" @click="close">بستن</v-btn>
        </v-card>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    UserDialog: {
      type: Boolean,
      default: false,
    },
    listUrl: {
      type: String,
    },
    title: {
      type: String,
    },
  },
  data() {
    return {
      user_items: [],
      user: "",
    };
  },
  mounted() {
    if (this.listUrl) {
      this.loadItems();
    }
  },
  methods: {
    loadItems() {
      this.$reqApi(this.listUrl)
        .then((res) => {
          res.model.data.map((x) => {
            this.user_items.push({
              text: x.first_name + " " + x.last_name,
              value: x.id,
            });
          });
          this.user_items;
        })
        .catch((err) => {
          return err;
        });
    },
    submit() {
      if (this.user) {
        this.$emit("selectUser", this.user);
      } else {
        this.$toast.error("کاربری انتخاب نشده است");
      }
    },
    close() {
      this.UserDialog = false;
      this.$emit("close");
    },
  },
};
</script>
