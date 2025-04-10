import { defineStore } from 'pinia';
import { useGoalStore } from './goalStore';
import { useTaskStore } from './taskStore';
import { v4 as uuidv4 } from 'uuid';

// 目标进度接口
interface GoalProgress {
    currentProgress: number;      // 当前进度
    analysis: string;            // 进度分析
}

// 关键结果进度接口
interface KeyResultProgress {
    id: string;                 // 关键结果ID
    name: string;               // 关键结果名称
    targetValue: number;        // 目标值
    currentValue: number;       // 当前值
    analysis: string;           // 进度分析
}

// 任务完成情况接口
interface TaskProgress {
    total: number;              // 总任务数
    completed: number;          // 已完成数
    completionRate: number;     // 完成率
    missedTasks: number;        // 未完成任务数
    analysis: string;           // 任务完成情况分析
}

// 自我诊断接口
interface SelfDiagnosis {
    achievements: string;       // 主要成就
    challenges: string;         // 遇到的挑战
    learnings: string;         // 经验总结
    nextSteps: string;         // 下一步计划
}

// 复盘记录接口
export interface Review {
    id: string;
    goalId: string;
    goalProgress: GoalProgress;          // 目标进度
    keyResultProgress: KeyResultProgress[]; // 关键结果进度
    taskProgress: TaskProgress;          // 任务完成情况
    selfDiagnosis: SelfDiagnosis;       // 自我诊断
    createdAt: string;                   // 创建时间
    updatedAt: string;                   // 更新时间
}

export const useGoalReviewStore = defineStore('goalReview', {
    state: () => ({
        reviews: [] as Review[],            // 复盘记录列表
        tempReview: null as Review | null, // 当前复盘记录
    }),

    getters: {
        // 获取指定目标的所有复盘记录
        getReviewsByGoalId: (state) => (goalId: string) => {
            return state.reviews.filter(review => review.goalId === goalId);
        },

        // 获取指定目标的最新复盘记录
        getLatestReview: (state) => (goalId: string) => {
            return state.reviews
                .filter(review => review.goalId === goalId)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        },

        // 根据ID获取复盘记录
        getReviewById: (state) => (reviewId: string) => {
            return state.reviews.find(review => review.id === reviewId);
        }
    },

    actions: {
        // 创建新的复盘记录
        initTempReview(goalId: string): Review {
            const goalStore = useGoalStore();
            const taskStore = useTaskStore();
            const goal = goalStore.getGoalById(goalId);

            if (!goal) {
                throw new Error('Goal not found');
            }

            // 获取目标进度
            const currentProgress = goalStore.getGoalProgress(goalId);

            // 获取关键结果进度
            const keyResultProgress: KeyResultProgress[] = goal.keyResults.map(kr => ({
                id: kr.id,
                name: kr.name,
                targetValue: kr.targetValue,
                currentValue: kr.startValue,
                analysis: ''
            }));

            // 获取任务完成情况
            const taskStats = taskStore.getTaskStatsForGoal(
                goalId,
                goal.startTime,
                goal.endTime
            );

            const newReview: Review = {
                id: uuidv4(),
                goalId,
                goalProgress: {
                    currentProgress,
                    analysis: ''
                },
                keyResultProgress,
                taskProgress: {
                    total: taskStats.total,
                    completed: taskStats.completed,
                    completionRate: taskStats.completionRate,
                    missedTasks: taskStats.missedTasks,
                    analysis: ''
                },
                selfDiagnosis: {
                    achievements: '',
                    challenges: '',
                    learnings: '',
                    nextSteps: ''
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.reviews.push(newReview);
            this.tempReview = newReview;
            return newReview;
        },

        // 更新目标进度
        updateGoalProgress(reviewId: string, progress: Partial<GoalProgress>) {
            const review = this.reviews.find(r => r.id === reviewId);
            if (review) {
                review.goalProgress = {
                    ...review.goalProgress,
                    ...progress
                };
                review.updatedAt = new Date().toISOString();
            }
        },

        // 更新关键结果进度
        updateKeyResultProgress(reviewId: string, krProgress: KeyResultProgress[]) {
            const review = this.reviews.find(r => r.id === reviewId);
            if (review) {
                review.keyResultProgress = krProgress;
                review.updatedAt = new Date().toISOString();
            }
        },

        // 更新任务完成情况
        updateTaskProgress(reviewId: string, progress: Partial<TaskProgress>) {
            const review = this.reviews.find(r => r.id === reviewId);
            if (review) {
                review.taskProgress = {
                    ...review.taskProgress,
                    ...progress
                };
                review.updatedAt = new Date().toISOString();
            }
        },

        // 更新自我诊断
        updateSelfDiagnosis(reviewId: string, diagnosis: Partial<SelfDiagnosis>) {
            const review = this.reviews.find(r => r.id === reviewId);
            if (review) {
                review.selfDiagnosis = {
                    ...review.selfDiagnosis,
                    ...diagnosis
                };
                review.updatedAt = new Date().toISOString();
            }
        },

        // 删除复盘记录
        deleteReview(reviewId: string) {
            const index = this.reviews.findIndex(r => r.id === reviewId);
            if (index !== -1) {
                this.reviews.splice(index, 1);
                if (this.tempReview?.id === reviewId) {
                    this.tempReview = null;
                }
            }
        },
        // 设置当前复盘记录
        setCurrentReview(reviewId: string) {
            const review = this.reviews.find(r => r.id === reviewId);
            this.tempReview = review || null;
        },
    },

    persist: true // 持久化存储
});