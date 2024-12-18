<template>
  <MessageExampleForm :model-id="$route.params.id" />
</template>

<script>
import MessageExampleForm from '@/components/Setting/MessageExampleForm.vue'
export default {
  components: { MessageExampleForm },
  data: () => ({
    title: 'ویرایش پیام',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
