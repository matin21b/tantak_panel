<template>
  <div class="px-3">
    <amp-labale :text="title" />
    <div class="dragbox" v-if="!selected_item || (selected_item && selected_item.progress == 100)">
      <input type="file" class="input-file" :accept="checkAcceptType" @change="selectFile($event)" />
      <p>
        <span>برای بارگذاری فایل</span><br />
        <span>کلیک کنید یا فایل را بکشید و رها کنید</span>
      </p>
    </div>

    <div v-if="selected_item && selected_item.progress < 100" class="center-div h-max mt-5">
      <v-progress-linear dark striped height="15" selected_item.progress v-model="selected_item.progress">
        <strong>{{ selected_item.progress }}%</strong>
      </v-progress-linear>
    </div>

    <v-row class="mt-4 center-icon">
      <v-col cols="1" v-for="(item, index) in items" :key="index">
        <v-img
          class="center-icon"
          width="60"
          height="60"
          v-if="item.icon == 'image' && item.progress && item.progress == 100"
          :src="$getImage(item.path)"
          @click="selectItem(item)"
        />
        <v-img v-else-if="item.progress && item.progress < 100" width="50" height="50" src="/image/loadnig.gif" />
        <v-icon v-else-if="item.icon != 'arvand_player'" class="pointer center-icon" size="40" :class="item.iconClass" @click="selectItem(item)">
          {{ item.icon }}
        </v-icon>
        <v-icon v-else class="pointer center-icon" size="40" :class="item.iconClass" @click="selectItem(item)"> movie </v-icon>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogShowItem.show" max-width="400">
      <v-card v-if="dialogShowItem.item" class="pa-4">
        <v-card-text class="text-center">
          <v-flex v-if="dialogShowItem.item.icon == 'image'">
            <v-img max-width="400" :src="$getImage(dialogShowItem.item.path)" />
          </v-flex>
          <v-flex v-else-if="dialogShowItem.item.icon == 'movie'">
            <video width="370px" controls>
              <source :src="$getImage(dialogShowItem.item.path)" />
            </video>
          </v-flex>
          <v-flex v-else-if="dialogShowItem.item.icon == 'music_video'">
            <audio controls>
              <source :src="$getImage(dialogShowItem.item.path)" type="audio/mpeg" />
            </audio>
          </v-flex>
          <v-flex v-else>
            <v-icon size="100" :class="[dialogShowItem.item.itemClass]">
              {{ dialogShowItem.item.icpn }}
            </v-icon>
          </v-flex>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn dark color="error darken-1" @click="deleteItem(dialogShowItem.item)"> حذف </v-btn>
          <v-spacer></v-spacer>
          <a
            target="_blank"
            v-if="dialogShowItem.item.icon != 'arvand_player'"
            :href="$getImage(dialogShowItem.item.path, false)"
            class="v-btn v-btn--contained theme--dark v-size--default darken-1 warning"
          >
            بازکردن
          </a>
          <v-btn dark color="green darken-1" @click="dialogShowItemClose()"> بستن </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: { default: 'بارگذاری تصویر' },
    arvandRandomLink: { default: '' },
    checkAcceptType: { default: 'image/*' },
    multiple: { type: Boolean, default: false },
    value: { type: String | Array, require: true },
  },
  data: () => ({
    loading: false,
    dialog: false,
    arvanFormData: '',
    arvanFormAttributes: '',
    arvanLink: '',
    file_name: '',
    items: [],
    selected_item: '',
    dialogShowItem: {
      item: null,
      show: false,
    },
  }),
  watch: {
    value() {
      this.initData()
    },
    dialog() {
      this.initData()
    },

    dialogShowItem: {
      deep: true,
      handler() {
        if (!this.dialogShowItem.show) this.dialogShowItem.item = null
      },
    },
  },
  mounted() {
    this.initData()
  },
  methods: {
    selectFile(event) {
      if (!(event && (event.target || event.dataTransfer))) {
        return
      }
      var files = event.target.files || event.dataTransfer.files
      if (files.length == 0) {
        return
      }
      this.loading = true
      this.$emit('setLoding', true)
      let item = this.pathToObject()
      this.selected_item = item
      if (this.multiple) {
        this.items = [item, ...this.items]
      } else {
        this.items = [item]
      }

      let formData = new FormData()

      formData.append('file', files[0])
      var f_type = ''
      // if (!files[0].type) {
      f_type = files[0].name.split('.')
      f_type = f_type[f_type.length - 1].toLowerCase()
      // }

      let config = {
        onUploadProgress: (progressEvent) => {
          let progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.updateItem(item.id, progress, false)
        },
      }
      this.$reqApi('/upload/insert', formData, config)
        .then((response) => {
          this.updateItem(item.id, 100, true, response.path)
          this.loading = false
          this.$emit('setLoding', false)
        })
        .catch((error) => {
          this.loading = false
          this.$emit('setLoding', false)
        })
    },
    updateItem(id, progress, active, path = '') {
      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index].id == id) {
          this.items[index].active = active
          this.items[index].progress = progress
          if (path) {
            let item = this.pathToObject(path, 100)
            this.items[index].path = path
            this.items[index].icon = item.icon
            this.items[index].iconClass = item.iconClass
            this.submit()
          }
          this.selected_item = this.items[index]
        }
      }
    },
    submit() {
      let items = this.items.filter((x) => x.active).map((x) => x.path)
      if (this.multiple) {
        this.$emit('input', items)
      } else if (items.length > 0) {
        this.$emit('input', items[0])
      } else {
        this.$emit('input', '')
      }
      this.closeDialog()
    },
    openDialog() {
      this.dialog = true
    },
    closeDialog() {
      this.dialog = false
    },
    initData() {
      let items = []
      if (typeof this.value == 'string' && this.value.length > 0) {
        items = [this.value]
      } else if (Array.isArray(this.value)) {
        items = [...this.value]
      }
      this.items = items.map((x) => this.pathToObject(x, 100, true))
    },
    getId() {
      let data = this.$moment().format('YYYY_MM_DD_HH:mm:ss.SSS')
      let rand = parseInt(Math.random() * 1000)
      return `${data}${rand}`
    },
    pathToObject(path = '', progress = 0, active = false) {
      let list = {
        id: this.getId(),
        path,
        active,
        progress,
        icon: 'image',
        // iconClass: 'purple white--text',
      }
      let type = path.split('.')
      type = type[type.length - 1].toLowerCase()
      if (['png', 'jpg', 'gif', 'jpeg', 'svg'].indexOf(type) > -1) {
        list.icon = 'image'
        // list.iconClass = 'blue white--text'
      } else if (['mp4', 'm4v', 'avi', 'mkv', '3gp', 'mov', 'wmv', 'flv', 'ogg', 'WebM', 'mpeg'].indexOf(type) > -1) {
        list.icon = 'movie'
        // list.iconClass = 'amber white--text'
      } else if (['json', 'm3u8'].indexOf(type) > -1) {
        list.icon = 'arvand_player'
        // list.iconClass = 'amber white--text'
      } else if (['mp3', 'mpeg'].indexOf(type) > -1) {
        list.icon = 'movie'
        // list.iconClass = 'red white--text'
      } else {
        list.icon = 'image'
        // list.iconClass = 'purple white--text'
      }
      return list
    },
    selectItem(item) {
      this.dialogShowItem.item = item
      this.dialogShowItem.show = true
    },
    dialogShowItemClose() {
      this.dialogShowItem.item = null
      this.dialogShowItem.show = false
    },
    deleteItem(item) {
      this.items = this.items.filter((x) => x.id != item.id)
      let items = this.items.filter((x) => x.active).map((x) => x.path)
      this.$emit('input', items)
      this.dialogShowItemClose()
    },
  },
}
</script>

<style scoped>
.dragbox {
  background: #ebebeb;
  padding: 10px 10px;
  height: 112px;
  position: relative;
  cursor: pointer;
  border-radius: 7px;
  border: 1px dashed #666;
}

.input-file {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
}

.dragbox:hover {
  background: '#eee';
}

.dragbox p {
  font-size: 1.2em;
  text-align: center;
  padding: 15px 0;
}
.width_80 {
  width: 80px !important;
  max-width: 80px !important;
}
.width_80 > img {
  width: 80px;
  height: 80px;
}

.center-icon {
  align-self: center !important;
  place-self: center;
  text-align: center;
}
</style>
