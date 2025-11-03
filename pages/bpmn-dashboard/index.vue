<template>
  <div>
    <v-row class="d-flex justify-center">
      <v-col cols="12" md="12" class="mt-2">
        <!-- Header with Start Process Button -->
        <v-row class="justify-space-between align-center ml-2">
          <v-col cols="12" md="12" class="text-left">
            <amp-button
              text="شروع فرآیند جدید"
              color="primary"
              icon="play_arrow"
              @click="openProcessList"
            />
          </v-col>
        </v-row>

        <!-- Tasks Table -->
        <BaseTable
          :headers="taskHeaders"
          bpmn-url="/tasks"
          localData
          :loading="loadingTasks"
          :BTNactions="taskActions"
          :filters="taskFilters"
          @getData="getTasksData"
          ref="tasksTable"
        />

        <!-- Process List Dialog -->
        <v-dialog v-model="processListDialog" persistent max-width="800px">
          <v-card>
            <v-card-title class="primary white--text">
              <span class="headline">لیست فرآیندها</span>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="processSearch"
                append-icon="search"
                label="جستجو در فرآیندها"
                single-line
                hide-details
                class="shrink"
              ></v-text-field>
            </v-card-title>
            <v-card-text class="pa-0">
              <ProcessList 
                :processes="filteredProcesses"
                :loading="loadingProcesses"
                @start-process="startProcess"
                @close-dialog="processListDialog = false"
              />
            </v-card-text>
          </v-card>
        </v-dialog>

        <!-- Task Action Dialog -->
        <v-dialog v-model="taskActionDialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="headline">انجام وظیفه: {{ selectedTask?.name }}</span>
            </v-card-title>
            <v-card-text>
              <v-form v-model="taskFormValid" ref="taskForm">
                <v-container>
                  <v-row>
                    <v-col cols="12" v-for="(variable, index) in taskVariables" :key="index">
                      <amp-input
                        :text="variable.label || variable.name"
                        :rules="variable.required ? 'require' : ''"
                        v-model="taskFormData[variable.name]"
                        :type="variable.config.type"
                      />
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <amp-button
                text="انصراف"
                color="red"
                @click="taskActionDialog = false"
              />
              <amp-button
                text="تایید و ارسال"
                color="primary"
                :loading="processingTask"
                :disabled="!taskFormValid || processingTask"
                @click="confirmTaskAction"
              />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import ProcessList from '~/components/BPMN/ProcessList.vue'

export default {
  components: {
    ProcessList
  },
  data() {
    return {
      loadingTasks: false,
      loadingProcesses: false,
      processingTask: false,
      tasks: [],
      processes: [],
      selectedProcess: null,
      selectedTask: null,
      processListDialog: false,
      taskActionDialog: false,
      taskFormValid: false,
      taskVariables: [],
      taskFormData: {},
      processSearch: '',
      
      taskHeaders: [
        {
          text: "نام وظیفه",
          value: "element_name",
          sortable: true
        },
        {
          text: "فرآیند",
          value: (body) => {
            if (body.process) {
              return body.process.name;
            }
            return "";
          }
        },
        {
          text: "تاریخ ایجاد",
          value: "created_at",
          sortable: true,
          filterType: "date",
          value: (body) => body.created_at ? this.$toJalali(body.created_at) : ""
        }
      ],
      
      taskActions: [
        {
          color: "primary",
          icon: "play_arrow",
          text: "انجام وظیفه",
          fun: (task) => this.completeTask(task),
          show_fun: (task) => {
            return task.status === 'ACTIVE'
          }
        },
        {
          color: "info",
          icon: "info",
          text: "جزئیات",
          fun: "details",
          fun: (task) => this.showTaskDetails(task),
        }
      ],
      
      taskFilters: {
        status: {
          op: "in",
          value: ["in_progress", "pending"]
        }
      }
    }
  },
  
  computed: {
    filteredProcesses() {
      if (!this.processSearch) return this.processes
      
      const search = this.processSearch.toLowerCase()
      return this.processes.filter(process => 
        process.name?.toLowerCase().includes(search) ||
        process.description?.toLowerCase().includes(search) ||
        process.key?.toLowerCase().includes(search)
      )
    }
  },
  
  async mounted() {
    this.$store.dispatch('setPageTitle', 'داشبورد BPMN')
    this.$refs.tasksTable.getDataFromApi()
  },
  
  methods: {
    async loadProcesses() {
      this.loadingProcesses = true
      try {
        // Get available processes
        const response = await this.$reqBpmn('/processes', 'get', {
          perPage: 100,
          status: 'active'
        })
        
        this.processes = response.data || response
      } catch (error) {
        this.$toast.error('خطا در بارگذاری لیست فرآیندها')
        console.error('Error loading processes:', error)
      } finally {
        this.loadingProcesses = false
      }
    },

    async openProcessList() {
      this.processListDialog = true
      this.processSearch = ''
      if (this.processes.length === 0) {
        await this.loadProcesses()
      }
    },

    async startProcess(process) {
      this.selectedProcess = process
      this.processListDialog = false
      let start_events = process.start_events

      try {
        // Start the process - ProcessMaker typically starts with default variables
        const startResponse = await this.$reqBpmn(
          `/process_events/${process.id}?event=${start_events[0].id}`, 
          'post', 
          {}
        )
        
        this.$toast.success(`فرآیند "${process.name}" با موفقیت شروع شد`)
        
        // Reload tasks to see if new task is assigned
        await this.loadTasks()
        
      } catch (error) {
        this.$toast.error('خطا در شروع فرآیند')
        console.error('Error starting process:', error)
      }
    },

    async handleTaskAction(action, task) {
      if (action.fun === 'complete') {
        await this.completeTask(task)
      } else if (action.fun === 'details') {
        this.showTaskDetails(task)
      }
    },

    async completeTask(task) {
      this.selectedTask = task
      
      try {
        // Get task variables and form
        const taskData = await this.$reqBpmn(`/tasks/${task.id}?include=screen,data`, 'get')
        this.taskVariables = taskData.screen.config[0].items || []

        // Initialize form data
        this.taskFormData = {}
        this.taskVariables.forEach(variable => {
          this.taskFormData[variable.name] = taskData.data[variable.name] || ''
        })
        
        this.taskActionDialog = true
      } catch (error) {
        this.$toast.error('خطا در دریافت اطلاعات وظیفه')
        console.error('Error getting task details:', error)
      }
    },

    async confirmTaskAction() {
      this.processingTask = true
      try {
        // Complete the task with form data
        await this.$reqBpmn(
          `/tasks/${this.selectedTask.id}/complete`, 
          'post', 
          this.taskFormData
        )
        
        this.$toast.success('وظیفه با موفقیت انجام شد')
        this.taskActionDialog = false
        
        // Reload tasks
        await this.loadTasks()
        
      } catch (error) {
        this.$toast.error('خطا در انجام وظیفه')
        console.error('Error completing task:', error)
      } finally {
        this.processingTask = false
      }
    },

    showTaskDetails(task) {
      console.log('task',task)
      this.$toast.info(`جزئیات وظیفه: ${task.element_name}`)
    },

    getInputType(variableType) {
      const typeMap = {
        'string': 'text',
        'integer': 'number',
        'float': 'number',
        'boolean': 'checkbox',
        'date': 'date',
        'datetime': 'datetime-local',
        'text': 'textarea'
      }
      return typeMap[variableType] || 'text'
    },

    getTasksData(event) {
      // Handle table data if needed
      if (event && event.model && event.model.data) {
        this.tasks = event.model.data
      }
    }
  }
}
</script>

<style scoped>
.class-bg {
  background: linear-gradient(to left, #384e58e7, #607d8baf, #8597a1cc);
}
</style>
