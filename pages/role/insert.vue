<template>
  <div>
     <RoleForm />
  </div>
</template>

<script>
import RoleForm from '@/components/Roles/RoleForm.vue'
export default {
  components:{RoleForm},
  data: () => ({
    title: 'ثبت نقش',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>