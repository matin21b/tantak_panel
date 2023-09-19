<template>
  <v-card
    :width="width"
    :height="height"
    :color="plateColor"
    class="elevation-0"
  >
    <v-row dense class="plate-parent">
      <v-col cols="2" class="center-div plate-4">
        <span v-if="readOnly" class="font_bold">
          {{ form.p4 }}
        </span>
        <amp-input
          v-else
          maxlength="2"
          v-model="form.p4"
          parent-class="px-1"
          rules="require,number"
          cClass="ltr-item small-input font_bold"
        />
      </v-col>
      <v-col cols="3" class="center-div">
        <span v-if="readOnly" class="font_bold">
          {{ form.p3 }}
        </span>
        <amp-input
          v-else
          maxlength="3"
          v-model="form.p3"
          parent-class="px-1"
          rules="require,number"
          cClass="ltr-item small-input font_bold"
        />
      </v-col>
      <v-col cols="3" class="center-div">
        <span v-if="readOnly" class="font_bold">
          {{ form.p2 }}
        </span>
        <amp-select
          v-else
          rules="require"
          v-model="p2"
          :items="$store.state.static.pik"
          parent-class="px-1"
          cClass="small-input font_bold"
        />
      </v-col>
      <v-col cols="2" class="center-div">
        <span v-if="readOnly" class="font_bold">
          {{ form.p1 }}
        </span>
        <amp-input
          v-else
          maxlength="2"
          v-model="form.p1"
          parent-class="px-1"
          :readOnly="readOnly"
          rules="require,number"
          cClass="ltr-item small-input font_bold"
        />
      </v-col>
      <v-col cols="2" class="plate-0">
        <img src="/plate-0.svg" width="auto" height="100%" />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
export default {
  props: {
    height: { default: "" },
    value: { require: true },
    width: { default: "310" },
    readOnly: { type: Boolean, default: false }
  },
  data: () => ({
    p2: 0,
    type_plate: false,
    form: {
      p1: "",
      p2: 0,
      p3: "",
      p4: ""
    },
  }),
  beforeMount() {
    this.type_plate = this.$store.state.setting.type_plate
  },
  computed: {
    plateColor() {
      if (this.p2 == 9) {
        return "warning";
      }
      return "";
    }
  },
  watch: {
    form: {
      deep: true,
      handler(value) {
        this.form.p2 = this.p2;
        this.$emit(
          "input",
          `${this.form.p1}-${this.form.p2}-${this.form.p3}-${this.form.p4}`
        );
      }
    },
    type_plate() {
      if (this.type_plate) {
        this.clearPlats();
      }
    },
    value(value) {
      this.setPlate();
    }
  },
  mounted() {
    this.setPlate();
  },
  methods: {
    setPlate() {
      let value = this.value;
      if (
        !Boolean(this.form.p1) &&
        typeof value == "string" &&
        value.length > 2
      ) {
        let items = value.split("-");
        if (items[0]) {
          this.form.p1 = items[0];
        }
        if (items[1]) {
          this.form.p2 = items[1];
        }
        if (items[2]) {
          this.form.p3 = items[2];
        }
        if (items[3]) {
          this.form.p4 = items[3];
        }
      }
    },
    clearPlats() {
      this.form.ps = 0;
      this.form.p1 = "";
      this.form.p2 = "";
      this.form.p3 = "";
      this.form.p4 = "";
      this.$store.dispatch("setting/reloadPlate", false);
    }
  }
};
</script>

<style scoped>
.plate-parent {
  border: 2px solid;
  margin: 0 !important;
  padding: 0 !important;
}
.plate-parent > div {
  height: 80px;
  padding: 10px;
  margin: 0 !important;
  padding: 0 !important;
}
.plate-0 {
  text-align: center;
  background: #039;
  margin: -5px !important;
}
.plate-4 {
  border-left: 2px solid;
}
</style>
