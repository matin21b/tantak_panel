<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="3">
          <amp-input rules="require" text="نام" v-model="form.name" />
        </v-col>
        <v-col cols='12' md='3'>
          <amp-select  text='دسته بندی' :items='categorys' v-model='form.category_id' />
        </v-col>
        <v-col cols="12" md="2">
          <amp-input rules="" text="کد باز کردن خط" help-text=".کد ها را با , از هم تفکیک کنید" v-model="form.open_codes" />
        </v-col>
        <v-col cols="12" md="2" class="div-center center-div">
          <amp-button large icon="redo" class="my-1" color="error" text="انصراف" @click="redirectPage()" />
        </v-col>
        <v-col cols="12" md="2" class="div-center center-div">
           <amp-button
            large
            icon="done"
            class="my-1 "
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="6" v-for="(item, i) in action" :key="i">
          <v-card class="h-max pa-4">
            <v-card-title class='d-flex justify-lg-space-between'>
              <span class="font_16"> {{ item.name }} </span>
              <amp-help :text='item.description' v-if='item.description'  />
            </v-card-title>
            <v-divider></v-divider>
            <div class="d-flex flex-wrap">
              <v-checkbox class="ml-8" v-for="(child, j) in item.childs" :key="j" v-model="form.action_id" :label="child.name" :value="child.id" />
            </div>
          </v-card>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <!-- <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          /> -->
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import ArvanObjectList from '@/components/Upload/ArvanObjectList.vue'
export default {
  components: { ArvanObjectList },
  props: {
    modelId: { default: null },
  },
  data: () => ({
    panel: [],
    valid: false,
    loading: false,
    categorys:[],
    form: {
      name: '',
      action_id: [],
      category_id:'',
      open_codes:'',
    },
  }),
  computed: {
    action() {
      let items = this.$store.state.setting.actions
        .filter((x) => !(typeof x.parent == 'string' && x.parent.length > 20))
        .map((item) => {
          let childs = this.$store.state.setting.actions.filter((x) => x.parent == item.id)
          childs = [item, ...childs]
          return { ...item, childs }
        })

      if (this.panel.length == 0) {
        this.panel = items.map((x, i) => i)
      }
      return items
    },
  },
  beforeMount(){
    this.loadCateGory()
  },
  mounted() {
    if (this.modelId) {
      this.loadData()
    }
    this.$store.dispatch('setting/getActionServer')
  },
  methods: {
    submit() {
      let form = { ...this.form }
      this.loading = true
      let url = '/role/insert'
      if (this.modelId) {
        form['id'] = this.modelId
        url = '/role/update'
      }
      this.$reqApi(url, form)
        .then((response) => {
          if (this.modelId) {
            this.$toast.success('اطلاعات ویرایش شد')
            } else {
            this.$toast.success('اطلاعات ثبت شد')
          }
          this.redirectPage()
        })
        .catch((error) => {
          this.loading = false
        })
    },
    loadData() {
      this.loading = true
      this.$reqApi('/role/show', { id: this.modelId })
        .then(async (response) => {
          this.form['id'] = response.model.id
          this.form.name = response.model.name
          this.form.open_codes = response.model.open_codes
          this.form.action_id = response.model.actions.map((x) => x.id)
          this.form.category_id = response.model.category_id
          this.loading = false
        })
        .catch((error) => {
          this.redirectPage()
          this.loading = false
        })
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back()
      } else {
        this.$router.push('/roles/role')
      }
    },
    loadCateGory(){
       this.$reqApi('/role-category').then(res=>{
        res.model.data.forEach(ele => {
          this.categorys.push({
            text : ele.name,
            value: ele.id
          })
        });
      }) 
    }
  },
}
</script>
