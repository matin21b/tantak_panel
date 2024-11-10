<template>
  <v-card class="d-flex">
    <v-col cols="12" md="6" class="d-flex">
      <amp-jdate text="از تاریخ" v-model="from" />
      <amp-jdate text="تا " v-model="to" />
    </v-col>
  </v-card>
</template>

<script>
export default {
  props: {},
  data: () => ({
    from: "",
  }),
};
</script>
