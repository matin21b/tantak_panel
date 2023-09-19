<template>
  <div>
      <div>
        <v-chip
          dark
          label
          class="ma-2"
          color="primary"
          v-for="(item, key) in items"
          :key="key"
          @click="selectItem(item)"
          :outlined="tab != item.value"
        >
          {{ item.text }}
        </v-chip>
        <v-divider />
      </div>
    <UserForm v-if="tab == 'edit'" :model-id="$route.params.id" />
    <CentralBime v-if="tab == 'central'" :model-id="$route.params.id" />
    <BimeReminderList v-if="tab == 'reminder'" :model-id='$route.params.id'/>
  </div>
</template>

<script>
import UserForm from '@/components/User/UserForm.vue'
import CentralBime from '@/components/CentralBime/CentralBimeList.vue'
import BimeReminderList from '@/components/BimeReminder/BimeReminderList.vue'
export default {
  components: { UserForm , CentralBime , BimeReminderList },
  data: () => ({
    tab: 'edit',
    items: [
      { text: 'ویرایش اطلاعات', value: 'edit' },
      { text: 'سوابق بیمه', value:'central'},
      { text:'یادآوری بیمه', value:'reminder'}
      ],
    title: 'ثبت کاربر جدید',
  }),
  beforeMount() {
    this.$store.dispatch('setPageTitle', this.title)
  },
  methods: {
    selectItem(item) {
      this.tab = item.value
    },
  },
}
</script>