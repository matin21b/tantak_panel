<template>
  <div>
    <v-card class="pa-6 mx-6" v-if="multi">
      <div>
        <v-chip close label outlined class="ma-2" color="orange" v-for="(item, index) in items" :key="index" @click:close="removeItem(item)">
          {{ item.first_name }} {{ item.last_name }}
        </v-chip>
      </div>
      <div>
        <amp-button text="ثبت" @click="sendData()" />
      </div>
    </v-card>
    <BaseTable table_key="user" row-pointer :headers="headers" :rootBody="rootBody" :row-click="rowClick" :url="showUrl" />
  </div>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable'
export default {
  components: { BaseTable },
  props: {
    showUrl: { default: '/user/searchByRole' },
    value: { require: false },
    multi: { type: Boolean, default: false },
    rootBody: { type: Object, require: false },
  },
  data: () => ({
    items: [],
    headers: [
      {
        text: 'تصویر',
        type: 'image',
        value: 'avatar',
        filterable: false,
        disableSort: 'true',
      },
      { text: 'نام', value: 'first_name' },
      { text: 'نام خانوادگی', value: 'last_name' },
      { text: 'نام کاربری', value: 'username' },
      {
        text: 'نقش',
        filterable: false,
        disableSort: true,
        value: (body) => {
          let text = ''
          if (Array.isArray(body.roles)) {
            text = body.roles.map((x) => x.name).join(' , ')
          }
          return text
        },
      },
    ],
  }),
  watch: {
    value() {
      this.items = [...this.value]
    },
  },
  mounted() {
    this.items = [...this.value]
  },
  methods: {
    sendData() {
      this.$emit('input', this.items)
      this.closeDialog()
    },
    closeDialog() {
      this.$emit('closeDialog', true)
    },
    removeItem(item) {
      this.items = [...this.items].filter((x) => x.id != item.id)
    },
    selectItem(body) {
      if (this.multi) {
        let items = [...this.items].filter((x) => x.id != body.id)
        items.push(body)
        this.items = items
      } else {
        this.items = [body]
        this.sendData()
      }
    },
    rowClick(row) {
      this.selectItem(row)
    },
  },
}
</script>
