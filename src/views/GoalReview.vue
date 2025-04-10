<template>
    <div v-if="loading" class="loading">
        <span>加载中...</span>
    </div>
    <div v-else-if="!currentReview" class="loading">
        <span>加载失败,未获取目标信息</span>
    </div>
    <div v-else class="goal-review">
        <!-- Goal Details Analysis -->
        <section class="goal-analysis">
            <h2>{{ goal.title }}</h2>
            <p>{{ goal.startTime }}-{{ goal.endTime }}</p>
            <div class="kr-list">
                    <h4>关键结果</h4>
                    <div v-for="kr in currentReview.keyResultProgress || []" 
                         :key="kr.id" 
                         class="kr-item">
                        <div class="kr-header">
                            <span class="kr-name">{{ kr.name }}</span>
                            <span class="kr-value">{{ kr.currentValue }}/{{ kr.targetValue }}</span>
                        </div>
                        <div class="kr-progress-bar">
                            <div class="progress-fill" 
                                 :style="{ width: `${(kr.currentValue/kr.targetValue) * 100 || 0}%` }">
                            </div>
                        </div>
                    </div>
                </div>
        </section>

        <!-- Task Status -->
        <section class="task-status">
            <h2>任务完成情况</h2>
            
        </section>

        <!-- Self Diagnosis -->
        <section class="self-diagnosis">
            <h2>自我诊断</h2>
            <div class="diagnosis-grid">
                <div class="diagnosis-card">
                    <h3>主要成就</h3>
                    <textarea
                        v-model="currentReview.selfDiagnosis.achievements"
                        placeholder="列出这段时间的主要成就..."
                        rows="4"
                    ></textarea>
                </div>
                <div class="diagnosis-card">
                    <h3>遇到的挑战</h3>
                    <textarea
                        v-model="currentReview.selfDiagnosis.challenges"
                        placeholder="记录遇到的主要挑战..."
                        rows="4"
                    ></textarea>
                </div>
                <div class="diagnosis-card">
                    <h3>经验总结</h3>
                    <textarea
                        v-model="currentReview.selfDiagnosis.learnings"
                        placeholder="总结经验教训..."
                        rows="4"
                    ></textarea>
                </div>
                <div class="diagnosis-card">
                    <h3>下一步计划</h3>
                    <textarea
                        v-model="currentReview.selfDiagnosis.nextSteps"
                        placeholder="制定下一步计划..."
                        rows="4"
                    ></textarea>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, type ComputedRef, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useGoalStore } from '../stores/goalStore';
import { useGoalReviewStore } from '../stores/goalReviewStore';
import { useGoalReview } from '../composables/useGoalReview';
import type { IGoal } from '../types/goal';
import { storeToRefs } from 'pinia';

const loading = ref(true);
const route = useRoute();
const router = useRouter();
const goalStore = useGoalStore();
const goalReviewStore = useGoalReviewStore();

const {  } = useGoalReview();
// 当前目标
const goalId = route.params.goalId as string;

const { tempReview: currentReview } = storeToRefs(goalReviewStore);
const goal = computed(() => {
    const foundGoal = goalStore.getGoalById(goalId);
    if (!foundGoal) {
        router.push('/404'); 
        throw new Error('Goal not found');
    }
    return foundGoal;
}) as ComputedRef<IGoal>;

onMounted(() => {
    if (!goalStore.getGoalById(goalId)) {
        router.push('/404');
        return;
    }
    goalReviewStore.initTempReview(goalId);
    loading.value = false;
});
</script>

<style scoped>
/* Blue theme variables */
:root {
    --primary-blue: #2196f3;
    --light-blue: rgba(33, 150, 243, 0.1);
    --dark-blue: #1976d2;
}

/* Goal Analysis Styles */
.goal-progress-card {
    background: var(--light-blue);
    border-radius: 12px;
    padding: 2rem;
    color: #fff;
}

.progress-circle {
    width: 100px;
    height: 100px;
}

.progress-circle svg {
    transform: rotate(-90deg);
}

.progress-circle text {
    fill: #fff;
    font-size: 8px;
    text-anchor: middle;
}

.kr-progress-bar {
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--primary-blue);
    transition: width 0.3s ease;
}

/* Task Status Styles */
.task-stats-card {
    background: var(--light-blue);
    border-radius: 12px;
    padding: 2rem;
}

.task-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
}

.task-stat-item {
    text-align: center;
}

.task-stat-item.warning .stat-value {
    color: #ff9800;
}

/* Self Diagnosis Styles */
.diagnosis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
}

.diagnosis-card {
    background: var(--light-blue);
    border-radius: 12px;
    padding: 1.5rem;
}

textarea {
    width: 100%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 1rem;
    color: #fff;
    resize: vertical;
}

/* Common Styles */
section {
    margin-bottom: 3rem;
}

h2 {
    color: var(--primary-blue);
    margin-bottom: 1.5rem;
}

h3 {
    color: #fff;
    margin-bottom: 1rem;
}
</style>