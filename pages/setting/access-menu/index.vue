<template>
  <v-card min-height="70vh">
    <v-row>
      <v-col cols="12" md="5" class="px-7">
        <v-card class="mx-auto" transition="scroll-x-transition">
          <v-sheet class="pa-4 primary">
            <v-row class="d-flex align-center">
              <v-col cols="12" md="11">
                <v-text-field
                  v-model="search"
                  label="جستجو ....."
                  dark
                  flat
                  solo-inverted
                  hide-details
                  clearable
                  clear-icon="mdi-close-circle-outline"
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="1" class="center-div">
                <div class="text-center d-flex ma-4 justify-center">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn :class="insert ? 'error' : 'success' "  color='white' icon @click="insertMenu"  v-bind="attrs" v-on="on">
                        <v-icon v-if='!insert' >add</v-icon>
                        <v-icon v-if='insert' >close</v-icon>
                      </v-btn>
                    </template>
                    <span v-if='!insert' >افزودن منو</span>
                    <span v-if='insert' >انصراف</span>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </v-sheet>
          <v-card-text>
            <v-treeview
              rounded
              hoverable
              activatable
              :items="items"
              transition
              open-on-click
              :search="search"
              :filter="filter"
              :open.sync="open"
            >
              <template v-slot:label="{ item }">
                <v-hover
                  v-slot="{ hover }"
                  class="d-flex justify-space-between align-center"
                >
                  <div class="pointer" @click="handelClick($event, item)">
                    {{ item.name }}
                    <div :class="hover ? 'd-inline' : 'd-none'">
                      <v-btn small icon @click="addSubMenu($event, item)">
                        <v-icon dense class="pointer success--text">
                          add
                        </v-icon>
                      </v-btn>
                      <v-btn small icon @click="deleteItem($event, item)">
                        <v-icon dense class="pointer error--text">
                          delete
                        </v-icon>
                      </v-btn>
                    </div>
                  </div>
                </v-hover>
              </template>
            </v-treeview>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="7" class="pl-8">
        <v-card>
          <v-card-title class="primary white--text center-div" >
            <span class="pa-2 font_18" v-if="insert == false && edit == false">
              تنظیمات منو
            </span>
            <span v-if="insert" class="pa-2 font_18"> افزودن منو </span>
            <span v-if="edit" class="pa-2 font_18"> ویرایش منو </span>
            <br><br>
          </v-card-title>
          <v-expand-transition>
            <v-card-text v-show="insert">
              <AccessMenuForm
                :actions-item="actions_item"
                @refreshItemmenu="reloadMenu"
                :empty-form="insert"
                :parent-item="parent_itms"
              />
            </v-card-text>
          </v-expand-transition>
          <v-expand-transition>
            <v-card-text v-show="add">
              <AccessMenuForm
                @refreshItemmenu="reloadMenu"
                :actions-item="actions_item"
                :empty-form="add"
                :model-sub="sub_menu_item"
                :parent-item="parent_itms"
              />
            </v-card-text>
          </v-expand-transition>
          <v-expand-transition>
            <v-card-text v-show="edit" v-if="edit || menu_id">
              <AccessMenuForm
                @refreshItemmenu="reloadMenu"
                :empty-form="edit"
                :actions-item="actions_item"
                :model-id="menu_id"
                :parent-item="parent_itms"
              />
            </v-card-text>
          </v-expand-transition>
        </v-card>
        <AmpDelete
          :id="id_delete"
          deleteUrl="/menu-item/delete"
          :value="delete_value"
          @closeDialog="closeDelete"
          @reloadTable="reloadMenu"
        />
      </v-col>
    </v-row>
  </v-card>
</template>

<script>
import AccessMenuForm from "@/components/Setting/AccessMenuForm.vue";
import AmpDelete from "@/components/Base/AmpDelete";
export default {
  components: { AccessMenuForm, AmpDelete },
  data: () => ({
    title: "تنظیمات منو های منو",
    insert: false,
    edit: false,
    add: false,
    id_delete: 0,
    sub_menu_item: "",
    actions_item: [],
    actions: [],
    menu_id: [],
    panel: [],
    parent_itms: [],
    items: [],
    delete_value: false,
    open: [1, 2],
    search: null,
    case: false
  }),
  computed: {
    filter() {
      return this.case
        ? (item, search, textKey) => item[textKey].indexOf(search) > -1
        : undefined;
    }
  },
  watch: {
    items() {
      this.setParent(this.items);
    }
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    this.loadData();
  },
  mounted() {
    this.action().then(res => {
      this.actions_item = res;
    });
  },
  methods: {
    action() {
      return new Promise((res, rej) => {
        let items = this.$store.state.setting.actions
          .filter(
            x =>
              !(
                typeof x.action_category_id == "string" &&
                x.action_category_id.length > 20
              )
          )
          .map(item => {
            let childs = this.$store.state.setting.actions.filter(
              x => x.action_category_id == item.id
            );
            childs = [item, ...childs];
            return { ...item, childs };
          });

        if (this.panel.length == 0) {
          this.panel = items.map((x, i) => i);
        }
        res(items);
      });
    },
    loadData() {
      this.items = [];
      let items_menu = [];
      this.$reqApi("/menu-item/tree-list",{row_number:2000}).then(res => {
        res.forEach(element => {
          items_menu.push({
            id: element.id,
            type: element.type,
            name: element.name,
            sort: element.sort,
            children: element.children,
            exclude_actions: element.exclude_actions,
            include_actions: element.include_actions
          });
        });
        this.items = items_menu.sort((a, b) => {
          return a.sort - b.sort;
        });
      });
      this.action().then(res => {
        this.actions_item = res;
      });
    },
    reloadMenu() {
      setTimeout(() => {
        this.edit = false;
        this.insert = false;
        this.add = false;
        this.setParent(this.items);
        this.loadData();
      }, 400);
    },
    insertMenu(event, id) {
      event.stopPropagation();
      this.insert = !this.insert;
      this.action().then(res => {
        this.actions_item = res;
      });
      this.setParent(this.items);
      this.edit = false;
      this.add = false;
    },
    addSubMenu(event, id) {
      this.sub_menu_item = id.id;
      event.stopPropagation();
      this.action().then(res => {
        this.actions_item = res;
      });
      this.setParent(this.items);
      this.add = true;
      this.insert = false;
      this.edit = false;
    },
    deleteItem(event, id) {
      event.stopPropagation();
      this.id_delete = id.id;
      this.delete_value = true;
    },
    setParent(data) {
      if (Array.isArray(data)) {
        data.forEach(ele => {
          this.parent_itms.push({
            text: ele.name,
            value: ele.id
          });
          if (ele.children) {
            this.setParent(ele.children);
          }
        });
      }
    },
    closeDelete() {
      this.id_delete = "";
      this.$store.dispatch("auth/nuxtServerInit");
      this.delete_value = false;
    },
    handelClick(event, id) {
      this.action().then(res => {
        this.actions_item = res;
      });
      event.stopPropagation();
      this.insert = false;
      this.edit = true;
      this.add = false;
      this.menu_id = id.id;
    }
  }
};
</script>
