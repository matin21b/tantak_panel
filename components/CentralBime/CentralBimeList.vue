<template>
  <div>
    <v-dialog
      fullscreen
      v-if="dialog_item.show"
      v-model="dialog_item.show"
      :scrim="false"
      width="700"
      transition="dialog-bottom-transition"
      @keydown.esc="closeDialog()"
    >
      <v-card>
        <v-card-title class="d-flex justify-center">
          <v-row>
            <v-col cols="12" md="2">
              <v-btn icon @click="closeDialog()">
                <v-icon class="error--text">close</v-icon>
              </v-btn>
            </v-col>
            <v-col cols="12" md="6">
              <span class="font_19 mr-5"> جزئیات بیمه </span>
              <br />
              <span>
                {{ dialog_item.item.insurance_full_name }}
              </span>
            </v-col>
            <v-col cols="12" md="4" class="center-div">
              <v-text-field v-model="serach" label="جستجو ..."></v-text-field>
            </v-col>
          </v-row>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-7">
          <v-row>
            <v-col
              cols="12"
              md="3"
              v-for="(item, index) in main_items"
              :key="index"
              class="contaer_box"
            >
              <span class="black--text">{{ item.name }}</span> :
              <span>{{ item.value }}</span>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <BaseTable
      v-if="showBase"
      url="/history-sales-bime"
      :filters="filters"
      :headers="headers"
      :BTNactions="btn_actions"
    >
    </BaseTable>
  </div>
</template>
<script>
import BaseTable from "~/components/DataTable/BaseTable";
export default {
  components: { BaseTable },
  props: {
    modelId: { default: null },
    showBase: { type: Boolean, default: true },
    infoUser: { default: "" }
  },
  data() {
    return {
      dialog_item: { show: false, item: null },
      loading: false,
      headers: [],
      filters: {},
      serach: "",
      items_body: [],
      main_items: [],
      btn_actions: [],
      title: "سوابق بیمه"
    };
  },
  watch: {
    serach() {
      this.main_items = this.SearchItem(this.items_body, this.serach);
    },
    infoUser() {
      if (this.infoUser) {
        this.dialog_item.item = this.infoUser;
        this.dialog_item.show = true;
      }
    },
    "dialog_item.item"() {
      if (this.dialog_item.item) {
        let info = this.dialog_item.item;
        if (this.infoUser) {
          this.items_body = [
            {
              name: "نام و نام خانوادگی",
              value: info.InsuranceFullName
            },
            {
              name: "وضعیت پاسخ دهی",
              value: this.setStatus(info.StatusTypeCode)
            },
            {
              name: "شرکت بیمه کننده",
              value: this.setCompany(info.CompanyCode)
            },
            {
              name: "کد بیمه نامه شخص ثالث",
              value: info.ThirdPolicyCode
            },
            {
              name: "تاریخ شروع بیمه نامه",
              value: info.IssueDate
            },
            {
              name: " تاریخ شروع بیمه",
              value: info.SatrtDate
            },
            {
              name: " تاریخ پایان بیمه",
              value: info.EndDate
            },
            {
              name: "کد یکتا",
              value: info.ThirdPolicyCode
            },
            {
              name: "نام وسیله نقلیه",
              value: info.SystemField
            },
            {
              name: "تیپ خودرو",
              value: info.TypeField
            },
            {
              name: "کاربری وسیله نقلیه",
              value: info.UsageField
            },
            {
              name: "نام رنگ وسیله نقلیه (اصلی)",
              value: info.MainColorField
            },
            {
              name: "نام رنگ وسیله نقلیه (دوم)",
              value: info.SecondColorField
            },
            {
              name: "سال تولید",
              value: info.ModelField
            },
            {
              name: "ظرفیت وسیله نقلیه",
              value: info.CapacityField
            },
            {
              name: "تعداد سیلندر وسیله نقلی",
              value: info.CylinderNumberField
            },
            {
              name: "شماره موتور",
              value: info.EngineNumberField
            },
            {
              name: "شماره شاسی",
              value: info.ChassisNumberField
            },
            {
              name: "تاریخ نصب پلاک",
              value: info.InstallDateField
            },
            {
              name: "تعداد محور",
              value: info.AxelNumberField
            },
            {
              name: "تعداد چرخ",
              value: info.WheelNumberField
            },
            {
              name: "دو رقم سمت چپ پلاک",
              value: info.Plk1
            },
            {
              name: "حرف وسط پلاک",
              value: this.pickWorld(info.Plk2)
            },
            {
              name: "سه رقم سمت راست",
              value: info.Plk3
            },
            {
              name: "سریال پلاک",
              value: info.PlkSrl
            },
            {
              name: "عنوان نوع وسیله ",
              value: info.MapTypNam
            },
            {
              name: "شماره متور خودرو",
              value: info.MtrNum
            },
            {
              name: "شماره شاسی خودرو",
              value: info.ShsNum
            },
            {
              name: "تعداد سال عدم خسارت مالی",
              value: info.DisFnYrNum
            },
            {
              name: "تعداد سال عدم خسارت جانی",
              value: info.DisFnYrPrcnt
            },
            {
              name: "درصد تخفیف عدم خسارت مالی بیمه نامه",
              value: info.DisFnYrPrcnt
            },
            {
              name: "درصد تخفیف یا افزایش اعمال شده در بیمه نامه",
              value: info.DiscountPersonPercent
            },
            {
              name: "مبلغ تعهد حوادث راننده",
              value: info.PrsnCvrCptl
            },
            {
              name: "مبلغ تعهد جانی به ریال",
              value: info.LfCvrCptl
            },
            {
              name: "مبلغ تعهد مالی به ریال",
              value: info.FinancialCvrCptl
            },
            {
              name: "شماره بیمه نامه قبلی",
              value: info.LastCompanyDocumentNumber
            },
            {
              name: "شماره VIN (در بیمه نامه)",
              value: info.vin
            },
            {
              name: "کد نوع کاربری",
              value: info.UsageCode
            },
            {
              name: "نام کاربری در شرکت بیمه",
              value: info.MapUsageName
            },
            {
              name: "کد کاربری در شرکت بیمه",
              value: info.MapUsageCode
            },
            {
              name: "درصد تخفیف راننده",
              value: info.DiscountPersonPercent
            },
            {
              name: "درصد تخفیف شخص ثالث",
              value: info.DiscountThirdPercent
            },
            {
              name: "نام سیستم وسیله نقلیه (ثبت شده در بیمه مرکزی)",
              value: info.SystemNameCii
            },
            {
              name: "کد سیستم وسیله نقلیه (در شرکت بیمه)",
              value: info.SystemCodeCii
            },
            {
              name: "تیپ خودرو (ثبت شده در بیمه مرکزی)",
              value: info.TypeNameCii
            },
            {
              name: "کد تیپ خودور(در شرکت بیمه)",
              value: info.TypeCodeCii
            },
            {
              name: "کاربری خودور (ثبت شده در بیمه مرکزی)",
              value: info.UsageNameCii
            },
            {
              name: "کد کاربری خودرو (در شرکت بیمه)",
              value: info.UsageCodeCii
            },
            {
              name: "سال ساخت خودرو (ثبت شده در بیمه مرکزی)",
              value: info.ModelCii
            },
            // {
            //   name: "کد سیستم وسیله نقلیه در بیمه مرکزی",
            //   value: ""
            // },
            // {
            //   name: "کد کاربری خودرو در بیمه مرکزی",
            //   value: info.car_group_code
            // },
            {
              name: "کد سیستم خودرو در بیمه مرکزی",
              value: info.VehicleSystemCode
            }
          ];
        } else {
          this.items_body = [
            {
              name: "نام و نام خانوادگی",
              value: info.insurance_full_name
            },
            {
              name: "وضعیت پاسخ دهی",
              value: this.setStatus(info.status_type_code)
            },
            {
              name: "شرکت بیمه کننده",
              value: this.setCompany(info.company_code)
            },
            {
              name: "کد بیمه نامه شخص ثالث",
              value: info.third_policy_code
            },
            {
              name: "تاریخ شروع بیمه نامه",
              value: info.issue_date
            },
            {
              name: " تاریخ شروع بیمه",
              value: info.start_date
            },
            {
              name: " تاریخ پایان بیمه",
              value: info.end_date
            },
            {
              name: "کد یکتا",
              value: info.third_policy_code
            },
            {
              name: "نام وسیله نقلیه",
              value: info.system_field
            },
            {
              name: "تیپ خودرو",
              value: info.type_field
            },
            {
              name: "کاربری وسیله نقلیه",
              value: info.usage_field
            },
            {
              name: "نام رنگ وسیله نقلیه (اصلی)",
              value: info.main_color_field
            },
            {
              name: "نام رنگ وسیله نقلیه (دوم)",
              value: info.second_color_field
            },
            {
              name: "سال تولید",
              value: info.model_field
            },
            {
              name: "ظرفیت وسیله نقلیه",
              value: info.capacity_field
            },
            {
              name: "تعداد سیلندر وسیله نقلی",
              value: info.cylinder_number_field
            },
            {
              name: "شماره موتور",
              value: info.engine_number_field
            },
            {
              name: "شماره شاسی",
              value: info.chassis_number_field
            },
            {
              name: "تاریخ نصب پلاک",
              value: info.install_date_field
            },
            {
              name: "تعداد محور",
              value: info.axel_number_field
            },
            {
              name: "تعداد چرخ",
              value: info.wheel_number_field
            },
            {
              name: "دو رقم سمت چپ پلاک",
              value: info.plack_part_1
            },
            {
              name: "حرف وسط پلاک",
              value: this.pickWorld(info.plack_part_2)
            },
            {
              name: "سه رقم سمت راست",
              value: info.plack_part_3
            },
            {
              name: "سریال پلاک",
              value: info.plack_serial
            },
            {
              name: "عنوان نوع وسیله ",
              value: info.map_type_name
            },
            {
              name: "شماره متور خودرو",
              value: info.mtr_nubmer
            },
            {
              name: "شماره شاسی خودرو",
              value: info.shs_num
            },
            {
              name: "تعداد سال عدم خسارت مالی",
              value: info.dis_fn_year_number
            },
            {
              name: "تعداد سال عدم خسارت جانی",
              value: info.dis_prsn_year_number
            },
            {
              name: "درصد تخفیف عدم خسارت مالی بیمه نامه",
              value: info.dis_prsn_year_percent
            },
            {
              name: "درصد تخفیف یا افزایش اعمال شده در بیمه نامه",
              value: info.dis_prsn_year_percent
            },
            {
              name: "مبلغ تعهد حوادث راننده",
              value: info.person_cvr_cptl
            },
            {
              name: "مبلغ تعهد جانی به ریال",
              value: info.life_cvr_cptl
            },
            {
              name: "مبلغ تعهد مالی به ریال",
              value: info.financial_cvr_cptl
            },
            {
              name: "شماره بیمه نامه قبلی",
              value: info.last_company_document_number
            },
            {
              name: "شماره VIN (در بیمه نامه)",
              value: info.vin
            },
            {
              name: "کد نوع کاربری",
              value: info.usage_code
            },
            {
              name: "نام کاربری در شرکت بیمه",
              value: info.map_usage_name
            },
            {
              name: "کد کاربری در شرکت بیمه",
              value: info.map_usage_code
            },
            {
              name: "درصد تخفیف راننده",
              value: info.discount_person_percent
            },
            {
              name: "درصد تخفیف شخص ثالث",
              value: info.discount_third_percent
            },
            {
              name: "نام سیستم وسیله نقلیه (ثبت شده در بیمه مرکزی)",
              value: info.system_name_cii
            },
            {
              name: "کد سیستم وسیله نقلیه (در شرکت بیمه)",
              value: info.system_code_cii
            },
            {
              name: "تیپ خودرو (ثبت شده در بیمه مرکزی)",
              value: info.type_name_cii
            },
            {
              name: "کد تیپ خودور(در شرکت بیمه)",
              value: info.type_code_cii
            },
            {
              name: "کاربری خودور (ثبت شده در بیمه مرکزی)",
              value: info.usage_name_cii
            },
            {
              name: "کد کاربری خودرو (در شرکت بیمه)",
              value: info.usage_code_cii
            },
            {
              name: "سال ساخت خودرو (ثبت شده در بیمه مرکزی)",
              value: info.model_cii
            },
            // {
            //   name: "کد سیستم وسیله نقلیه در بیمه مرکزی",
            //   value: ""
            // },
            // {
            //   name: "کد کاربری خودرو در بیمه مرکزی",
            //   value: info.car_group_code
            // },
            {
              name: "کد سیستم خودرو در بیمه مرکزی",
              value: info.vehicle_system_code
            }
          ];
        }

        this.main_items = this.items_body;
      }
    }
  },
  beforeMount() {
    this.$store.dispatch("setPageTitle", this.title);
    if (this.modelId) {
      this.filters = {
        id: {
          op: "=",
          value: this.modelId
        }
      };
    }
    this.headers = [
      {
        text: "تاریخ ثبت",
        filterCol: "created_at",
        filterType: "date",
        value: body => {
          if (body.created_at) {
            return this.$toJalali(body.created_at);
          }
          return "";
        }
      },
      {
        text: "نام و نام خانوادگی بیمه گذار",
        value: "insurance_full_name"
      },
      {
        text: "نام شرکت بیمه",
        filterType:'select',
        value: "company_code",
        items:this.$store.state.static.company_name
      },
      {
        filterCol: "start_date",
        filterType: "date",
        text: "تاریخ شروع بیمه نام",
        value: "start_date"
      },
      {
        filterCol: "end_date",
        filterType: "date",
        text: "تاریخ پایان بیمه نام",
        value: "end_date"
      }
    ];
    this.btn_actions = [
      {
        color: "btn_color",
        text: "جزئیات",
        fun: body => {
          this.dialog_item.item = body;
          this.dialog_item.show = true;
        }
      }
    ];
  },
  methods: {
    setStatus(data) {
      switch (data) {
        case 1:
          return "در مرکز بیمه و ناجا";
          break;
        case 2:
          return "در مرکز بیمه";
          break;
        case 3:
          return "در ناجا";
          break;
        case 4:
          return "دیتای یافت نشد";
          break;
        default:
          break;
      }
    },
    pickWorld(int) {
      const pik = this.$store.state.static.pik;
      let select_pik = "";
      pik.forEach(element => {
        if (element.value == int) {
          select_pik = element.text;
        }
      });
      return select_pik;
    },
    setCompany(int) {
      const company = this.$store.state.static.company_name;
      let slect_company = "";
      company.forEach(element => {
        if (element.value == int) {
          slect_company = element.text;
        }
      });
      return slect_company;
    },
    SearchItem(arr, search) {
      return arr.filter(item => item.name.startsWith(search));
    },
    closeDialog() {
      this.dialog_item.show = false;
      this.dialog_item.item = null;
    }
  }
};
</script>
<style scoped>
.contaer_box {
  border: 1px solid gray;
}
.contaer_box:hover {
  background: rgb(209, 209, 209);
}
</style>
