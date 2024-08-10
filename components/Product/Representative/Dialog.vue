<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="1000">
      <v-card>
        <v-card-title>
          <h1 class="font_16">تعریف موجودی انبار</h1>
          <v-spacer></v-spacer>
          <v-icon> close </v-icon>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid" @submit.prevent="submit()">
            <SelectVariation @productId="form.product_var_id = $event"  :productInfo="product" :response="response"/>
            <v-row>
              <v-col cols="12" md="3">
                <amp-input
                  text="موجودی"
                  rules="require,number"
                  v-model="form.skock"
                />
              </v-col>
              <v-col cols="12" md="3">
                <amp-input
                  text="موجودی  در انبار"
                  rules="require,number"
                  v-model="form.save_skock"
                />
              </v-col>
              <v-col cols>
                <amp-textarea
                  :rows="1"
                  text="توضیحات"
                  v-model="form.description"
                ></amp-textarea>
              </v-col>
            </v-row>
          </v-form>
          <v-row class="d-flex justify-center">
            <v-col cols="2">
              <amp-button
                block
                height="40"
                text="تایید"
                color="green darken-1"
                @click="submit"
                :disabled="!valid"
              />
            </v-col>        
              <v-col cols="2">
              <amp-button
                block
                height="40"
                text="انصراف"
                color="red darken-1"
                @click="canceld"
                :disabled="!valid"
              />
            </v-col>
          </v-row>

          <BaseTable
            ref="Refresh"
            url="/sale-agency-stock"
            :headers="headers"
            :root-body="root_body"
            autoDelete="sale-agency-stock/delete"
            :actionsList="actions_list"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import SelectVariation from "@/components/Product/Representative/SelectVariation.vue";
export default {
  components: {
    SelectVariation,
  },
  props: {
    branchId: {
      require: false,
      default: false,
    },
    dialog: {
      require: false,
      default: false,
    },
  },
  data() {
    return {
      step: 1,
      actions_list: [],
      response: [],
      headers: [],
      product:{product_id:""},
      root_body: "",
      url: "",
      valid: true,
      continue_Step: true,
      form: {
        skock: "",
        description: "",
        save_skock: "",
        sale_agency_id: "",
        product_var_id: "",
      },
    };
  },
  mounted() {
    this.root_body = { sale_agency_id: this.branchId };
    this.headers = [
      {
        text: "زمان ثبت",
        filterType: "date",
        filterCol: "created_at",
        value: (body) => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        },
      },
      { text: "موجودی ", value: "skock" },
      { text: "موجودی در انبار", value: "save_skock" },
      {
        text: "محصول",
        filtrabel: false,
        value: (body) => {
          let text = "";
          let product_name = "";
          let var_1 = "";
          let var_2 = "";
          let var_3 = "";
          if (body.product_var) {
            product_name = body.product_var.product.name;
          }
          if (body.product_var.variation1) {
            var_1 = body.product_var.variation1.value;
          }
          if (body.product_var.variation2) {
            var_2 = body.product_var.variation2.value;
          }
          if (body.product_var.variation3) {
            var_3 = body.product_var.variation3.value;
          }
          text = `${product_name} / ${var_1} - ${var_2} - ${var_3}`;
          return text;
        },
      },
    ];
    this.actions_list = [
      {
        text: "ویرایش",
        fun: (body) => {
          this.laodData(body.id);
        },
      },
    ];
  },
  methods: {
    closeDialog() {
      this.$emit("closeDialog");
    },
    submit() {
      this.loader = true;
      let form = { ...this.form };
      form.sale_agency_id = this.branchId;
      let url =  this.url 
      this.$reqApi(url, form)
        .then((response) => {
          this.step == 1;
          this.$toast.success("عملیات با موفقیت انجام شده");
          this.loader = false;
          this.$refs.Refresh.getDataFromApi();
        })
        .catch((err) => {
          this.loader = false;
        });
    },
    canceld(){
          this.url = "sale-agency-stock/insert"
    },
    laodData(id) {
      this.$reqApi("sale-agency-stock/show", { id: id })
        .then((response) => {
          let data = response.data;
          this.response = data
          for (let key in data) {
            this.form[key] = data[key];
          }
          this.product.product_id = data.product_var.product_id
          this.product["var1"] = data.product_var.variation1.id
          this.product["var2"] = data.product_var.variation2.id
          this.product["var_text_1"] = data.product_var.variation1.value
          this.product["var_text_2"] = data.product_var.variation2.value
          this.product["var3"] = data.product_var.variation3.id
          this.product["var_text_3"] = data.product_var.variation3.value
          this.url = "sale-agency-stock/update"
        })
        .catch((err) => {
          this.loader = false;
        });
    },
  },
};
</script>
