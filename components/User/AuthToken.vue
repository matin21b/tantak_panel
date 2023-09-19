<template>
  <div>
    <BaseTable
      url="/auth_token"
      :actions="actions"
      :headers="headers"
      :filters="filters"
    />

    <v-dialog width="500" v-model="dialog.show">
      <v-card v-if="dialog.show" class="pa-5">
        <div class="ltr-item">
          <vue-json-pretty :data="dialog.item"> </vue-json-pretty>
        </div>
        <div class="text-center mt-4">
          <v-divider />
          <amp-button
            large
            text="بستن"
            icon="close"
            class="mt-4"
            color="success"
            @click="closeDialog()"
          />
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import BaseTable from '~/components/DataTable/BaseTable'
import VueJsonPretty from 'vue-json-pretty'
export default {
  components: { BaseTable, VueJsonPretty },
  props: { userId: { default: '' } },
  data: () => ({
    headers: [],
    actions: [],
    filters: {},
    dialog: { show: false, item: null },
  }),
  beforeMount() {
    this.headers = [
      {
        text: 'تاریخ',
        filterType: 'date',
        filterCol: 'created_at',
        parentClass: 'ltr-item text-center',
        value: (body) => this.$toJalali(body.created_at),
      },
      { text: 'IP', value: 'ip' },
      {
        text: 'وضعیت',
        value: (value) => {
          if (value.deleted != null) {
            return 'نشست فعال'
          }
          return this.$moment(value.expired_token_at).diff(this.$moment()) > 0
            ? 'نشست فعال'
            : 'نشست باطل شده'
        },
      },
    ]
    this.actions = [
      {
        text: 'نمایش',
        color: 'success',
        icon: 'visibility',
        fun: (body) => {
          this.dialog.item = body
          this.dialog.show = true
        },
      },
    ]
    if (Boolean(this.userId)) {
      this.filters = { created_by: { op: '=', value: this.userId } }
    }
  },
  methods: {
    closeDialog() {
      this.dialog.item = null
      this.dialog.show = false
    },
  },
}
</script>
