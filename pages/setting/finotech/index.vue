<template>
  <div>
    <BaseTable
      url="/setting"
      :filters="filters"
      :headers="headers"
      autoUpdate="/setting/finotech"
    />
  </div>
</template>

<script>
export default {
  data: () => ({
    headers: [],
    btn_actions: [],
    filters: { key: "FINNOTECH" },
    title: "توکن فینوتک",
  }),
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);

    this.headers = [
      {
        disableSort: "true",
        filterable: false,
        text: "کلید",
        filterCol: "value",
        type: "tooltip",
        function: (body) => {
          if (body.value) {
            return body.value;
          }
        },
        value: (body) => {
          if (typeof body.value == "string") {
            if (body.value.length < 100) {
              return body.value;
            }
            return body.value.slice(0, 100) + "...";
          } else {
            return "-";
          }
        },
      },
    ];
  },
};
</script>
