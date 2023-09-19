<template>
    <div class="d-flex align-center my-4 ml-2 mr-4">
        <amp-button text="روز قبل" @click="beforDay()" :loading="loading" />
        <amp-jdate v-model="day_select" />
        <amp-button text="روز بعد" @click="nextDay()" :loading="loading" />
    </div>
</template>

<script>
let jmoment = require('moment')
export default {
    data() {
        return {
            filters: { item: { op: 'LIKE', value: '' } },
            day_select: jmoment().format('YYYY-MM-DD'),
            loading: false,
        }
    },
    watch: {
        day_select() {
                this.loading = true
                this.filters = {
                    created_at: {
                        op: 'between',
                        from: this.day_select + ' 00:00:00',
                        to: this.day_select + ' 23:59:59'
                    }
                }
                setTimeout(() => {
                    this.loading = false
                }, 700);
                this.$emit('WatchDay', this.filters)
            }
    },
    beforeMount() {
        this.loading = false
    },
    methods: {
        nextDay() {
            this.day_select = this.$moment(this.day_select).add(1, 'days')
            this.loading = false
        },
        beforDay() {
            this.day_select = this.$moment(this.day_select).add(-1, 'days')
            this.loading = false
        },
    },
}
</script>