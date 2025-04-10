import { ref, computed } from 'vue';
import { useGoalStore } from '../stores/goalStore';
import { useTaskStore } from '../stores/taskStore';
import { useRoute, useRouter } from 'vue-router';
import { useGoalReviewStore } from '../stores/goalReviewStore';


export interface GoalInsights {
    achievements: string;
    challenges: string;
    learnings: string;
    nextSteps: string;
    createdAt: string;
}

export interface PeriodStats {
    completedGoals: number;
    completionRate: number;
    taskCompletionRate: number;
    totalGoals: number;
    totalTasks: number;
    completedTasks: number;
}

export function useGoalReview() {
    const route = useRoute();
    const router = useRouter();
    const goalStore = useGoalStore();
    const taskStore = useTaskStore();
    const goalReviewStore = useGoalReviewStore();
    

    // 期中复盘相关
    /* 开始期中复盘 */
    const startMidtermReview = (goalId: string) => {
        router.push({
            name: 'GoalReview',
            params: {
                id: route.params.id,
                goalId: goalId
            }
        });
    };
    

    return {
        startMidtermReview,

    };
}