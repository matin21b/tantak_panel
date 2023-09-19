<template>
  <div v-if="end_render">
    <amp-labale
      :text="text"
      :color="color"
      test-tag="labale"
      :required="required"
      :help_text="help_text"
      :starRight="starRight"
      v-if="text && show_lable"
    />
    <v-radio-group
      row
      :class="cClass"
      :rules="ruleItem"
      v-model="inp_value"
      :multiple="multiple"
      :readonly="readonly"
      :disabled="disabled"
    >
      <v-radio
        dense
        outlined
        :disabled="disabled"
        :readonly="readonly"
        v-for="(item, index) in items"
        :key="index"
        :label="item.text"
        :value="item.value"
      />
    </v-radio-group>
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
    cClass: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      default: '',
    },
    rules: {
      default: '',
    },
    type: {
      type: String,
      default: 'text',
    },
    color: {
      type: String,
      required: false,
    },
    appendIcon: {
      type: String,
      default: '',
    },
    show_lable: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    prefix: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    suffix: {
      type: String,
      default: '',
    },
    value_inp: {
      default: '',
    },
    starRight: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    help_text: {
      type: String,
      default: '',
    },
    maxlength: {
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
  computed: {
    amp_height() {
      // if (this.$vuetify.breakpoint.xl) {
      //   return 70
      // }
      return 40
    },
  },
  watch: {
    value() {
      this.inp_value = this.value
    },
    inp_value() {
      this.$emit('input', this.inp_value)
    },
    value_inp() {
      this.inp_value = this.value_inp
    },
  },
  mounted() {
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
    if (this.$checkNotNull(this.value_inp)) {
      this.inp_value = this.value_inp
    }
    if (this.$checkNotNull(this.value)) {
      this.inp_value = this.value
    }
    this.end_render = true
  },
}
</script>
