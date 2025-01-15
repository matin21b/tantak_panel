<template>
  <div>
    <div>
      <RoleChip
        v-show="showChips"
        @selectRole="addRole"
    
        :value="rootBody.role_id"
      />
      <UserList
        :root-body="rootBody"
        :btnActions="btnActions"
        :setIssableItem="true"
      />
    </div>
  </div>
</template>

<script>
import RoleChip from "~/components/User/RoleChip.vue";
import UserList from "~/components/User/UserList.vue";
export default {
  components: { RoleChip, UserList },
  data: () => ({
    rootBody: { role_id: [] },
    btnActions: [],
    title: "کاربران",
  }),
  computed: {
    showChips() {
      if (this.$store.state.auth.role.is_manager_psychologist) {
        if (this.$store.state.auth.user.roles.length == 1) {
          return false;
        }
      }
      return true;
    },
  },
  beforeMount() {
    (this.rootBody.role_id = ["791d1b02-3610-4177-9051-eb7ae6b72def"]),
      this.$store.dispatch("setPageTitle", this.title);
  },
  methods: {
    addRole(id) {
      this.rootBody.role_id = [id];
    },

  },
};
</script>
