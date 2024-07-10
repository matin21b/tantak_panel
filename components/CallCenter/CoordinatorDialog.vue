<template>
    <div>
        <v-dialog persistent v-model="coordinatorDialog.show" :model-id="coordinatorDialog.items" width="700">
            <v-card>
                <v-toolbar color="primary" dark>
                    <v-toolbar-title>
                        <span style="font-size: 18px"> ارجاع به هماهنگ کننده</span>
                    </v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon @click="closeDialog">
                        <v-icon> close </v-icon>
                    </v-btn>
                </v-toolbar>
                <div class="pa-6">
                    <v-col cols="12" md="12">
                    <amp-select rules="require" text="انتخاب هماهنگ کننده" :items="coordinator_list"
                        v-model="coordinator_id" />
                    <amp-textarea rules="require" text="توضیحات" v-model="message"></amp-textarea>
                </v-col>
                <v-col cols="12" md="12">

                    <amp-button 
                    text="تایید"
                    block
                    @click="submit"
                    color="orange darken-4" 
                    :disabled="!Boolean(message) || !Boolean(coordinator_id)"
                    />
                </v-col>

                </div>

            </v-card>

        </v-dialog>
    </div>
</template>

<script>
export default {
    props: {
        coordinatorDialog: {
            require: false,
            default: false,
        },        bsaketId: {
            require: false,
            default: false,
        },
    },

    data: () => ({
        valid: true,
        coordinator_id: "",
        message : "",
        valid_comment: true,
        coordinator_list: [],
        loading: false,
    }),
    mounted() {
        this.coordinatorList()
    },
    methods: {
        submit() {
            this.loading = true;
            let form = {  };
            form["id"] = this.bsaketId
            form["message"] = this.message
            form["coordinator_id"] = this.coordinator_id
            form["step"] = "refer_coordinator"
            let url = "basket/referral ";
            this.$reqApi(url, form)
                .then((res) => {
                    this.loading = false;
                    this.closeDialog();
                    this.relod();
                    this.$toast.success("سفارش با موفقیت به هماهنگ کننده ارجاع داده شد")
                })
                .catch((err) => {
                    this.loading = false;
                });
        },
        coordinatorList() {
            this.loading = true;
            let url = "/user/coordinator";
            this.$reqApi(url)
                .then((res) => {
                    if (res.model.data.length > 0) {
                        let items = []
                        for (let index = 0; index < res.model.data.length; index++) {
                            const element = res.model.data[index];
                            items.push({
                                text: element.first_name + " " + element.last_name,
                                value: element.id,
                            })
                        }
                        this.coordinator_list = items
                    }
                    this.loading = false;
                })
                .catch((err) => {
                });
        },

        closeDialog() {
            this.coordinatorDialog.show = false;
            this.coordinatorDialog.items = null;
        },
        relod() {
            this.$emit("relod");
        },
    },
};
</script>
