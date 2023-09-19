<template>
  <v-container fluid>
    <CentralBime :show-base="false" :infoUser="user_info" />
    <v-form
      v-model="valid"
      @submit.prevent="submit()"
      :disabled="loader"
      class="rounded-0 pa-2 d-flex flex-column"
    >
      <v-card
        width="auto"
        min-height="300"
        class="center-div elevation-0"
        v-if="loader"
      >
        <v-progress-circular
          :size="70"
          :width="7"
          color="purple"
          indeterminate
        ></v-progress-circular>
      </v-card>
      <v-row class="ma-2" v-if="!loader">
        <v-col cols="12" md="3">
          <amp-select
            text="نوع استعلام"
            v-model="form.query_type"
            :items="type_get_history"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.query_type == 0">
          <amp-input
            text="کد ملی مالک خودرو"
            v-model="form.national_code"
            :is-number="true"
            rules="require,nationalCode"
          />
        </v-col>
        <v-col cols="12" md="6" class="center-div" v-if="form.query_type == 0">
          <plate v-model="plate"  ref='clearPlate' />
        </v-col>
        <v-col cols="12" md="3" v-if="form.query_type == 1">
          <amp-input
            text="کد یکتا بیمه نامه"
            :is-number="true"
            v-model="form.unique_code"
            rules="require,min_2"
          />
        </v-col>
        <v-col
          cols="12"
          md="3"
          v-if="form.query_type == 1 || form.query_type == 2"
        >
          <amp-jdate
            text="تاریخ انقضا بیمه نامه"
            v-model="end_date"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.query_type == 2">
          <amp-autocomplete
            text="کد شرکت"
            :items="$store.state.static.company_name"
            v-model="form.company_code"
            rules="require"
          />
        </v-col>
        <v-col cols="12" md="3" v-if="form.query_type == 2">
          <amp-input
            text="شماره چاپی بیمه نامه"
            :is-number="true"
            v-model="form.print_number"
            rules="require,number"
          />
        </v-col>
        <v-col cols="12" md="3"> </v-col>
        <v-col cols="12" md="3"> </v-col>
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
          text="جستجو"
          type="submit"
          icon="done"
          class="ma-1"
          :disabled="!valid || loader"
          :loading="loader"
        ></amp-button>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import CentralBime from "@/components/CentralBime/CentralBimeList.vue";
import Plate from "@/components/CentralBime/Plate.vue";
export default {
  components: { CentralBime, Plate },
  data() {
    return {
      valid: true,
      loader: false,
      state: [],
      serach: "",
      items_body: [],
      main_items: [],
      user_info: [],
      type_get_history: [],
      plate: "",
      items_plk: [],
      dialog_item: { show: false, item: null },
      end_date: "",
      form: {
        query_type: null,
        plksrl: "",
        plk2: "",
        plk3: "",
        national_code: "",
        unique_code: "",
        end_date: "",
        company_code: "",
        print_number: ""
      }
    };
  },
  watch: {
    "form.query_type"() {
      this.clearBox();
    },
    end_date() {
      if (this.end_date) {
        let date = this.end_date;
        this.form.end_date = this.$toJalali(
          date,
          "YYYY-MM-DD",
          " jYYYY/jMM/jDD"
        );
      }
    },
    plate() {
      this.items_plk = this.plate.split("-");
    }
  },
  beforeMount() {
    this.type_get_history = [
      { text: "پلاک", value: 0 },
      { text: "کد یکتا", value: 1 },
      { text: "کد چاپی بیمه نامه", value: 2 }
    ];
  },
  mounted() {
    this.form.query_type = 0;
  },
  methods: {
    submit() {
      this.loader = true;
      this.form.plksrl = +this.items_plk[3];
      this.form.plk1 = +this.items_plk[0];
      this.form.plk2 = +this.items_plk[1];
      this.form.plk3 = +this.items_plk[2];
      let form = { ...this.form };
      this.$reqApi("/history-sales-bime/get-history", form)
        .then(res => {
          this.form.query_type = 0;
          this.clearBox();
          this.$store.dispatch('setting/reloadPlate', true)
          this.user_info = res;
          this.loader = false;
        })
        .catch(err => {
          this.loader = false;
          return err;
        });
    },
    clearBox() {
        if(this.$refs.clearPlate){
          console.log(this.$refs)
          this.$refs.clearPlate.form.p1 = 0
          this.$refs.clearPlate.form.p2 = 0
          this.$refs.clearPlate.form.p3 = 0
          this.$refs.clearPlate.form.p4 = 0
          this.$refs.clearPlate.p2 = 0
        }
        this.form.plksrl = "",
        this.form.plk1 = "",
        this.form.plk2 = "",
        this.form.plk3 = "",
        this.form.national_code = "",
        this.form.unique_code = "",
        this.form.end_date = "",
        this.form.company_code = "",
        this.form.print_number = "",
        this.end_date = "";
    },
    setStatus(data) {
      switch (data) {
        case 1:
          return "در مرکز بیمه و ناجا";
          break;
        case 2:
          return "در مرکز بیمه";
          break;
        case 3:
          return "در ناجا";
          break;
        case 4:
          return "دیتای یافت نشد";
          break;
        default:
          break;
      }
    },
    pickWorld(int) {
      const pik = this.$store.state.static.pik;
      let select_pik = "";
      pik.forEach(element => {
        if (element.value == int) {
          select_pik = element.text;
        }
      });
      return select_pik;
    },
    setCompany(int) {
      const company = this.$store.state.static.company_name;
      let slect_company = "";
      company.forEach(element => {
        if (element.value == int) {
          slect_company = element.text;
        }
      });
      return slect_company;
    },
    SearchItem(arr, search) {
      return arr.filter(item => item.name.startsWith(search));
    },
    closeDialog() {
      this.dialog_item.show = false;
      this.dialog_item.item = null;
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/get-history");
      }
    }
  }
};
</script>
<style scoped>
.contaer_box {
  border: 1px solid gray;
}
.contaer_box:hover {
  background: rgb(209, 209, 209);
}
.plkssrl {
  border: 1px solid gray;
  height: 100%;
  border-radius: 5px;
}
.container_palt_seril {
  border-left: 1px solid gray;
}
</style>
