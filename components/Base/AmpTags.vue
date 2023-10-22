<template>
  <div>
    <amp-labale :text="text" />
    <v-combobox full-width class="tags-combo" v-model="inp_value" chips clearable multiple small-chips outlined dense>
      <template v-slot:selection="{ attrs, item, select, selected }">
        <v-chip v-bind="attrs" :input-value="selected" close @click="select" @click:close="remove(item)">
          <strong>{{ item }}</strong>
        </v-chip>
      </template>
    </v-combobox>
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
      this.$emit('input', this.inp_value)
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
    setRules() {
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
    remove(item) {
      const index = this.inp_value.indexOf(item)
      if (index > -1) {
        this.inp_value.splice(item, 1)
      }
    },
  },
}
</script>

<style>
.tags-combo i {
  display: none !important;
}
</style>


