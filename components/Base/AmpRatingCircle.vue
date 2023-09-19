<template>
  <div v-if="end_render" class="px-md-3">
    <amp-labale
      :text="text"
      :color="color"
      test-tag="labale"
      :disabled="disabled"
      :required="required"
      :help_text="help_text"
      :starRight="starRight"
      v-if="text && show_lable"
    />
    <div class="center-div">
      <v-avatar
        class="pointer"
        @click="selectItem(1)"
        :size="inp_value == 1 ? 22 : 12"
        :color="inp_value >= 1 ? 'success' : 'background_color'"
      >
        <v-icon size="10" dark v-if="inp_value == 1">done</v-icon>
      </v-avatar>
      <v-divider
        :class="[inp_value > 1 ? 'success' : 'background_color', 'mx-1']"
      />
      <v-avatar
        class="pointer"
        @click="selectItem(2)"
        :size="inp_value == 2 ? 22 : 12"
        :color="inp_value >= 2 ? 'success' : 'background_color'"
      >
        <v-icon size="10" dark v-if="inp_value == 2">done</v-icon>
      </v-avatar>
      <v-divider
        :class="[inp_value > 2 ? 'success' : 'background_color', 'mx-1']"
      />
      <v-avatar
        class="pointer"
        @click="selectItem(3)"
        :size="inp_value == 3 ? 22 : 12"
        :color="inp_value >= 3 ? 'success' : 'background_color'"
      >
        <v-icon size="10" dark v-if="inp_value == 3">done</v-icon>
      </v-avatar>
      <v-divider
        :class="[inp_value > 3 ? 'success' : 'background_color', 'mx-1']"
      />
      <v-avatar
        class="pointer"
        @click="selectItem(4)"
        :size="inp_value == 4 ? 22 : 12"
        :color="inp_value >= 4 ? 'success' : 'background_color'"
      >
        <v-icon size="10" dark v-if="inp_value == 4">done</v-icon>
      </v-avatar>
      <v-divider
        :class="[inp_value > 4 ? 'success' : 'background_color', 'mx-1']"
      />
      <v-avatar
        class="pointer"
        @click="selectItem(5)"
        :size="inp_value == 5 ? 22 : 12"
        :color="inp_value >= 5 ? 'success' : 'background_color'"
      >
        <v-icon size="10" dark v-if="inp_value == 5">done</v-icon>
      </v-avatar>
      <v-btn text color="info">
        {{ inp_value }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false,
    },
    text: {
      type: String,
      required: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      required: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    show_lable: {
      type: Boolean,
      default: true,
    },
    value_inp: {
      default: '',
    },
    starRight: {
      type: Boolean,
      default: false,
    },
    help_text: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    ruleItem: [],
    inpRules: {},
    inp_value: '',
    required: false,
    end_render: false,
  }),
  watch: {
    value() {
      this.inp_value = this.value
    },
    inp_value() {
      let value = this.inp_value
      if (!value) {
        value = 0
      }
      this.$emit('input', value)
    },
    value_inp() {
      this.inp_value = this.value_inp
    },
  },
  mounted() {
    if (this.value_inp) {
      this.inp_value = this.value_inp
    } else if (this.value) {
      this.inp_value = this.value
    } else {
      this.inp_value = 3
    }
    this.end_render = true
  },
  methods: {
    selectItem(step) {
      if (this.readonly || this.disabled) {
        return
      }
      this.inp_value = step
    },
  },
}
</script>
