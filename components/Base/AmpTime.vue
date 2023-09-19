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
    <persian-date-picker
      type="time"
      color="#6A1B9A"
      v-model="inp_value"
      :disabled="disabled"
      :class="[disabled || readonly ? 'opacity_input' : '']"
    />
    <v-text-field v-model="inp_value" :rules="ruleItem" v-show="false" />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      required: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
      required: false,
    },
    cClass: {
      type: String,
      required: false,
    },
    rules: {
      default: '',
    },
    color: {
      type: String,
      default: '#6cc662',
    },
    show_lable: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
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
    type: {
      type: String,
      default: 'time',
    },
  },
  data: () => ({
    ruleItem: [],
    inpRules: {},
    inp_value: '',
    required: false,
    end_render: false,
  }),
  computed: {
    amp_height() {
      // if (this.$vuetify.breakpoint.xl) {
      //   return 70;
      // }
      return 40
    },
  },
  watch: {
    value() {
      this.setInpValue(this.value)
    },
    inp_value() {
      this.$emit('input', this.inp_value)
    },
    value_inp() {
      this.setInpValue(this.value)
    },
    rules() {
      this.setRules()
    },
  },
  mounted() {
    this.setRules()
    if (this.value_inp) {
      this.inp_value = this.value_inp
    }
    if (this.value) {
      this.inp_value = this.value
    }
    this.end_render = true
  },
  methods: {
    setInpValue(value) {
      this.inp_value = value
    },
    setRules() {
      this.required = false
      this.ruleItem = []
      let inpRules = this.$inpRules()
      if (typeof this.rules == 'string') {
        this.rules.split(',').forEach((element) => {
          if (typeof inpRules[element] != 'undefined') {
            if (element == 'require') {
              this.required = true
            }
            this.ruleItem.push(inpRules[element])
          }
        })
      } else if (typeof this.rules == 'function') {
        this.ruleItem.push(this.rules)
      }
    },
  },
}
</script>

<style>
.vpd-clear-btn {
  display: none !important;
}

.vpd-input-group > input {
  width: 100%;
  height: 40px;
  box-shadow: none !important;
  border: 1px solid #cbcbcb !important;
}

.vpd-day[disabled] .vpd-day-text {
  color: #c2c2c2 !important;
}

.min_date > .vpd-main > .vpd-input-group > label {
  padding: 0 !important;
}

.vpd-input-group > label {
  position: absolute;
  left: 0;
  background-color: #51b34e00 !important;
}

.vpd-input-group > label > svg {
  margin-top: 12px;
  margin-bottom: 12px;
  margin-left: 6px;
  fill: #51b34e;
}

.vpd-input-group {
  height: 70px;
}
</style>
