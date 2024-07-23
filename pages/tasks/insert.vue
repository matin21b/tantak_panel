<template>
  <TasksForm />
</template>

<script>
import TasksForm from '@/components/Tsaks/TasksForm.vue'
export default {
  components: { TasksForm },
  data: () => ({
    title: 'ایجاد   وظیفه  جدید',
  }),
  mounted() {
    this.$store.dispatch('setPageTitle', this.title)
  },
}
</script>
