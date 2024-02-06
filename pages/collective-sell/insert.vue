<template>
    <div>
      <CollectiveSellForm  />
    </div>
  </template>
  
  <script>
  import CollectiveSellForm from '@/components/CollectiveSell/CollectiveSellForm.vue'
  export default {
    components: { CollectiveSellForm },
    data: () => ({
      title: 'ثبت ناحیه جدید',
    }),
    beforeMount() {
    },
    mounted() {
      this.$store.dispatch('setPageTitle', this.title)
    },
  }
  </script>