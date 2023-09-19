<template>
  <v-container>
      <v-row>
          <v-col cols='12' md='12' class="center-div" >
              <v-btn class="primary" @click='show = !show' >ایکون</v-btn>
          </v-col>
          <v-card class="container_icon primary elevation-7 " max-width="300" min-width="100" max-height="600" v-if='show' >
              <v-row class="pa-3" >
                  <v-col class="box_icon center-div" cols='12' md='3' v-for="(item,index) in test_data " :key='index' > <v-btn icon @click='setIcon(item.value)' > <v-icon class='white--text' > {{item.text}} </v-icon> </v-btn> </v-col>
              </v-row>
               <v-card-subtitle>
                  <v-btn icon @click="show = false" class="error--text" > <v-icon>close</v-icon> </v-btn>
              </v-card-subtitle>
          </v-card>
      </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      show: false,
      selected:'',
      test_data:[
          {
              text:'home',
              value:'home'
          },
          {
              text:'work',
              value:'work'
          },
          {
              text:'person',
              value:'person'
          },
          {
              text:'phone',
              value:'phone'
          },
           {
              text:'home',
              value:'home'
          },
          {
              text:'work',
              value:'work'
          },
          {
              text:'person',
              value:'person'
          },
          {
              text:'phone',
              value:'phone'
          },
           {
              text:'home',
              value:'home'
          },
          {
              text:'work',
              value:'work'
          },
          {
              text:'person',
              value:'person'
          },
          {
              text:'phone',
              value:'phone'
          },
      ]
    };
  },
  methods:{
      setIcon(item){
          this.selected= item
          console.log(this.selected)
          this.show = !this.show
      }
  }
};
</script>
<style scoped >
    .container_icon{
        backdrop-filter:blur(10px);
        z-index: 400;
        position: absolute;
        top: 20vh;
    }
    .box_icon:hover{
        transform: scale(1.2)
    }
</style>
