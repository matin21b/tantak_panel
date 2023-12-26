<template>
    <v-form v-model="valid" @submit.prevent="submit()" :disabled="loading">
      <v-container fluid class="px-8">
        <v-row dense>
          <v-col cols="12" md="12">
            <amp-labale :text="text" />
            <v-file-input dense outlined accept=".xlsx" v-model="form.file" />
          </v-col>
        </v-row>
  
        <v-row dense>
          <v-col cols="12" md="12">
            <v-divider />
          </v-col>
          <v-col cols="12" md="12" class="text-center">
            <amp-button
              large
              text="ثبت"
              icon="done"
              class="my-1"
              type="submit"
              color="success"
              :loading="loading"
              :disabled="!valid || loading"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </template>
  
  <script>
  export default {
    props:{
        url:{
            type:String,
            require:true
        },
        backurl:{
            type:String,
        },
        text:{
          type:String,
          default:"فایل اکسل"
        }
    },
    data: () => ({
      valid: false,
      loading: false,
      form: {
        file: null,
      },
    }),
    methods: {
      submit() {
        if (this.form.file == null) {
          return;
        }
        let form_data = new FormData();
        for (const key in this.form) {
          form_data.append(key, this.form[key]);
        }
  
        this.loading = true;
        this.$reqApi(this.url, form_data)
          .then((response) => {
            this.$toast.success("اطلاعات ثبت شد");
          })
          .catch((error) => {
            this.loading = false;
          });
      },
    },
  };
  </script>
  