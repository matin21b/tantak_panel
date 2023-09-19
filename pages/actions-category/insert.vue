<template>
  <div>
    <ActionsCategoryForm />
  </div>
</template>
<script>
import ActionsCategoryForm from "@/components/ActionsCategory/ActionsCategoryForm.vue";
export default {
  components: {ActionsCategoryForm },
  data() {
    return {
      title: 'افزودن دسته بندی',
    }
  },
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
