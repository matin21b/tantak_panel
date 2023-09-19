<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loader"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">
      <v-col cols="12" md="3">
        <amp-input text="نوع بیمه" v-model="form.bime_type" rules="require" />
      </v-col>
      <v-col cols="12" md="3" v-if="show_select_user">
        <UserSelectForm
          text="انتخاب کاربر"
          v-model="user"
          url="user"
          :role-id="[$store.state.auth.role.admin_id]"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          text="تکرار چرخه"
          v-model="form.repeatation_cycle"
          rules="require"
          :items="$store.state.static.repeatation_cycle"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-jdate text="تاریخ" v-model="form.date" rules="require" />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          :disabled="stats.lenght > 0 ? true : false"
          text="استان قبلی"
          v-model="form.province_id"
          :items="province"
          rules="require"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-select
          text="شهر"
          v-model="form.city_id"
          :items="citis"
          rules="require"
          :disabled="citis.length > 0 ? false : true"
        />
      </v-col>
      <v-col cols="12" md="12">
        <amp-textarea
          text="توضیحات"
          v-model="form.descriptions"
        />
      </v-col>
    </v-row>
    <v-row class="ma-1 d-flex justify-center">
      <amp-button
        text="انصراف"
        icon="redo"
        @click="back"
        color="error"
        class="ma-1"
      ></amp-button>
      <amp-button
        text="تایید"
        type="submit"
        icon="done"
        class="ma-1"
        :disabled="!valid || loader"
        :loading="loader"
      ></amp-button>
    </v-row>
  </v-form>
</template>
<script>
import UserSelectForm from "@/components/User/UserSelectForm";
export default {
  components: { UserSelectForm },
  props: {
    modelId: {
      require: false,
      default: false
    },
    inserUser: {
      require: false,
      default: false
    }
  },
  data() {
    return {
      valid: true,
      loader: false,
      show_select_user: false,
      province: [],
      user:[],
      citis: [],
      stats: {
        province: [],
        township: [],
        district: [],
        city: []
      },
      form: {
        sort: 0,
        bime_type: "",
        repeatation_cycle: "",
        descriptions: "",
        date: "",
        province_id: "",
        city_id: "",
        user_id: ""
      }
    };
  },
  watch: {
    "form.province_id"() {
      this.loadCitis(this.form.province_id);
    }
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
    if (this.$route.query.id) {
      this.form.user_id = this.$route.query.id;
    } else {
      this.show_select_user = true;
    }
    this.loadState().then(res => {
      res.filter(x => {
        this.province.push({
          text: x.name,
          value: x.id
        });
      });
    });
  },
  methods: {
    submit() {
      this.loader = true;
      if(this.user){
        this.form.user_id = this.user[0].id
      }
      this.form.id = this.modelId
      let form = { ...this.form };
      let url = this.modelId ? "bime-reminder/update" : "bime-reminder/insert";
      this.$reqApi(url, form)
        .then(res => {
          this.loader = false;
          this.back();
        })
        .catch(err => {
          this.loader = false;
        });
    },
    loadData() {
      this.loader = true;
      this.$reqApi("bime-reminder/show", { id: this.modelId })
        .then(res => {
          this.form.bime_type = res.model.bime_type;
          this.form.repeatation_cycle = res.model.repeatation_cycle;
          this.form.date = res.model.date;
          this.form.descriptions = res.model.descriptions;
          this.form.province_id = res.model.province.id;
          setTimeout(() => {
            this.form.city_id = res.model.city.id;
            this.user.push(res.model.user);
          }, 300);
          this.loader = false;
        })
        .catch(err => {
          this.loader = false;
        });
    },
    loadState() {
      return new Promise((response, rej) => {
        let filters = {
          level: {
            op: "=",
            value: "province"
          }
        };
        this.$reqApi("/country-division", {
          filters: filters,
          row_number: 3000000
        })
          .then(res => {
            response(res.model.data);
          })
          .catch(err => {
            return err;
          });
      });
    },
    loadCitis(id) {
      this.citis = [];
      this.$reqApi("/country-division/get-cities", {
        id: id,
        row_number: 300000
      }).then(res => {
        res.filter(x => {
          this.citis.push({
            text: x.name,
            value: x.id
          });
        });
      });
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/bime-reminder");
      }
    }
  }
};
</script>
