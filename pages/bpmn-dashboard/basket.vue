<template>
  <div class="bpmn-dashboard-test">
    <BpmnBaseTable 
      report_slug="sbd-hay-khryd" 
      :only_me="false"
      @action="action"
    />

    <TaskActionDialog
      v-model="taskActionDialog"
      :task="selectedTask"
      @cancel="onTaskDialogCancel"
      @completed="handleTaskCompleted"
    />

    <TaskHistoryDialog v-model="historyDialog" :task="selectedTask" :process_request_id="processRequestId" />
  </div>
</template>

<script>
import BpmnBaseTable from "~/components/BPMN/BpmnBaseTable.vue";
import TaskActionDialog from "~/components/BPMN/TaskActionDialog.vue";
import TaskHistoryDialog from "~/components/BPMN/TaskHistoryDialog.vue";

export default {
  data: () => ({
    selectedTask: null,
    historyDialog: false,
    processRequestId: null,
    taskActionDialog: false,
  }),
  components: {
    BpmnBaseTable,
    TaskActionDialog,
    TaskHistoryDialog,
  },
  methods: {
    action(event){
      if(event.action == "history"){
        this.historyDialog = true
        this.processRequestId = event.row.id
        this.selectedTask = event.row.active_tasks[0]
      }else if(event.action == "do"){
        this.taskActionDialog = true
        this.selectedTask = event.row.active_tasks[0]
      }
    },
    onTaskDialogCancel() {
      this.taskActionDialog = false
      this.selectedTask = null
    },
    handleTaskCompleted() {
      this.taskActionDialog = false
      this.selectedTask = null
    }
  }
};
</script>

<style scoped>
.bpmn-dashboard-test {
  padding: 16px;
}
</style>
