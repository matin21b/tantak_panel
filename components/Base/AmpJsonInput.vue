<template>
  <v-row no-gutters class="px-3">
    <v-col cols="12" md="3" class="pl-2" v-if="showValue">
      <amp-labale :text="text" />
      <v-text-field dense outlined v-model="item.text" :placeholder="valuePlaceholder"></v-text-field>
    </v-col>
    <v-col cols="12" md="8" class="pl-2">
      <amp-labale :text="showValue ? 'مقدار' : text" />
      <v-text-field dense outlined v-model="item.value" :placeholder="textPlaceholder"></v-text-field>
    </v-col>

    <v-col cols="1" md="1">
      <v-btn color="primary" class="mt-9" @click="addItem">
        <v-icon> add </v-icon>
      </v-btn>
    </v-col>
    <v-col cols="12" md="12" class="">
      <v-alert dense text class="" color="primary" v-for="(item, i) in value" :key="i">
        <v-row no-gutters dense>
          <v-col cols="11" md="11">
            <div class="text-justify">
              <span v-if="showValue">
                {{ Object.keys(item)[0] }}
                :
              </span>

              {{ item[Object.keys(item)[0]] }}
            </div>
          </v-col>
          <v-col cols="1" md="1" class="d-flex align-center justify-end">
            <v-icon class="float-left" color="primary" @click="remove(item)"> close </v-icon>
          </v-col>
        </v-row>
      </v-alert>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
    },
    value: {
      type: Array,
    },
    showValue: {
      type: Boolean,
      default: true,
    },
    textPlaceholder: {
      type: String,
    },
    valuePlaceholder: {
      type: String,
    },
  },
  data: () => ({
    loading: false,
    item: { text: '', value: '' },
  }),
  methods: {
    remove(item) {
      let index = this.value.indexOf(item)
      this.value.splice(index, 1)
      this.$emit('input', this.value)
    },
    addItem() {
      let _dict = {}
      if (!this.item.text && !this.showValue) {
        this.item.text = Math.floor(Math.random() * 100000)
      }
      _dict[this.item.text] = this.item.value
      this.value.push(_dict)
      this.$emit('input', this.value)
      this.item = { text: '', value: '' }
    },
  },
}
</script>
