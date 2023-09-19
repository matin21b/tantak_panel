<template>
  <div>
      <RoleForm :model-id='$route.params.id' />
  </div>
</template>

<script>
import RoleForm from '@/components/Roles/RoleForm.vue'
export default {
  components:{RoleForm},
  data: () => ({
    title: 'ویرایش نقش',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>