<template>
  <div :class="parenClass">
    <span
      v-html="value"
      test-tag="string_type"
      v-if="header.type == 'string'"
      :class="['font_l', header.fun_class(body)]"
    >
    </span>
    <span v-if="header.type == 'phone'">
      <span
        v-html="value"
        test-tag="string_type"
        v-if="header.type == 'phone'"
        :class="['font_l', header.fun_class(body)]"
      >
      </span>
      <v-icon class="font_16" color="green" @click="header.function(body)">
        call
      </v-icon>
    </span>
    <v-tooltip top v-if="header.type == 'tooltip'">
      <template v-slot:activator="{ on, attrs }">
        <span v-bind="attrs" v-on="on" v-html="value"></span>
      </template>
      <span v-html="header.function(body)"></span>
    </v-tooltip>

    <span
      v-html="value"
      test-tag="string_type"
      v-if="header.type == 'price'"
      :class="['font_l', header.fun_class(body)]"
    >
    </span>
    <span v-if="header.type == 'icon'">
      <v-icon
        v-html="header.iconCustomer(body)"
        :color="header.color(body)"
        @click="header.function(body)"
        :disabled="header.disabled(body)"
      >
      </v-icon>
      <v-chip v-if="value" outlined v-html="value"></v-chip>
    </span>
    <span
      style="cursor: pointer"
      v-if="header.type == 'link'"
      @click="header.function(body)"
    >
      <v-chip
        style="cursor: pointer"
        outlined
        :color="header.color(body)"
        :disabled="header.disabled(body)"
        v-html="value"
      ></v-chip>
    </span>

    <v-avatar v-if="header.type == 'image'">
      <img
        test-tag="image_type"
        style="object-fit: cover"
        :src="$getImage(value, false, true)"
      />
    </v-avatar>

    <v-chip
      outlined
      v-if="header.type == 'chip'"
      :color="header.getColor(body)"
    >
      {{ value }}
    </v-chip>
    <div class="text-center" v-if="header.type == 'boolean'">
      <v-icon :color="value ? 'success' : 'error'">
        {{ value ? "task_alt" : "highlight_off" }}
      </v-icon>
    </div>
    <div v-if="header.type == 'buttom'" :class="header.class(body)">
      <amp-button
        block
        test-tag="buttom_type"
        :color="header.color(body)"
        @click="header.action(body)"
        :text="header.show_text(body)"
      />
    </div>
    <div class="text-center" v-if="header.type == 'buttom_icons'">
      <v-icon
        v-for="(item, i) in header.items"
        :key="i"
        :color="item.color(body)"
        :class="item.class(body)"
        @click="item.action(body)"
      >
        {{ item.icon(body) }}
      </v-icon>
    </div>
    <div class="text-center" v-if="header.type == 'switch'">
      <v-switch readonly v-model="value" inset test-tag="ti_switch" />
    </div>
    <div v-if="header.type == 'input'">
      <v-form v-model="valid" class="d-flex justify-center align-center">
        <div v-for="(item, index) in header.text_item">
          <amp-input
            :key="index"
            :text="item.title"
            :rules="item.rules"
            v-model="form_input[item.index][item.key]"
          />
        </div>

        <v-btn
          small
          :disabled="!valid || loading"
          :loading="loading"
          :class="header.btn_info.color"
          @click="bntInput(header)"
        >
          {{ header.btn_info.title }}
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: Object,
      required: true,
    },
    body: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      valid: false,
      loading: false,
      form_input: [],
    };
  },
  beforeMount() {
    this.setHeaderInputFormItem(this.header);
  },
  computed: {
    value() {
      if (this.header.filterType == "select") {
        let item = this.header.items.find(
          (x) => x.value == this.body[this.header.value]
        );
        if (item) {
          return item.text;
        }
      }
      if (typeof this.header.value == "function") {
        if (this.header.type == "price") {
          return `<div class="ltr-item">${this.$price(
            this.header.value(this.body) || "--"
          )}</div>`;
        }
        return this.header.value(this.body);
      }
      if (this.header.type == "price") {
        return `<div class="ltr-item">${
          this.$price(this.body[this.header.value]) || "--"
        }</div>`;
      }
      return this.body[this.header.value];
    },
    parenClass() {
      if (this.header.filterType == "date") {
        return "ltr-item";
      }
      return "";
    },
    itemId() {
      return this.body["id"];
    },
  },
  methods: {
    openNewTab(value) {
      window.open(value);
    },
    setHeaderInputFormItem(item) {
      if (item) {
        if (item.type == "input") {
          let obj = {};
          item.text_item.map((x) => {
            obj[x.key] = this.body[x.key];
          });
          this.form_input.push(obj);
        }
      }
    },
    bntInput(info) {
      this.loading = true;
      let form = {
        branch_id: this.body.branch_id,
        varcomb_id: this.body.product_variation_combination.id,
        id: this.body.id,
        stock: this.form_input[0].stock,
        saved_stock: this.form_input[0].saved_stock,
      };
      this.$reqApi(info.btn_info.url, form)
        .then((res) => {
          this.$emit("refreshTable");
          this.loading = false;
          return res;
        })
        .catch((err) => {
          this.loading = false;
          return err;
        });
    },
  },
};
</script>
