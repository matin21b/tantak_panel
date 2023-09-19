<template>
  <v-container fluid="">
    <v-form
      v-if="!loader"
      v-model="valid"
      @submit.prevent="submit()"
      :disabled="loader"
      class="rounded-0 pa-2 d-flex flex-column"
    >
      <v-row>
        <v-row cols="12" md="12" class="py-3">
          <v-col cols="12" md="6">
            <amp-input text="نام" v-model="form.name" rules="require" />
          </v-col>
          <v-col cols="12" md="6">
            <amp-input text="مسیر"  v-model="form.link" dir='ltr'  rules="check_route" />
          </v-col>
          <v-col cols="12" md="4">
            <amp-select
              text="نوع"
              v-model="form.type"
              :items="$store.state.static.menu_type"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-select
              text="والد"
              v-model="form.parent_id"
              :items="parent_menu"
            />
          </v-col>
          <v-col cols="12" md="4">
            <amp-input text="ترتیب" :is-number='true' v-model="form.sort" rules="number" />
          </v-col>
          <v-col cols="12" md="12">
            <v-divider></v-divider>
          </v-col>
        </v-row>
        <v-col cols="12" md="12" class="py-0">
          <amp-select
            text="دسترسی"
            :items="name"
            v-model="form.action_id"
            :multiple="true"
          />
        </v-col>
        <v-col cols="12" md="12" class="py-0" v-if="form.action_id.length > 0">
          <v-tabs v-model="tab" class="ma-3 center-div" color="white">
            <v-tab v-for="(item, index) in items" :key="item">
              <v-chip dark color="primary" :outlined="tab != index">
                {{ item }}
              </v-chip>
            </v-tab>
          </v-tabs>
          <v-tabs-items v-model="tab">
            <v-tab-item class="">
              <v-row>
                <v-col
                  cols="12"
                  md="12"
                  v-for="(item, index) in child"
                  :key="index"
                >
                  <v-row>
                    <v-col
                      cosl="12"
                      md="4"
                      v-for="(i, index) in item"
                      :key="index"
                    >
                      <v-checkbox
                        :label="i.name"
                        v-model="form.include_action_id"
                        :value="i.id"
                        :disabled="checkAlredyselectIncludeAcitonsId(i, false)"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item>
              <v-row>
                <v-col
                  cols="12"
                  md="12"
                  v-for="(item, index) in child_exclud"
                  :key="index"
                >
                  <v-row>
                    <v-col
                      cols="12"
                      md="4"
                      v-for="(i, index) in item"
                      :key="index"
                    >
                      <v-checkbox
                        color="error"
                        :value="i.id"
                        :label="i.name"
                        v-model="form.exclude_action_id"
                        :disabled="checkAlredyselectIncludeAcitonsId(i, true)"
                      ></v-checkbox>
                    </v-col>
                  </v-row>
                  <v-divider></v-divider>
                </v-col>
              </v-row>
            </v-tab-item>
          </v-tabs-items>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row class="ma-1 d-flex justify-center">
        <amp-button
          :text="modelId ? 'ویرایش':'ایجاد'"
          type="submit"
          icon="done"
          class="ma-1 mt-5"
          :disabled="!valid || loader"
          :loading="loader"
        ></amp-button>
      </v-row>
    </v-form>
    <v-card
      width="auto"
      min-height="500"
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
  </v-container>
</template>

<script>
import TooltipIcon from "@/components/Setting/TooltipIcon.vue";
export default {
  components: { TooltipIcon },
  props: {
    modelId: {
      require: false,
      default: false
    },
    actionsItem: {
      require: false
    },
    parentItem: {
      type: Array
    },
    emptyForm: {
      default: false
    },
    modelSub: {
      require: false,
      default: false
    }
  },
  data() {
    return {
      valid: true,
      loader: false,
      tab: null,
      name: [],
      child: [],
      parent_menu: [],
      child_exclud: [],
      disable_item_exclud: [],
      disable_item_includ: [],
      items: ["شامل شود", "شامل نشود"],
      form: {
        sort: 0,
        name: "",
        icon: "",
        link: "",
        parent_id: "",
        action_id: [],
        include_action_id: [],
        exclude_action_id: [],
        type: "active"
      }
    };
  },
  watch: {
    "form.action_id"() {
      if (this.form.action_id) {
        this.child_exclud = [];
        this.child = [];
        this.form.action_id.forEach(element => {
          this.form.include_action_id = [];
          this.form.exclude_action_id = [];
          let children = [];
          children = this.name.filter(x => x.value == element);
          if (children[0]) {
            this.child.push(children[0].child);
            this.child_exclud.push(children[0].child);
          }
        });
      }
    },
    modelId() {
      this.loadData();
    },
    parentItem() {
      this.parent_menu = this.parentItem;
    },
    modelSub() {
      if (this.modelSub) {
        setTimeout(() => {
          this.form.parent_id = this.modelSub;
        }, 200);
      }
    },
    actionsItem() {
      if (this.actionsItem) {
        this.actionsItem.forEach(element => {
          this.name.push({
            text: element.name,
            value: element.id,
            child: element.childs
          });
        });
      }
    },
    emptyForm() {
      if (this.emptyForm) {
        this.emptyForms();
      }
    },
    "form.include_action_id"() {
      this.disable_item_exclud = [];
      if (this.form.include_action_id) {
        this.form.include_action_id.forEach(ele => {
          delete ele.disable;
          this.child_exclud.forEach(j => {
            j.forEach(element => {
              if (element.id == ele) {
                this.disable_item_exclud.push(element.id);
              }
            });
          });
        });
      }
    },
    "form.exclude_action_id"() {
      this.disable_item_includ = [];
      if (this.form.exclude_action_id) {
        this.form.exclude_action_id.forEach(ele => {
          delete ele.disable;
          this.child.forEach(j => {
            j.forEach(element => {
              if (element.id == ele) {
                this.disable_item_includ.push(element.id);
              }
            });
          });
        });
      }
    }
  },
  methods: {
    submit() {
      this.loader = true;
      let form = { ...this.form };
      let url = this.modelId ? "menu-item/update" : "menu-item/insert";
      this.$reqApi(url, form)
        .then(res => {
          this.$emit("refreshItemmenu");
          this.$toast.success(this.modelId ? "منو ویرایش شد" : "منو ایجاد شد");
          this.$store.dispatch("auth/nuxtServerInit")
          this.loader = false;
        })
        .catch(err => {
          this.loader = false;
        });
    },
    checkAlredyselectIncludeAcitonsId(item, type) {
      let disable = false;
      if (type) {
        if (this.disable_item_exclud) {
          this.disable_item_exclud.filter(x => {
            if (x == item.id) {
              disable = true;
            }
          });
        }
        return disable;
      } else {
        if (this.disable_item_includ) {
          this.disable_item_includ.filter(x => {
            if (x == item.id) {
              disable = true;
            }
          });
        }
        return disable;
      }
    },
    loadData() {
      this.loader = true;
      this.$reqApi("menu-item/show", { id: this.modelId })
        .then(res => {
          this.form.sort = res.model.sort,
          this.form.name = res.model.name,
          this.form.icon = res.model.icon,
          this.form.link = res.model.link,
          this.form.type = res.model.type;
          this.form.sort = res.model.sort;
          this.form.parent_id = res.model.parent_id;
          this.loadParent(
            res.model.include_actions,
            res.model.exclude_actions
          ).then(res => {
            this.form.action_id = res.filter((x, y) => {
              if (x != null) {
                return res.indexOf(x) === y;
              }
            });
          });
          setTimeout(() => {
            this.setEncludeAndExcludItems(res.model.include_actions).then(
              res => {
                this.form.include_action_id = res;
              }
            );
            this.setEncludeAndExcludItems(res.model.exclude_actions).then(
              res => {
                this.form.exclude_action_id = res;
              }
            );
          }, 200);
          this.form.id = this.modelId;
          this.loader = false;
        })
        .catch(err => {
          this.loader = false;
        });
    },
    loadParent(data1, data2) {
      return new Promise((res, rej) => {
        let arr = [];
        for (let i in data1) {
          if (arr.indexOf(data1[i].action_category_id === -1)) {
            arr.push(data1[i].action_category_id);
          }
        }
        for (let i in data2) {
          if (arr.indexOf(data2[i].action_category_id === -1)) {
            arr.push(data2[i].action_category_id);
          }
        }
        if (arr.length > 0) {
          res(arr);
        }
      });
    },
    setEncludeAndExcludItems(data) {
      return new Promise((res, rej) => {
        let arr = [];
        data.forEach(element => {
          arr.push(element.id);
        });
        if (arr.length > 0) {
          res(arr);
        }
      });
    },
    emptyForms() {
      this.loader = true;
      if (this.form.id) {
        this.form.id = "";
      }
      this.form.sort = "",
      this.form.name = "",
      this.form.icon = "",
      this.form.link = "",
      this.form.parent_id = "",
      this.form.include_action_id = [],
      this.form.exclude_action_id = [],
      this.form.action_id = "";
      this.form.type = "active";
      this.loader = false;
    }
  }
};
</script>
