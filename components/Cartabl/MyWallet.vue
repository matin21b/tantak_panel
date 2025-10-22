<template>
  <div>
    <v-col cols="12">
      <v-divider></v-divider>
    </v-col>
    <v-row class="justify-center">
      <v-col cols="12" md="12">
        <div class="pa-5" v-if="!loading">
          <v-card class="elevation-0 card-style">
    
            <v-col cols="12" v-if="wallet_items.length > 0">
              <v-divider v-for="i in 5" :key="i"></v-divider>
            </v-col>
            <v-card-text>
              <v-row>
                <v-col
                  class="pa-8"
                  cols="12"
                  md="4"
                  v-for="(item, index) in wallet_items"
                  :key="index"
                >
                  <v-alert
                    class="ma-1 pa-0 pl-4 elevation-2"
                    border="right"
                    text
                    dense
                    icon="trip_origin"
                    :color="item.type == 'put' ? 'green' : 'blue darken-2'"
                  >
                    <v-card class="elevation-0">
                      <div class="d-flex align-center py-1">
                        <h1 class="font_14">
                          {{ index + 1 }} -
                          {{ item.pay_text }}
                          <br />
                          <small class="grey--text">
                            ثبت شده در:‌
                            {{
                              $toJalali(
                                item.created_at,
                                "YYYY-MM-DD",
                                "jYYYY/jMM/jDD"
                              )
                            }}
                          </small>
                        </h1>
                        <v-spacer></v-spacer>

                        <v-chip
                          dark
                          :color="
                            item.type == 'put' ? 'green' : 'blue darken-2'
                          "
                          class="elevation-4 px-5"
                        >
                          <small>
                            {{
                              $getItemEnum(
                                $store.state.static.wallet_type,
                                item.type
                              )
                            }}
                          </small>
                        </v-chip>
                      </div>

                      <v-card-text class="">
                        <v-divider></v-divider>
                        <v-divider></v-divider>
                        <v-row class="align-center justify-space-between my-1 mt-2">
                          <b class="font_12">
                            تاریخ پرداخت :
                            {{
                              $toJalali(
                                item.paid_date,
                                "YYYY-MM-DD",
                                "jYYYY/jMM/jDD"
                              )
                            }}
                          </b>
                          <b class="font_12">
                            نوع :
                            {{
                              $getItemEnum(
                                $store.state.static.wallet_kind,
                                item.kind
                              )
                            }}
                          </b>
                          <b class="font_12">
                            مقدار :
                            {{ $price(item.amount) }} (ریال)
                          </b>
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-alert>
                </v-col>
              </v-row>

              <v-col cols="12" v-if="total_items.length > 0">
                <v-card
                  @click="actionData"
                  class="align-center pa-3 see-all d-flex"
                >
                  <v-spacer></v-spacer>
                  <h1 v-if="show_all">مشاهده همه</h1>
                  <h1 v-else>بستن</h1>
                  <v-spacer></v-spacer>
                  <v-icon v-if="show_all"> keyboard_arrow_down </v-icon>
                  <v-icon v-else> keyboard_arrow_up </v-icon>
                </v-card>
              </v-col>
            </v-card-text>
          </v-card>
        </div>
        <div v-if="loading" class="text-center my-10">
          <v-progress-circular
            size="40"
            width="5"
            indeterminate
            color="grey darken-2 "
          >
          </v-progress-circular>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  components: {},
  data: () => ({
    wallet_items: [],
    user: {},
    total_items: [],
    show_all: true,
    loading: true,
  }),
  beforeMount() {
    this.getWallet();
  },
  methods: {
    actionData() {
      this.show_all = !this.show_all;
      if (!Boolean(this.show_all)) {
        let items = this.wallet_items;
        for (let index = 0; index < this.total_items.length; index++) {
          const element = this.total_items[index];
          items.push(element);
        }
        let sort_items = items.sort((a, b) => {
          a.created_at - b.created_at;
        });
        this.wallet_items = sort_items;
      } else {
        this.wallet_items = this.wallet_items.filter((f, i) => i < 3);
      }
    },
    getWallet() {
      this.$reqApi("shop/wallet")
        .then((res) => {
          let data = res.model.data;
          let sort_items = data.sort((a, b) => {
            a.created_at - b.created_at;
          });
          if (sort_items.length > 0) {
            this.wallet_items = sort_items.filter((f, i) => i < 3);
            this.total_items = sort_items.filter((f, i) => i >= 3);
          } else {
            this.wallet_items = sort_items;
          }

          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
        });
    },
  },
};
</script>
