class AchievementSystem {
    constructor() {
        this.achievements = {
            firstKill: {
                id: 'firstKill',
                name: '初次击杀',
                description: '击败第一个怪物',
                unlocked: false,
                condition: stats => stats.totalKills >= 1
            },
            warrior: {
                id: 'warrior',
                name: '成熟的战士',
                description: '达到10级',
                unlocked: false,
                condition: stats => stats.level >= 10
            },
            veteran: {
                id: 'veteran',
                name: '兽潮老兵',
                description: '击败100只怪物',
                unlocked: false,
                condition: stats => stats.totalKills >= 100
            },
            waveMaster: {
                id: 'waveMaster',
                name: '波数统治者',
                description: '到达第20波',
                unlocked: false,
                condition: stats => stats.maxWave >= 20
            },
            perfectDefense: {
                id: 'perfectDefense',
                name: '完美防御',
                description: '在一场战斗中连续成功防御3次',
                unlocked: false,
                condition: stats => stats.consecutiveDefends >= 3
            }
        };

        this.stats = {
            totalKills: 0,
            level: 1,
            maxWave: 1,
            consecutiveDefends: 0
        };
    }

    updateStats(newStats) {
        Object.assign(this.stats, newStats);
        this.checkAchievements();
    }

    checkAchievements() {
        let newUnlocks = [];
        
        Object.values(this.achievements).forEach(achievement => {
            if (!achievement.unlocked && achievement.condition(this.stats)) {
                achievement.unlocked = true;
                newUnlocks.push(achievement);
            }
        });

        return newUnlocks;
    }

    getUnlockedAchievements() {
        return Object.values(this.achievements).filter(a => a.unlocked);
    }

    getAllAchievements() {
        return Object.values(this.achievements);
    }
}

export default AchievementSystem; 