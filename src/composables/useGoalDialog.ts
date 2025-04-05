import { ref } from 'vue'
import type { IGoal } from '../types/type'
import { useGoalStore } from '../stores/goalStore'

export function useGoalDialog() {
  const showGoalDialog = ref(false)
  const editGoalId = ref('temp')
  const editMode = ref<'create' | 'edit'>('create')
  const goalStore = useGoalStore()

  const openCreateDialog = () => {
    editMode.value = 'create'
    editGoalId.value = 'temp'
    showGoalDialog.value = true
  }

  const openEditDialog = (goalId: string) => {
    editMode.value = 'edit'
    editGoalId.value = goalId
    showGoalDialog.value = true
  }

  const closeDialog = () => {
    showGoalDialog.value = false
  }

  const saveGoal = () => {
    const savedGoal = goalStore.addGoal()
    if (savedGoal) {
      closeDialog()
    }
  }

  const updateGoal = (goal: IGoal) => {
    goalStore.updateGoal(goal)
    closeDialog()
  }

  return {
    showGoalDialog,
    editGoalId,
    editMode,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    saveGoal,
    updateGoal
  }
}