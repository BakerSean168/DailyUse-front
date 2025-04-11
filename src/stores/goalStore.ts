import { defineStore } from "pinia";
import type { IGoal, IKeyResult, IKeyResultCreate } from "../types/goal";
import { v4 as uuidv4 } from 'uuid';

export const useGoalStore = defineStore('goal', {
    state: () => ({
        goals: [
            {
                id: '1',
                title: '用户增长',
                color: '#FF5733',
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
            color: '#FF5733',
            dirId: '',
            startTime: new Date().toISOString().split('T')[0],
            endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            note: '',
            keyResults: [],
            motive: '',
            feasibility: ''
        } as IGoal,
        tempKeyResult: {
            id: 'temp', // 临时关键结果 ID
            name: '',
            startValue: 0,
            targetValue: 10,
            calculationMethod: 'sum',
            weight: 5,
        } as IKeyResult,
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
        // 获取目标进度
        getGoalProgress: (state) => (goalId: string) => {
            const goal = state.goals.find(g => g.id === goalId);
            if (!goal) return 0;
            const totalWeight = goal.keyResults.reduce((acc, kr) => acc + kr.weight, 0);
            const totalProgress = goal.keyResults.reduce((acc, kr) => 
                acc + (kr.startValue / kr.targetValue) * kr.weight, 0);
            return Number(((totalProgress / totalWeight) * 100).toFixed(1));
        },
        getKeyResultProgress: (state) => (goalId: string, keyResultId: string) => {
            const goal = state.goals.find(g => g.id === goalId);
            if (!goal) return null;
            const keyResult = goal.keyResults.find(kr => kr.id === keyResultId);
            if (!keyResult) return null;
            return Number(((keyResult.startValue / keyResult.targetValue) * 100).toFixed(1));
        },
    },
    actions: {
        // 临时目标相关方法（用于新建目标）
        initTempGoal() {
            this.tempGoal = {
                id: 'tempGoal', // 临时目标 ID
                title: '',
                color: '#FF5733',
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
        // 生成已有目标的临时副本
        initTempGoalByGoalId(goalId: string) {
            const goal = this.goals.find(g => g.id === goalId);
            this.tempGoal = {
                ...goal,
                id: goal?.id || 'tempGoal', 
                keyResults: goal?.keyResults || [], 
                title: goal?.title || '',
                color: goal?.color || '#FF5733',
                dirId: goal?.dirId || '',
                startTime: goal?.startTime || new Date().toISOString().split('T')[0],
                endTime: goal?.endTime || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                motive: goal?.motive || '',
                feasibility: goal?.feasibility || '',
                meta: goal?.meta || undefined,
            };
            return this.tempGoal;
        },
        // 清空临时目标
        clearTempGoal() {
            this.initTempGoal();
        },
        // 保存临时目标的修改
        saveTempGoalChanges() {
            if (!this.tempGoal || !this.tempGoal.id) return null;
            
            // 如果是新建目标，则添加到 goals 数组中
            if (this.tempGoal.id === 'tempGoal') {
                return this.addGoal();
            }

            // 如果是编辑目标，则更新 goals 数组中的目标
            const index = this.goals.findIndex(g => g.id === this.tempGoal.id);
            if (index === -1) return null;

            const updatedGoal = {
                ...this.tempGoal,
                meta: {
                    createdAt: this.tempGoal.meta?.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
            };

            this.goals.splice(index, 1, updatedGoal);
            return updatedGoal;
        },
        // 获取临时目标
        getTempGoal(): IGoal {
            if (!this.tempGoal) {
              this.initTempGoal();
            }
            return this.tempGoal!;
        },
        // 关键结果相关方法
        // 生成临时关键结果
        initTempKeyResult() {
            const defaultKeyResult: IKeyResult = {
                id: 'temp', // 临时关键结果 ID
                name: '',
                startValue: 0,
                targetValue: 10,
                calculationMethod: 'sum',
                weight: 5,
            };
            console.log('initTempKeyResult', defaultKeyResult);
            this.tempKeyResult = defaultKeyResult;
            return defaultKeyResult;
        },
        // 生成已有关键结果的临时副本
        initTempKeyResultByKeyResultId(goalId: string, keyResultId: string) {
            const goal = this.goals.find(g => g.id === goalId);
            if (!goal) return null;
            const keyResult = goal.keyResults.find(kr => kr.id === keyResultId);
            if (!keyResult) return null;
            this.tempKeyResult = {
                ...keyResult,
                id: keyResultId,
            };
            return this.tempKeyResult;
        },
        // 清空临时关键结果
        clearTempKeyResult() {
            this.initTempKeyResult();
        },
        //  保存临时关键结果的修改(保活增加和修改)
        saveTempKeyResultChanges() {
            if (!this.tempKeyResult) return null;
            // 如果是新建关键结果，则添加到临时目标中
            if (this.tempKeyResult.id === 'temp') {
                const keyResult: IKeyResult = {
                    ...this.tempKeyResult,
                    id: uuidv4(),
                };
                this.tempGoal.keyResults.push(keyResult);
                this.clearTempKeyResult();
                return this.tempKeyResult;
            }
            // 如果是编辑关键结果，则更新临时目标中的关键结果
            if (this.tempKeyResult.id !== 'temp') {
                const index = this.tempGoal.keyResults.findIndex(kr => kr.id === this.tempKeyResult.id);
                
                if (index !== -1) {
                    const keyResult: IKeyResult = {
                        ...this.tempKeyResult,
                        id: this.tempKeyResult.id,
                    };
                    this.tempGoal.keyResults[index] = keyResult;
                    this.clearTempKeyResult();
                    return keyResult;
                }
            }
            return null;
        },
        //  删除临时关键结果
        deleteTempKeyResult(keyResultId: string) {
            if (!this.tempKeyResult) return null;
            const index = this.tempGoal.keyResults.findIndex(kr => kr.id === keyResultId);
            if (index !== -1) {
                this.tempGoal.keyResults.splice(index, 1);
                // this.clearTempKeyResult();
            }
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
        // 获取目标下所有关键结果
        getAllKeyResultsByGoalId(goalId: string) {
            // 在临时目标中查找关键结果
            if (goalId === 'tempGoal') {
                return this.tempGoal.keyResults;
            }
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                return goal.keyResults;
            }
            return [];
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
        },
        // 修改关键结果 startValue 值
        updateKeyResultStartValue(goalId: string, keyResultId: string, startValue: number) {
            const goal = this.goals.find(g => g.id === goalId);
            if (goal) {
                const keyResult = goal.keyResults.find(kr => kr.id === keyResultId);
                if (keyResult) {
                    keyResult.startValue += startValue;
                }
            }
        },
    },
    persist: true,
});