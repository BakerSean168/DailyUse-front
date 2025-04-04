import { defineStore } from "pinia";
import type { IGoal, IGoalCreate, IKeyResult, IKeyResultCreate } from "../types/type";
import { v4 as uuidv4 } from 'uuid';

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: [
            {
                id: '1',
                title: '用户增长',
                dirId: '3',
                startTime: '2024-03-15T09:00:00',
                endTime: '2024-06-15T09:00:00',
                motive: '用户增长是公司的核心目标，是公司发展的基石。',
                feasibility: '公司已经具备了一定的用户增长能力，但仍需进一步提升。',
                keyResults: [
                    {
                        id: '1',
                        name: 'DAU',
                        startValue: 1000,
                        targetValue: 1500,
                        weight: 8,
                    },
                    {
                        id: '2',
                        name: 'MAU',
                        startValue: 2000,
                        targetValue: 3000,
                        weight: 7,
                    },
                ],
                meta: {
                    createdAt: '2024-03-15T09:00:00',
                    updatedAt: '2024-03-15T09:00:00',
                },
            }
        ] as IGoal[],
        tempGoal: {
            id: 'tempGoal', // 临时目标 ID
            title: '',
            dirId: '',
            startTime: new Date().toISOString().split('T')[0],
            endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            note: '',
            keyResults: [],
            motive: '',
            feasibility: ''
        } as IGoal,
        tempKeyResult: {
            name: '',
            startValue: 0,
            targetValue: 10,
            calculationMethod: 'sum',
            weight: 5,
        } as IKeyResultCreate,
    }),
    getters: {
        getAllGoals(): IGoal[] {
            return this.goals;
        },
        getGoalsByDirId: (state) => (dirId: string) => {
            return state.goals.filter(g => g.dirId === dirId);
        },
        getGoalById: (state) => (id: string) => {
            return state.goals.find(g => g.id === id);
        },
    },
    actions: {
        // 临时目标相关方法（用于新建目标）
        initTempGoal() {
            this.tempGoal = {
                id: 'tempGoal', // 临时目标 ID
                title: '',
                dirId: '',
                startTime: new Date().toISOString().split('T')[0],
                endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                note: '',
                keyResults: [],
                motive: '',
                feasibility: ''
            };
            return this.tempGoal;
        },
        getTempGoal(): IGoal {
            if (!this.tempGoal) {
              this.initTempGoal();
            }
            return this.tempGoal!;
          },
        initTempKeyResult() {
            const defaultKeyResult: IKeyResultCreate = {
                name: '',
                startValue: 0,
                targetValue: 10,
                calculationMethod: 'sum',
                weight: 5,
            };
            this.tempKeyResult = defaultKeyResult;
            return defaultKeyResult;
        },
        updateTempGoal(goal: IGoal) {
            if (!goal) return;
            this.tempGoal = goal;
        },
        updateTempKeyResult(keyResult: IKeyResultCreate) {
            if (!keyResult) return;
            this.tempKeyResult = keyResult;
        },
        // 将编辑好的关键结果添加到临时目标中
        addTempKeyResultToTempGoal(keyResultCreate: IKeyResultCreate) {
            if (!this.tempGoal) return;
            const keyResult: IKeyResult = {
                ...keyResultCreate,
                id: uuidv4(),
            };
            this.tempGoal.keyResults.push(keyResult);
        },


        // 目标相关方法
        addGoal() {
            if (!this.tempGoal) return null;
            const newGoal: IGoal = {
                ...this.tempGoal,
                id: uuidv4(),
                meta: {
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            };
            this.goals.push(newGoal);
            return newGoal;
        },
        updateGoal(goal: IGoal) {
            const index = this.goals.findIndex(g => g.id === goal.id);
            this.goals.splice(index, 1, goal);
        },
        deleteGoal(id: string) {
            const index = this.goals.findIndex(g => g.id === id);
            this.goals.splice(index, 1);
        },

        // 关键结果相关方法
        addKeyResult(goalId: string, keyResultCreate: IKeyResultCreate) {
            const goal = this.goals.find(g => g.id === goalId);
            // 给 keyResultCreate 添加 id
            const keyResult: IKeyResult = {
                id: uuidv4(),
                ...keyResultCreate,
            };
            if (goal) {
                goal.keyResults.push(keyResult);
            }
        },
        deleteKeyResult(goalId: string, keyResultId: string) {
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                const index = goal.keyResults.findIndex(kr => kr.id === keyResultId);
                goal.keyResults.splice(index, 1);
            }
        },
        getKeyResultById(goalId: string, keyResultId: string) {
            // 在临时目标中查找关键结果
            if (goalId === 'temp') {
                return this.tempGoal.keyResults.find(kr => kr.id === keyResultId);
            }
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                return goal.keyResults.find(kr => kr.id === keyResultId);
            }
            return null;
        },
        updateKeyResult(goalId: string, keyResultId: string, keyResultCreate: IKeyResultCreate) {
            if (goalId === 'tempGoal') { // 如果在新建目标，则更新临时目标的关键结果
                const index = this.tempGoal.keyResults.findIndex(kr => kr.id === keyResultId);
                if (index !== -1) {
                    this.tempGoal.keyResults[index] = {
                        ...keyResultCreate,
                        id: keyResultId
                    };
                }
            } else {    // 如果在已有目标中，则更新已有目标的关键结果
                const goal = this.goals.find(g => g.id === goalId);
                if (goal) {
                    const index = goal.keyResults.findIndex(kr => kr.id === keyResultId);
                    if (index !== -1) {
                        goal.keyResults[index] = {
                            ...keyResultCreate,
                            id: keyResultId
                        };
                    }
                }
            }
        }
    },
    persist: true,
});