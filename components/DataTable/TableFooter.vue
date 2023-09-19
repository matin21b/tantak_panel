<template>
  <v-row class="pt-10">
    <v-col cols="12" md="2" />
    <v-col cols="12" md="8" class="text-center pt-2">
      <v-flex :class="['parent-footer', 'd-flex justify-center']">
        <span class="px-2" v-if="$vuetify.breakpoint.mdAndUp"> نمایش </span>
        <v-select
          outlined
          :height="40"
          class="px-1"
          :items="row_items"
          v-model="page_row"
          background-color="backcolor"
          dense
          v-if="$vuetify.breakpoint.mdAndUp"
        />
        <span v-if="$vuetify.breakpoint.mdAndUp">
          مورد از
          {{ total_item }}
          مورد
        </span>
        <v-divider vertical class="mr-4"/>
        <span class="px-2" v-if="$vuetify.breakpoint.mdAndUp"></span>
        <v-btn
          width="110"
          :height="40"
          color="success"
          test-tag="prev_btn"
          :disabled="page <= 1"
          class="footer-left_btn"
          @click="addPage(-1)"
        >
          قبلی
        </v-btn>
        <span class="px-2" v-if="$vuetify.breakpoint.mdAndUp"> صفحه </span>
        <v-select
          outlined
          :height="40"
          test-tag="selectbtn"
          background-color="backcolor"
          dense
          v-if="$vuetify.breakpoint.mdAndUp"
          v-model="now_page"
          :items="allPage"
        />
        <span class="px-2" v-else> Page {{ page }} از {{ page_count }} </span>
        <span
          test-tag="pageCount"
          class="px-2"
          v-if="$vuetify.breakpoint.mdAndUp"
        >
          از {{ page_count }}
        </span>
        <v-btn
          :height="40"
          width="110"
          color="success"
          test-tag="next_btn"
          class="footer-right_btn"
          :disabled="page >= page_count"
          @click="addPage(1)"
        >
          بعدی
        </v-btn>
      </v-flex>
    </v-col>
    <v-col cols="12" md="2" />
  </v-row>
</template>
<script>
export default {
  props: {
    page_count: {
      type: Number,
      required: true,
    },
    page: {
      type: Number,
      required: true,
    },
    total_item: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    now_page: 1,
    page_row: 50,
    row_items: [10, 20, 50, 100, 200, 500],
  }),
  watch: {
    page_row() {
      let pageInfo = {
        page: this.$store.state.dataTable.pageInfo.page,
        sortBy: this.$store.state.dataTable.pageInfo.sortBy,
        orderBy: this.$store.state.dataTable.pageInfo.orderBy,
        paginate_num: this.page_row,
      }
      this.$store.dispatch('dataTable/getPageInfo', pageInfo)
      this.$emit('changePageRow', this.page_row)
    },
    now_page() {
      let pageInfo = {
        page: this.now_page,
        sortBy: this.$store.state.dataTable.pageInfo.sortBy,
        orderBy: this.$store.state.dataTable.pageInfo.orderBy,
        paginate_num: this.$store.state.dataTable.pageInfo.paginate_num,
      }
      this.$store.dispatch('dataTable/getPageInfo', pageInfo)
      this.$emit('changePage', this.now_page)
    },
  },
  computed: {
    allPage() {
      let items = [1]
      if (this.page && this.page > 0) {
        items = []
        for (let index = 1; index <= this.page_count; index++) {
          items.push(index)
        }
      }
      return items
    },
  },
  mounted() {
    this.now_page = this.page
  },
  methods: {
    addPage(count) {
      let page = this.now_page
      if (this.page_count < this.page + count) {
        return
      }
      if (0 >= this.page + count) {
        return
      }
      page += count
      this.now_page = page
      // this.$emit('changePage', page)
    },
  },
}
</script>

<style>
.parent-footer {
  display: flex;
  padding: 10px;
  padding-top: 20px;
  align-items: center;
}

.parent-footer > .v-input {
  width: 100px;
  height: 40px;
  max-width: 100px;
  margin-left: 5px;
  margin-right: 5px;
  text-align: center;
  display: inline-block;
}

.parent-footer > .v-input > .v-input__control {
  min-height: 40px !important;
  padding-left: 4px !important;
  padding-right: 4px !important;
}

.parent-footer > .footer-left_btn {
  margin-right: 5px;
}

.parent-footer > .footer-right_btn {
  margin-left: 5px;
}
</style>
