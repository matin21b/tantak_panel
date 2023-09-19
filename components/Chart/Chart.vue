<template>
  <div v-if="id">
    <div class="pa-1">
      <v-icon @click="exportImage()" color="success"> photo_camera </v-icon>
      <v-icon @click="exportExcel()" color="success">download_for_offline</v-icon>
    </div>
    <div>
      <canvas :id="id" :height="height"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'
export default {
  props: {
    type: { default: 'bar' },
    height: { default: 300 },
    labels: { require: true },
    datasets: { require: true },
    color: { default: () => [] },
  },
  data: () => ({
    id: '',
    chart: null,
  }),
  beforeMount() {
    let time = this.$moment().format('HH_mm_ss')
    let number = Math.floor(Math.random() * 1000)
    this.id = `${time}${number}`
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.destroy()
    }
  },
  methods: {
    initChart() {
      let color = this.$getColor(this.datasets.length)
      if (this.color.length > 0) {
        color = this.color
      }
      let datasets = [...this.datasets].map((x, i) => {
        if (this.type == 'bar') {
          return {
            ...x,
            backgroundColor: color[i],
          }
        }
        return {
          ...x,
          backgroundColor: this.$getColor(x.data.length),
        }
      })
      const ctx = document.getElementById(this.id).getContext('2d')
      this.chart = new Chart(ctx, {
        type: this.type,
        data: {
          datasets,
          labels: this.labels,
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      })
    },
    exportExcel() {
      let items = []
      for (let i = 0; i < this.labels.length; i++) {
        let item = {}
        item[' '] = this.labels[i]
        for (let j = 0; j < this.datasets.length; j++) {
          const element = this.datasets[j]
          item[element.label] = element.data[i] || 0
        }
        items.push(item)
      }
      this.$exportFile(items, 'گزارش')
    },
    exportImage() {
      let a = document.createElement('a')
      a.href = this.chart.toBase64Image()
      a.download = 'گزارش.png'
      a.click()
    },
  },
}
</script>
