<template>
  <v-form
    v-model="valid"
    @submit.prevent="submit()"
    :disabled="loader"
    class="rounded-0 pa-2 d-flex flex-column"
  >
    <v-row class="ma-2">
      <v-col cols="12" md="3">
        <amp-autocomplete
          text="سطح"
          rules="require"
          :items="$store.state.static.country_division"
          v-model="form.level"
        ></amp-autocomplete>
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="
          form.level == 'township' ||
          form.level == 'district' ||
          form.level == 'city' ||
          form.level == 'rural_district' ||
          form.level == 'village'
        "
      >
        <amp-autocomplete
          text="استان"
          v-model="parent_items.province"
          :items="state_filtered.filter(x => x.level == 'province')"
          rules="require"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="
          form.level == 'district' ||
          form.level == 'city' ||
          form.level == 'rural_district' ||
          form.level == 'village'
        "
      >
        <amp-autocomplete
          text="شهرستان"
          v-model="parent_items.township"
          :disabled="!Boolean(parent_items.province)"
          :items="
            state_filtered.filter(x => x.level == 'township') &&
            state_filtered.filter(x => x.parent_id == parent_items.province)
          "
          rules="require"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="
          form.level == 'city' ||
          form.level == 'rural_district' ||
          form.level == 'village'
        "
      >
        <amp-autocomplete
          text="بخش"
          v-model="parent_items.district"
          :disabled="!Boolean(parent_items.township)"
          :items="
            state_filtered.filter(x => x.level == 'district') &&
            state_filtered.filter(x => x.parent_id == parent_items.township)
          "
          rules="require"
        />
      </v-col>
      <v-col
        cols="12"
        md="3"
        v-if="form.level == 'rural_district' || form.level == 'village'"
      >
        <amp-autocomplete
          text="شهر"
          v-model="parent_items.city"
          :disabled="!Boolean(parent_items.district)"
          :items="
            state_filtered.filter(x => x.level == 'city') &&
            state_filtered.filter(x => x.parent_id == parent_items.district)
          "
          rules="require"
        />
      </v-col>
      <v-col cols="12" md="3" v-if="form.level == 'village'">
        <amp-autocomplete
          text="دهستان"
          v-model="parent_items.rural_district"
          :disabled="!Boolean(parent_items.city)"
          :items="
            state_filtered.filter(x => x.level == 'rural_district') &&
            state_filtered.filter(x => x.parent_id == parent_items.city)
          "
          rules="require"
        />
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="ترتیب نمایش"
          v-model="form.sort"
          :items="state_filtered"
        ></amp-input>
      </v-col>
      <v-col cols="12" md="3">
        <amp-input
          text="نام"
          v-model="form.name"
          :items="state_filtered"
          rules="require"
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
        :text="modelId ? 'ویرایش' : 'ایجاد'"
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
import { watch } from "vue";
export default {
  props: {
    modelId: {
      require: false,
      default: false
    }
  },
  data() {
    return {
      valid: true,
      loader: false,
      parent_items: {
        province: "",
        township: "",
        district: "",
        city: "",
        rural_district: "",
        village: ""
      },
      temporary_state: {
        province: "",
        township: "",
        district: "",
        city: "",
        rural_district: "",
        village: ""
      },
      state: [],
      state_filtered: [],
      form: {
        sort: 0,
        name: "",
        level: "",
        parent_id: ""
      }
    };
  },
  watch: {
    "form.level"() {
      this.state_filtered = this.state;
    },
    "temporary_state.province"() {
      this.parent_items.province = this.temporary_state.province;
    },
    "temporary_state.township"() {
      this.parent_items.township = this.temporary_state.township;
    },
    "temporary_state.district"() {
      this.parent_items.district = this.temporary_state.district;
    },
    "temporary_state.city"() {
      this.parent_items.city = this.temporary_state.city;
    },
    "temporary_state.rural_district"() {
      this.parent_items.rural_district = this.temporary_state.rural_district;
    },
    "temporary_state.village"() {
      this.parent_items.village = this.temporary_state.village;
    },
    "parent_items.province"() {
      if (this.modelId) {
        if (this.parent_items.province != this.temporary_state.province) {
          this.parent_items.township = "";
          this.parent_items.district = "";
          this.parent_items.city = "";
          this.parent_items.rural_district = "";
          this.parent_items.village = "";
        }
      }
    },
    "parent_items.township"() {
      if (this.modelId) {
        if (this.parent_items.township != this.temporary_state.township) {
          this.parent_items.district = "";
          this.parent_items.city = "";
          this.parent_items.rural_district = "";
          this.parent_items.village = "";
        }
      }
    },
    "parent_items.district"() {
      if (this.modelId) {
        if (this.parent_items.district != this.temporary_state.district) {
          this.parent_items.city = "";
          this.parent_items.rural_district = "";
          this.parent_items.village = "";
        }
      }
    },
    "parent_items.city"() {
      if (this.modelId) {
        if (this.parent_items.city != this.temporary_state.city) {
          this.parent_items.rural_district = "";
          this.parent_items.village = "";
        }
      }
    },
    "parent_items.rural_district"() {
      if (this.modelId) {
        if (
          this.parent_items.rural_district !=
          this.temporary_state.rural_district
        ) {
          this.parent_items.village = "";
        }
      }
    }
  },
  beforeMount() {
    this.setLevelState();
  },
  mounted() {
    if (Boolean(this.modelId)) {
      this.loadData();
    }
  },
  methods: {
    submit() {
      this.loader = true;
      switch (this.form.level) {
        case "province":
          this.form.parent_id = this.parent_id = null;
          break;
        case "township":
          this.form.parent_id = this.parent_id = this.parent_items.province;
          break;
        case "district":
          this.form.parent_id = this.parent_id = this.parent_items.township;
          break;
        case "city":
          this.form.parent_id = this.parent_id = this.parent_items.district;
          break;
        case "rural_district":
          this.form.parent_id = this.parent_id = this.parent_items.city;
          break;
        case "village":
          this.form.parent_id = this.parent_id =
            this.parent_items.rural_district;
          break;
        default:
          break;
      }
      let form = { ...this.form };
      let url = this.modelId
        ? "country-division/update"
        : "country-division/insert";
      this.$reqApi(url, form)
        .then(res => {
          this.loader = false;
          this.back();
        })
        .catch(err => {
          this.loader = false;
        });
    },
     loadState() {
      let items = [];
      return new Promise((response, rej) => {
        this.$store.state.setting.province.map((x)=> {items.push(x)})
        this.$store.state.setting.township.map((x)=> {items.push(x)})
        this.$store.state.setting.district.map((x)=> {items.push(x)})
        this.$store.state.setting.city.map((x)=> {items.push(x)})
        this.$store.state.setting.rural_district.map((x)=> {items.push(x)})
        this.$store.state.setting.village.map((x)=> {items.push(x)})
        response(items)
      });
    },
    setLevelState() {
      this.loadState()
        .then(res => {
          res.forEach(element => {
            this.state.push({
              text: element.name,
              value: element.id,
              parent_id: element.parent_id,
              level: element.level,
              cd2_level: element.cd2_level
            });
          });
        })
        .catch(err => {
          return err;
        });
    },
    loadData() {
      this.loader = true;
      this.$reqApi("country-division/show", { id: this.modelId })
        .then(res => {
          if (res.model.parent_id) {
            setTimeout(() => {
              this.setParent(res.model);
            }, 600);
          }
          this.form.name = res.model.name;
          this.form.level = res.model.level;
          this.form.sort = res.model.sort;
          this.form.parent_id = res.model.parent_id;
          this.form.id = res.model.id;
          this.loader = false;
        })
        .catch(err => {
          this.loader = false;
        });
    },
    setParent(model) {
      this.loader = true;
      let parent = model.parent_id;
      this.state.filter(element => {
        if (element.value == parent) {
          this.setLevels(element).then(res => {
            if (res.parent_id) {
              this.setParent(res);
            }
          });
        }
      });
      this.loader = false;
    },
    setLevels(element) {
      return new Promise(res => {
        if (element.level == "province") {
          this.temporary_state.province = element.value;
        }
        if (element.level == "township") {
          this.temporary_state.township = element.value;
        }
        if (element.level == "district") {
          this.temporary_state.district = element.value;
        }
        if (element.level == "city") {
          this.temporary_state.city = element.value;
        }
        if (element.level == "rural_district") {
          this.temporary_state.rural_district = element.value;
        }
        if (element.level == "village") {
          this.temporary_state.village = element.value;
        }
        res(element);
      });
    },
    back() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push("/country-division");
      }
    }
  }
};
</script>
