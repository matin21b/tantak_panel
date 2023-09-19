<template>
  <div>
    <UserForm  />
  </div>
</template>

<script>
import UserForm from '@/components/User/UserForm.vue'
export default {
  components: { UserForm },
  data: () => ({
    title: 'ثبت کاربر جدید',
  }),
  beforeMount() {
  },
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>