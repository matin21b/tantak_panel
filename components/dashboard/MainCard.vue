<template>
  <table border="1" :class="['my-6 border5', $vuetify.breakpoint.mdAndUp ? 'width-800' : '']">
    <tr v-for="(row, i) in rows" :key="i">
      <td>
        <div class="d-flex align-center">
        <!-- <v-icon :color="row.color">{{ row.icon1 }}</v-icon> -->
        <img :src="row.icon1" />
        <span :class="row.color + '--text'" class="mr-2">{{ row.title }}</span>
        </div>
      </td>
      <td class="pb-0">
        <div
          v-for="(menu, i) in row.menus"
          :key="i"
          class="d-flex align-center justify-space-between mb-3"
        >
          <div>
            <img v-if="menu.img" :src="menu.img" />
            <v-icon v-else :color="menu.color">{{ menu.icon }}</v-icon>
            <span>{{ menu.title }}</span>
          </div>
          <div :class="['px-2 white--text', menu.color]">{{ row.count }}</div>
        </div>
      </td>
    </tr>
  </table>
</template>
<script>
export default {
  data: () => ({
    rows: [
      {
        icon1: "/image/dashboard/sales.svg",
        title: "فروش",
        color: "primary",
        menus: [
          {
            img: "/image/dashboard/message.svg",
            title: "پیام های جدید",
            color: "primary",
          },
        ],
        count: "2",
      },
      {
        icon1: "/image/dashboard/Project.svg",
        title: "پروژه ها",
        color: "blue",
        menus: [
          {
            img: "/image/dashboard/message2.svg",
            title: "پیام های جدید",
            color: "blue",
          },
        ],
        count: "2",
      },
      {
        icon1: "/image/dashboard/duties.svg",
        title: "وظایف شما",
        color: "green",
        menus: [
          {
            icon: "radio_button_checked",
            title: "وظایف امروز",
            color: "green",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف دارای تاخیر",
            color: "red",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف دارای زمان",
            color: "blue",
          },
          {
            icon: "radio_button_checked",
            title: "وظایف بدون زمان",
            color: "gray",
          },
        ],
        count: "2",
      },
      {
        icon1: "/image/dashboard/Email.svg",
        title: "نامه ها",
        color: "black",
        menus: [
          {
            icon: "mail",
            title: "پیام های جدید",
          },
        ],
        count: "2",
      },
    ],
  }),
};
</script>
