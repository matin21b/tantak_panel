<template>
  <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
    <v-container fluid class="px-8">
      <v-row dense>
        <v-col cols="12" md="6">
          <amp-input text='عنوان' v-model="form.value.name"  />
        </v-col>
        <v-col cols="12" md="6">
          <amp-input text='مقدار' v-model="form.value.value"  />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12" md="12">
          <v-divider />
        </v-col>
        <v-col cols="12" md="12" class="text-center">
          <amp-button
            large
            icon="redo"
            class="my-1"
            color="error"
            text="انصراف"
            @click="redirectPage()"
          />
          <amp-button
            large
            icon="done"
            class="my-1"
            type="submit"
            color="success"
            :loading="loading"
            :disabled="!valid || loading"
            :text="modelId ? 'ویرایش' : 'ثبت'"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
export default {
  props: {
    modelId: { default: null }
  },
  data: () => ({
    valid: false,
    loading: false,
    createUrl: "/setting/insert",
    updateUrl: "/setting/update",
    showUrl: "/setting",

    form: {
      id: "",
      key: "qucik_access",
      value: {
        name:'',
        value:'',
      }
    }
  }),
  mounted() {
    if(this.modelId){
        this.loadData();
    }
  },

  methods: {
    submit() {
      let form = { ...this.form };
      this.loading = true;
      let url = this.updateUrl;
      if (!form["id"]) {
        url = this.createUrl;
      }
      form.value = JSON.stringify(this.form.value);
      this.$reqApi(url, form)
        .then(response => {
          this.$toast.success("اطلاعات ثبت شد");
          this.redirectPage()
          this.loading = false;
        })
        .catch(error => {
          this.loading = false;
        });
    },
    loadData() {
      this.loading = true;
      this.$reqApi(this.showUrl)
        .then(async response => {
          if (response.model.data.length == 0) {
          } else {
            response = response.model.data.filter((x)=> x.id == this.modelId)
            this.form["id"] = response[0].id;
            this.form.key = response[0].key;
            this.form.value = JSON.parse(response[0].value);
          }
          this.loading = false;
        })
        .catch(error => {
          this.redirectPage();
          this.loading = false;
        });
    },
    redirectPage() {
      if (window.history.length > 2) {
        this.$router.back();
      } else {
        this.$router.push(this.path);
      }
    }
  }
};
</script>
