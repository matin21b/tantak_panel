<template>
  <div class="parent-heder-menu mb-1">
    <v-row class="d-flex align-center">
      <v-col cols="12" md="1" class="ma-0 pa-0">
        <v-text-field
          v-model="search"
          label="جستجو منو ..."
          class="serachBoxMnue mb-1"
          dark
          flat
          dense
          solo-inverted
          hide-details
          clearable
        ></v-text-field>
      </v-col>
      <v-col cols="12" md="11" class="contaier_mnue">
        <v-row class="d-flex align-center">
          <v-icon class="white--text mt-4 mx-1 btn_hover" @click="rightScroll">keyboard_arrow_right</v-icon>
          <v-col cols="12" md="11" class="pa-0">
            <template>
              <div ref="treeviewContainer">
                <v-treeview
                  :items="items"
                  class="rounded elevation-3 black--text d-flex backgorundAppBar mt-2"
                  id="scrollBar"
                  v-model="tree"
                  hoverable
                  activatable
                  dense
                  ref="CollapsMnue"
                  :search="search"
                  :filter="filterMnue"
                  transition
                  active-class="primary--text active_class"
                  @update:active="handelClick"
                  item-key="id"
                  :open="open"
                  :open-all="collaps_mnue"
                  open-on-click
                >
                </v-treeview>
              </div>
            </template>
          </v-col>
          <v-icon class="white--text mt-4 btn_hover mx-1" style="left: -30px" @click="leftScroll">keyboard_arrow_left</v-icon>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data: () => ({
    tree: [],
    menu_items: {},
    search: null,
    case_sensitive: false,
    collaps_mnue: false,
    result: [],
    open: [],
  }),
  computed: {
    items() {
      return [...this.$store.state.static.mnue_tree]
        .map((x) => {
          return this.filterImtes(x)
        })
        .filter((x) => {
          if (x.name != '' && x.name != null) {
            if (x.children) {
              if (x.children.length > 0) {
                for (let i in x.children) {
                  if (x.children[i].children) {
                    if (x.children[i].children && x.children[i].children.length > 0) {
                      x.children = this.filterChildren(x.children)
                      return true
                    }
                  } else {
                    return true
                  }
                }
              } else {
                return false
              }
            } else {
              return true
            }
          }
        })
    },
    filterMnue() {
      return this.case_sensitive ? (item, search, textKey) => item[textKey].indexOf(search) > -1 : undefined
    },
  },
  beforeMount() {
    this.getAllItem(this.$store.state.static.mnue_tree)
  },
  watch: {
    search() {
      if (this.search == null || this.search == '') {
        this.$refs.CollapsMnue.updateAll(this.collaps_mnue)
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handelOustSideClikc)
    let handel_menu_clik = document.querySelector('.backgorundAppBar').addEventListener('click', (event) => {
      if (event.clientX < 170) {
        this.leftScroll()
      }
      if (event.clientX > 1000) {
        this.rightScroll()
      }
    })
    let hanel_icon_sub_menu_click = document.querySelectorAll('.v-treeview-node__toggle')
    hanel_icon_sub_menu_click.forEach((element) => {
      element.addEventListener('click', (event) => {
        if (event.clientX < 170) {
          this.leftScroll()
        }
        if (event.clientX > 1000) {
          this.rightScroll()
        }
      })
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handelOustSideClikc)
  },
  methods: {
    handelClick(items) {
      let selected_item = this.result.find((item) => item.id == items[0])
      if (selected_item) {
        if (selected_item.route) {
          this.selectMenu(selected_item)
        }
      }
    },
    selectMenu(item) {
      this.$refs.CollapsMnue.updateAll(this.collaps_mnue)
      if (item.route == '/cooming-soon') {
        alert('بزودی')
        return
      }
      if (item.route.indexOf('http') == 0) {
        window.open(item.route, '_blank')
        return
      }
      for (const key in this.menu_items) {
        this.menu_items[key] = false
      }
      this.$router.push(item.route)
    },
    checkAccess(item) {
      let pg_error = true
      let person = this.$store.state.auth.pg_user
      if (person) {
        pg_error = person.error
      }

      let actions = this.$store.state.auth.action
      if (pg_error && item.payamgostar) {
        return false
      }
      if (typeof item.access == 'string') {
        if (item.access == '*') {
          return true
        } else {
          return actions.indexOf(item.access) > -1
        }
      } else if (typeof item.access == 'function') {
        return item.access(this.$store.state)
      }
    },
    leftScroll() {
      let treeview = document.getElementById('scrollBar')
      let wdith = treeview.scrollWidth
      treeview.scrollLeft -= 200
    },
    rightScroll() {
      let treeview = document.getElementById('scrollBar')
      let wdith = treeview.scrollWidth
      treeview.scrollLeft += 200
    },
    handelOustSideClikc(event) {
      if (event.target._prevClass == 'v-treeview-node__label' || event.target._prevClass == 'v-treeview-node__root') {
        return
      } else {
        const treeViewcontainer = this.$refs.treeviewContainer
        if (!treeViewcontainer.contains(event.traget)) {
          this.$refs.CollapsMnue.updateAll(this.collaps_mnue)
        }
      }
    },
    getAllItem(items) {
      items.forEach((item) => {
        this.result.push(item)
        if (item.children) {
          this.result.concat(this.getAllItem(item.children))
        }
      })
    },
    filterChildren(item) {
      return item.filter((x) => {
        if (x.children) {
          if (x.children.length > 0) {
            x.children = this.filterChildren(x.children)
            return true
          } else {
            return false
          }
        } else {
          return true
        }
      })
    },
    filterImtes(items) {
      if (items.children) {
        let child = items.children.map((j) => {
          if (j.children) {
            return this.filterImtes(j)
          } else {
            if (this.checkAccess(j)) {
              return { ...j }
            }
          }
          return { name: '', id: this.getRandomNumber(1000000), access: 'dontAvilabel' }
        })
        return {
          ...items,
          children: child.filter((x) => x.name),
        }
      } else {
        if (this.checkAccess(items)) {
          return { ...items }
        }
      }
      return { name: '', id: this.getRandomNumber(1000000), access: 'dontAvilabel' }
    },
    getRandomNumber(max) {
      return Math.floor(Math.random() * max)
    },
  },
}
</script>
<style scoped>
.serachBoxMnue {
  margin-top: 6px;
}
.btn_scroll_bar {
  position: absolute;
  z-index: 20000;
}
.btn_hover:hover {
  cursor: pointer;
}
.btn_scroll {
  position: absolute;
}
.contaier_mnue {
  padding-bottom: 2%;
  position: relative;
}
.backgorundAppBar {
  background: white;
  visibility: visible;
  scroll-behavior: smooth;
  max-width: 94%;
  min-width: 94%;
  max-height: 85vh;
  behavior: smooth;
  top: 0;
  position: absolute;
  backdrop-filter: blur(1px);
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: scroll;
  overflow-y: scroll;
}
.backgorundAppBar::-webkit-scrollbar {
  display: none;
}
.backgorundAppBar::-webkit-scrollbar-track {
  display: none;
}
.v-treeview-node__root.v-treeview-node--active {
  pointer-events: none;
}

.v-treeview-node__toggle {
  pointer-events: all;
}
</style>
