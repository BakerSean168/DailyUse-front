<template>
  <div id="summary">
    <header>
      <h1>摘要</h1>
      <div class="summary-header-info">
        <div class="summary-header-today-layout">
          <div class="summary-header-today-icon-layout">
            <Icon icon="bi:list-task" width="20" height="20" style="color: #db6b6b" />
            <span>1</span>
          </div>
          <span>今日任务</span>
        </div>
        <div class="summary-header-today-layout">
          <div class="summary-header-today-icon-layout">
            <Icon icon="bi:check2-circle" width="20" height="20" style="color: #db6b6b" />
            <span>1</span>
          </div>
          <span>进行中目标</span>
        </div>
        <div class="summary-header-today-layout">
          <div class="summary-header-today-icon-layout">
            <Icon icon="bi:check2-circle" width="20" height="20" style="color: #db6b6b" />
            <span>1</span>
          </div>
          <span>今日添加记录</span>
        </div>
      </div>
    </header>
    <main>
      <div class="goals-container">
        <GoalInfoShowCard v-for="goal in goals" :key="goal.id" :goal="goal" />
      </div>
    </main>

  </div>
</template>
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
import { useGoalStore } from '../stores/goalStore';
import GoalInfoShowCard from '../components/GoalInfoShowCard.vue';
import { Icon } from '@iconify/vue';
const goalStore = useGoalStore();
const goals = computed(() => {
  console.log('goals', goalStore.getAllGoals);
  return goalStore.getAllGoals;
});
</script>
<style scoped>
#summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  height: 100%;
  width: 100%;
}

header {}

.summary-header-info {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem;
  background-color: #2b2b2b;
  border-radius: 12px;
}
/* header最上方样式 */
.summary-header-today-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  width: auto;
  font-size: 0.8rem;

}
.summary-header-today-icon-layout {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 1;

  width: 100%;
  font-size: 1.5rem;
  gap: 0.25rem;
  color: #db6b6b;
}
/* 颜色变化 */
.summary-header-today-task {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  width: auto;
  font-size: 0.8rem;

}
.summary-header-today-task-icon {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex: 1;

  width: 100%;
  font-size: 1.5rem;
  gap: 0.25rem;
  color: #db6b6b;
}
</style>