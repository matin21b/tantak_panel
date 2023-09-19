<template>
  <v-app>
    <div class="fit h-max">
      <nuxt />
    </div>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    title: ""
  }),
  head() {
    this.checkDomain();
    return {
      title: this.title
    };
  },
  mounted() {
    setTimeout(() => {
      document.getElementById("landing-parent").style.display = "none";
    }, 2000);
  },
  methods: {
    checkDomain() {
      this.$store.dispatch("setAppName");
      this.$store.dispatch("setLogo");
      this.title = this.$store.state.page_title;
    }
  }
};
</script>
