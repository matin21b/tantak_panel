<template>
  <v-dialog
    v-model="dialog"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <v-card style="overflow: hidden" class="b-color">
      <v-card-title class="primary d-flex justify-center py-5">
        <span class="white--text font_20">
          {{ card_title }}
        </span>
        <v-icon color="white" large class="mr-1"> add_shopping_cart </v-icon>

        <v-spacer></v-spacer>
      
        <v-btn text icon @click="closeDialog">
          <v-icon color="white" class="mr-1"> close </v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <v-row class="d-flex justify-center">
          <v-col cols="8">
            <SelectVariation
              v-if="dialog"
              :basketId="basketId"
              @submit="InsertItem"
              @isLoading="is_loading = $event"
              @getOnlyData="getSelectedItems($event)"
              @createFactor="getItems(true)"
              ref="selectVar"
             
            />
          </v-col>
        </v-row>

        <Factor
          @amaniShopping="setTypeShop($event)"
          v-if="show_factor"
          :dialog="show_factor"
          :is-loading="is_loading"
          :selected-items="factor_items"
          :total-price="totalPrice"
          @closeDialog="show_factor = false"
          @submit="getItems(false)"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import SelectVariation from "@/components/NewCallCenter/InventoryRequest/SelectVariation.vue";
import Factor from "@/components/NewCallCenter/InventoryRequest/Factor.vue";

export default {
  components: { SelectVariation, Factor },
  props: {
    dialog: {
      require: false,
      default: false,
    },
    request: {
      require: false,
      default: false,
    },
    basketId: {
      require: false,
      default: false,
    },
    totalPrice: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      card_title: "",
      amani_shopping: "",
      show_factor: false,
      is_loading: false,
      products: [],
      factor_items: {},
    };
  },
  beforeMount() {
    switch (this.request) {
      case true:
        this.card_title = "درخواست موجودی ";
        break;

      default:
        this.card_title = "ویرایش موجودی";
        break;
    }
  },
  methods: {
    getItems(show_factor) {
      if (Boolean(show_factor)) {
        this.$refs.selectVar.callSubmit(true );
      } else {
        this.$refs.selectVar.callSubmit(false , this.amani_shopping );
      }
    },
    getSelectedItems(event) {
      this.factor_items = event;
      this.show_factor = true;
    },
    InsertItem() {
      this.$emit("reload");
      this.$emit("closeDialog");
    },
    closeDialog() {
      this.$emit("closeDialog");
    },
    setTypeShop(event) {
      this.amani_shopping =  event;
    },
  },
};
</script>
<style scoped></style>
