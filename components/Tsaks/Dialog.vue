<template>
  <div>
    <v-dialog
      persistent
      v-model="dialogTask.show"
      :model-id="dialogTask.items"
      width="750"
    >
      <v-card class="card-dialog">
        <v-col cols="12" class="pa-3 mt-4 mr-2">
          <v-row>
            <h1 class="font_11 mr-3">
              عنوان :‌
              {{ task.title }}
              <br />
              <h1 class="font_10">دسته بندی : {{ task.category }}</h1>
            </h1>

            <v-spacer></v-spacer>
            <v-btn text @click="closeDialog">
              <v-icon>close</v-icon>
            </v-btn>
          </v-row>
        </v-col>

        <v-col cols="12">
          <v-divider></v-divider>
        </v-col>
        <v-card-text v-if="!loading_data">
          <!-- <v-row class="align-center py-4 mr-1">
              <h1 class="font_12 mx-1">گیرنده :</h1>
              <h1 class="font_12 mx-1">
                {{ geter }}
              </h1>
            </v-row> -->
          <h1 class="font_14 mt-2">
            <v-icon small>arrow_left</v-icon>
            بازه زمانی
          </h1>
          <v-col cols="12">
            <v-row class="align-center">
              <v-row
                v-if="Boolean(task.start_task) && Boolean(task.end_task)"
                class="mr-2"
              >
                <small> شروع از تاریخ </small>
                <h1 class="font_10 mx-1" v-if="task.start_task">
                  {{
                    $toJalali(task.start_task, "YYYY-MM-DD", "jYYYY/jMM/jDD")
                  }}
                </h1>
                <small> تا </small>

                <h1 class="font_10 mx-1" v-if="task.end_task">
                  {{ $toJalali(task.end_task, "YYYY-MM-DD", "jYYYY/jMM/jDD") }}
                </h1>
              </v-row>
              <small v-else> بازه زمانی مشخص نشده </small>

              <v-spacer></v-spacer>
              <small class="font_10">
                ایجاد شده توسط :
                {{ creator }}
                در
                {{ $toJalali(task.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD") }}
              </small>
            </v-row>
          </v-col>
          <v-col
            v-if="is_creator && Boolean(check_see)"
            class="mt-4 mr-0 pr-0"
            cols="12"
          >
            <h1 class="font_14">
              <v-icon small>arrow_left</v-icon>
              آمار بازدید:
            </h1>
            <h1
              class="font_10 mr-2"
              v-if="Boolean(check_see)"
              v-for="(name, index) in check_see"
              :key="index"
            >
              <v-icon small>done_all</v-icon>
              {{ name }}
            </h1>
          </v-col>
          <v-col
            v-if="is_creator && !Boolean(check_see)"
            class="mt-4 mr-0 pr-0"
            cols="12"
          >
            <v-row class="text-center mt-4">
              <h1 class="font_14">
                <v-icon small>arrow_left</v-icon>
                آمار بازدید:
              </h1>
              <h1 class="font_10 mr-2">
                بازدیدی وجود ندارد
                <v-icon small>visibility_off</v-icon>
              </h1>
            </v-row>
          </v-col>
          <v-row v-if="task.file" class="align-center mt-4">
            <h1 class="font_14">
              <v-icon small>arrow_left</v-icon>
              فایل بار گذاری شده
            </h1>
            <v-spacer></v-spacer>
            <v-col cols="12" md="4" class="text-center">
              <v-btn height="30" outlined block @click="getFile(task.file)">
                مشاهده فایل
                <v-icon>attach_file</v-icon>
              </v-btn>
            </v-col>
          </v-row>

          <h1 class="font_14 mt-4" v-if="Boolean(task.link)">
            <v-icon small>arrow_left</v-icon>
            لینک
          </h1>
          <v-col cols="5">
            <h1
              class="link"
              v-if="Boolean(task.link)"
              @click="openLink(task.link)"
            >
              {{ task.link }}
            </h1>
          </v-col>

          <h1 class="font_14 mt-4">
            <v-icon small>arrow_left</v-icon>
            توضیحات :
          </h1>
          <small>
            {{ task.text }}
          </small>

          <h1 class="font_14 mt-4">
            <v-icon small>arrow_left</v-icon>

            مکان :
          </h1>
          <small>
            {{ task.place }}
          </small>

          <v-col
            class="mt-4 pt-4"
            cols="12"
            v-if="!is_creator && (status == 'wait' || status == 'see')"
          >
            <v-row class="align-center mt-2">
              <h1 class="font_16 ml-3 mr-7">تعیین وضعیت</h1>
              <v-badge class="mt-2" :color="set_color" v-if="!loading" dot />
              <v-progress-circular
                v-else
                :size="16"
                :width="4"
                indeterminate
                :color="set_color"
              />
              <v-col cols="12">
                <amp-select
                  :disabled="Boolean(loading)"
                  v-model="task_status"
                  :items="items"
                />
              </v-col>

              <v-col cols="1"> </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            class="text-center"
            v-if="is_creator && log_change_status.length != 0"
          >
            <v-row class="align-center py-3">
              <v-divider></v-divider>

              <h1 class="mx-2">
                تاریخچه تغییر وضعیت
                <v-icon small>history</v-icon>
              </h1>
              <v-divider></v-divider>
            </v-row>
          </v-col>
          <div v-if="is_creator && log_change_status.length != 0">
            <v-col cols="12" class="mr-3">
              <v-row class="align-center pa-3">
                <h1 class="font_10">تاریخ ثبت</h1>
                <v-spacer></v-spacer>
                <h1 class="font_10">کاربر</h1>
                <v-spacer></v-spacer>
                <h1 class="font_10">وضعیت تعیین شده</h1>
                <v-spacer></v-spacer>
                <span></span>
              </v-row>
              <v-divider></v-divider>
              <v-divider></v-divider>
            </v-col>
            <div v-for="(item, index) in log_change_status" :key="index">
              <v-col cols="12 ">
                <v-row
                  class="align-center pa-3"
                  :class="index % 2 == 0 ? 'grey lighten-3' : ''"
                >
                  <h1 class="font_10">
                    {{
                      $toJalali(item.created_at, "YYYY-MM-DD", "jYYYY/jMM/jDD")
                    }}
                  </h1>
                  <v-spacer></v-spacer>
                  <h1 class="font_10">
                    {{ item.user }}
                  </h1>
                  <v-spacer></v-spacer>
                  <h1 class="font_10">
                    {{ item.status }}
                  </h1>
                  <v-spacer></v-spacer>
                  <v-badge
                    dot
                    :color="item.done == true ? 'green' : 'red'"
                    class="ml-2"
                  />
                </v-row>
              </v-col>
            </div>
          </div>
        </v-card-text>
        <div v-else calss="text-center my-15">
          <v-row class="d-felx justify-center py-15 my-15 align-center">
            <v-progress-circular
              :size="70"
              :width="7"
              indeterminate
              color="grey"
            />
          </v-row>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogTask: {
      require: false,
      default: false,
    },
    task: {
      require: false,
      default: false,
    },
  },

  data: () => ({
    valid: true,
    valid_comment: true,
    items: [
      { text: "انجام شده", value: "done" },
      { text: "رد شده", value: "reject" },
    ],
    creator: "",
    geter: "",
    color: "",
    task_status: "",
    status: "",
    users_see: [],
    log_change_status: [],
    loading: false,
    loading_data: true,
    is_creator: false,
  }),
  mounted() {
    this.loadGeter();
    this.loadData();
    if (this.task.user_creator) {
      if (
        this.task.user_creator.first_name &&
        this.task.user_creator.last_name
      ) {
        this.creator =
          this.task.user_creator.first_name +
          " " +
          this.task.user_creator.last_name;
      } else {
        this.task.user_creator.username;
      }
    }
    if (this.$store.state.auth.user.id == this.task.user_creator.id) {
      this.is_creator = true;
    }
  },
  watch: {
    task_status() {
      this.changeStatus();
    },
  },
  computed: {
    check_see() {
      if (this.users_see.length != 0) {
        let users = [];
        this.users_see.map((x) => {
          let name = "";
          if (x.first_name && x.last_name) {
            name = x.first_name + " " + x.last_name;
          } else {
            name = x.username;
          }
          users.push(name);
        });
        return users;
      } else {
        return false;
      }
    },
    set_color() {
      if (this.task_status == "done") {
        return "success";
      }
      if (this.task_status == "reject") {
        return "error";
      }
      if (!Boolean(this.task_status)) {
        return "grey";
      }
    },
  },
  methods: {
    closeDialog() {
      this.dialogTask.show = false;
      this.dialogTask.items = null;
    },
    loadGeter() {
      if (this.task.roles && this.task.roles.length > 0) {
        this.geter = this.task.roles.map((x) => x.name).join(" , ");
      } else if (this.task.user_get && Boolean(this.task.user_get)) {
        if (this.task.user_get.first_name) {
          this.geter =
            this.task.user_get.first_name + " " + this.task.user_get.last_name;
        } else {
          this.geter = this.task.user_get.username;
        }
      }
    },
    getFile(link) {
      window.open(this.$getImage(link));
    },
    openLink(link) {
      window.open(link);
    },
    changeStatus() {
      this.loading = true;
      let form = {};
      form["id"] = this.task.id;
      form["status"] = this.task_status;
      this.$reqApi("task/change-status", form)
        .then((res) => {
          this.$toast.success("وضعیت با موفقیت تغییر کرد");
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;

          return err;
        });
    },
    loadData() {
      this.$reqApi("task/show", { id: this.task.id })
        .then((res) => {
          let items = [];
          this.users_see = res.data.sees;
          this.status = res.data.status;
          res.data.log_change_status.forEach((x) => {
            let user = "";
            if (x.user) {
              if (x.user.first_name && x.user.last_name) {
                user = x.user.first_name + " " + x.user.last_name;
              } else {
                user = x.user.username;
              }
            }
            let status = this.$getItemEnum(this.items, x.status);

            items.push({
              user: user,
              created_at: x.created_at,
              status: status,
              done: x.status == "done" ? true : false,
            });
          });
          items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
          items.reverse();
          this.log_change_status = items;
          this.loading_data = false;
        })
        .catch((err) => {
          this.loading_data = false;

          return err;
        });
    },
  },
};
</script>

<style scoped>
.card-dialog {
  overflow-x: hidden !important;
  overflow-y: hidden !important;
}
.link {
  cursor: pointer !important;
  color: #2626b8d7;
  font-size: 14px;
  text-decoration: underline;
}
.link:hover {
  cursor: pointer !important;
  color: #3434c7bd;
}
</style>
