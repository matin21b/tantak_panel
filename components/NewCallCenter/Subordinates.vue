<template>
  <div>
    <v-row>
      <v-col cols="12">
        <v-alert type="warning" text outlined class="text-center">
          در صورت انتخاب کارشناس انتقال دیتا بیین کارشناس های انتخاب شده جابه جا
          میشود
          <h1>
            <small class="primary--text">
              با انتخاب سرپرست شما به لیست کارشناس های زیر مجموعه آن فرد دسترسی
              دارید
            </small>
          </h1>
        </v-alert>
      </v-col>
      <v-col cols="12">
        <amp-autocomplete
          :disabled="new_supervisor.length < 0 || loading"
          text="قطع همکاری با چه نقشی صورت گیرد ؟‌"
          v-model="change_empoly"
          :items="change_message_items"
          rules="require"
        />
      </v-col>  
          <v-col cols="12">
        <amp-autocomplete
          :disabled="new_supervisor.length < 0 || loading"
          text="پیام ها به کدام نقش منتقل شود‌؟‌"
          v-model="change_message"
          :items="change_message_items"
          rules="require"
        />
      </v-col>
      <v-col cols="6">
        <UserSelectForm
          text="سرپرست فعلی"
          v-model="seupervisor"
          url="user/list-employee"
          rules="require"
        />
      </v-col>
      <v-col cols="6">
        <amp-autocomplete
          :disabled="seupervisor.length < 0 ||  loading"
          text="کارشناس فعلی"
          v-model="form.operator_id"
          :items="operator_items"
          rules="require"
        />
      </v-col>

      <v-col cols="6">
        <UserSelectForm
          :disabled="seupervisor.length < 0 ||  loading"
          text="سرپرست جدید"
          v-model="new_supervisor"
          url="user/list-employee"
          rules="require"
        />
      </v-col>
      <v-col cols="6">
        <amp-autocomplete
        v-if="operator"
          :disabled="new_supervisor.length < 0 ||  loading"
          text="کارشناس جدید"
          v-model="form.new_operator_id"
          :items="new_operator_items"
          rules="require"
        />
      </v-col>
    </v-row>
  </div>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";

export default {
  components: {
    UserSelectForm,
  },
  data: () => ({
    loading: false,
    seupervisor: [],
    new_supervisor: [],
    operator_items: [],
    change_message_items: [{text:"سرپرست",value:"nsupervisor"} , {text:"کارشناس",value:"operator"}],
    new_operator_items: [],
    change_message: "",
    change_empoly: "",
    operator: "",
    new_operator: "",
    form: {
      supervisor_id: "",
      new_supervisor_id: "",
      operator_id: "",
      new_operator_id: "",
    },
    //      url=""
  }),

  watch: {
    form: {
      deep: true,
      handler() {
        this.$emit('sendForm' , this.form)
      },
    },
    seupervisor: {
      deep: true,
      handler() {
        if (this.seupervisor.length > 0) {
          this.form.supervisor_id = this.seupervisor[0].id;
          this.setSubordinates("old", this.seupervisor[0].id);
        }
      },
    },
    new_supervisor: {
      deep: true,
      handler() {
        if (this.new_supervisor.length > 0) {
          this.setSubordinates("new", this.new_supervisor[0].id);
          this.form.new_supervisor_id = this.seupervisor[0].id;
        }
      },
    },
  },

  methods: {
    setSubordinates(key, id) {
      this.loading = true;
      this.$reqApi("user/list-operator", { supervisor_id: id })
        .then((res) => {
          let sub_users = [];
          for (let i = 0; i < res.length; i++) {
            const x = res[i];
            let name =
              Boolean(x.first_name) && Boolean(x.last_name)
                ? `${x.first_name} ${x.last_name} | ${x.username}`
                : x.username;
            sub_users.push({
              text: name,
              value: x.id,
            });
          }
          if (key == "old") {
            this.operator_items = sub_users;
            console.log("this.operator ==> ", this.operator);
          } else {
            this.new_operator_items = sub_users;
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
