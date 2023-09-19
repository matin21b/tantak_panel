<template>
  <div class="h-max center-div">
    <v-card width="400" height="100%" class="text-center pa-6 center-div" color="">
      <v-card elevation="0">
        <img src="/image/logo.png" width="150" height="auto" class="mb-2" />
        <br />
        <span class="font_18 mb-3">سرویس احراز هویت آرامین</span>
        <v-card class="rounded-lg mt-2" elevation="3">
          <div class="primary center-div h-max">
            <v-card height="auto" color="" class="d-flex">
              <v-card v-if="loading" class="center-div pa-16" style="width: 352px; height: 300px">
                <v-progress-circular :size="70" :width="7" indeterminate color="success" />
              </v-card>
              <v-card v-else-if="Boolean(user)">
                <!-- <div class="rounded  center-div" style="width: 100%; aspect-ratio: 1"> -->
                <img :src="$getImage(user.avatar, false)" class="rounded-circle mt-3" style="width: 35%; height: auto" />
                <!-- </div> -->
                <div class="my-3">
                  <span class="font_bold font_20">{{ user.first_name }} {{ user.last_name }}</span>
                  <br />
                  <span class="font_bold">نام کاربری: {{ user.username }}</span>
                </div>
                <div class="pa-4">
                  <amp-button block class="" color="success" icon="how_to_reg" @click="submit()" text="تایید اطلاعات و ورود" />
                </div>
              </v-card>
              <v-card v-else width="auto" class="" elevation="0">
                <SSoOTPForm :redirect="false" />
              </v-card>
            </v-card>
          </div>
        </v-card>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import SSoOTPForm from '@/components/Auth/SSoOTPForm.vue'
export default {
  layout: 'empty',
  components: {
    SSoOTPForm,
  },
  data: () => ({
    loading: true,
  }),
  computed: {
    user() {
      return this.$store.state.auth.user
    },
    is_mobile() {
      return !this.$vuetify.breakpoint.mdAndUp
    },
  },
  beforeMount() {
    this.checkIsLogin()
  },
  methods: {
    checkIsLogin() {
      this.$store
        .dispatch('auth/nuxtServerInit', false)
        .then(() => {
          this.loading = false
        })
        .catch(async (error) => {
          this.loading = false
        })
      setTimeout(() => {
        this.loading = false
      }, 600)
    },
    submit() {
      this.loading = true
      this.$reqApi('/sso/accept', {
        token: this.$route.params.token,
      })
        .then(async (response) => {
          // let redirect_link = response.redirect_link.replace('https://chat.aramin.ir','localhost:3200')
          // window.location.href = `${redirect_link}?token=${this.$route.params.token}`
          window.location.href = `${response.redirect_link}?token=${this.$route.params.token}`
        })
        .catch((error) => {
          this.$route.params.token = null
          this.loading = false
        })
    },
  },
}
</script>

<style scoped>
.BackGorundBoxSSo {
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 0px 6px white;
}
</style>
