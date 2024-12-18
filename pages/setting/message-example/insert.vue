<template>
  <MessageExampleForm />
</template>

<script>
import MessageExampleForm from '@/components/Setting/MessageExampleForm.vue'

export default {
  components: { MessageExampleForm },
  data: () => ({
    title: 'ایجاد   پیام جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
