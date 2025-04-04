import { defineStore } from "pinia";
import type { IGoalDir } from "../types/type";
import { v4 as uuidv4 } from 'uuid';


export const SYSTEM_DIR_TYPES = {
    ALL: 'all',
    TRASH: 'trash',
    ARCHIVE: 'archive',
}

const SYSTEM_DIRS: IGoalDir[] = [
    {
        id: SYSTEM_DIR_TYPES.ALL,
        name: '全部目标',
        icon: 'octicon:goal-16',
        goals: [],
    },
    {
        id: SYSTEM_DIR_TYPES.TRASH,
        name: '已删除',
        icon: 'material-symbols:delete-outline',
        goals: [],
    },
    {
        id: SYSTEM_DIR_TYPES.ARCHIVE,
        name: '已归档',
        icon: 'material-symbols:archive-outline',
        goals: [],
    }
];

export const useGoalDirStore = defineStore('goalDir', {
    state: () => ({
        systemDirs: SYSTEM_DIRS,
        userDirs: [
            { id: '3', name: '考研', icon: 'clarity:directory-line', goals: [] },
        ] as IGoalDir[],
    }),
    getters: {
        getAllDirs(): IGoalDir[] {
            return [
                this.systemDirs.find(dir => dir.id === SYSTEM_DIR_TYPES.ALL)!,
                ...this.userDirs,
                ...this.systemDirs.filter(dir =>
                    dir.id === SYSTEM_DIR_TYPES.TRASH || dir.id === SYSTEM_DIR_TYPES.ARCHIVE
                )
            ].filter(Boolean);
        },
        getDirById: (state) => (id: string) => {
            return state.userDirs.find(g => g.id === id) || state.systemDirs.find(g => g.id === id);
        },
        getUserDirs(state): IGoalDir[] {
            return state.userDirs;
        },
    },
    actions: {
        addGoalDir(goalDir: Omit<IGoalDir, 'id' | 'goals'>) {
            const newDir: IGoalDir = {
                ...goalDir,
                id: uuidv4(),
                goals: [],
            };
            this.userDirs.push(newDir);
        },
        updateGoalDir(goalDir: IGoalDir) {
            const index = this.userDirs.findIndex(dir => dir.id === goalDir.id);
            if (index !== -1) {
                this.userDirs.splice(index, 1, goalDir);
            }
        },
        deleteGoalDir(id: string) {
            const index = this.userDirs.findIndex(dir => dir.id === id);
            if (index !== -1) {
                this.userDirs.splice(index, 1);
            }
        },
    },
    persist: true,
});