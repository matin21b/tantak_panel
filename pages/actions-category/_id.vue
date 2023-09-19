<template>
  <div>
    <ActionsCategoryForm :model-id='$route.params.id' />
  </div>
</template>
<script>
import ActionsCategoryForm from "@/components/ActionsCategory/ActionsCategoryForm.vue";
export default {
  components: {ActionsCategoryForm },
  data() {
    return {
      title: 'ویرایش دسته بندی',
    }
  },
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
