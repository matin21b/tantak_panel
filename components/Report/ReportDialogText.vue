<template>
  <div>
    <v-dialog
      persistent
      v-model="dialog_defect.show"
      :model-id="dialog_defect.items"
      width="800"
    >
      <v-card class="pa-5">
        <div class="d-flex align-center">
          <v-spacer></v-spacer>
          <v-btn icon @click="closeDialogDefect">
            <v-icon> close </v-icon>
          </v-btn>
        </div>
        <v-col cols="12">
          <p class="text-left">
            {{ dialog_defect.items }}
          </p>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialog_defect: {
      require: false,
      default: { show: false, items: null },
    },
  },
  methods: {
    closeDialogDefect() {
      this.$emit("relod");
      this.dialog_defect.show = false;
      this.dialog_defect.items = null;
    },
},
};
</script>
