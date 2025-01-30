export default class BattleRewardSystem {
    constructor(controller) {
        this.controller = controller;
    }

    handleEnemyDefeat() {
        this.processExpGain();
        this.updateAchievements();
        this.handleItemDrop();
        this.startNextWave();
    }

    processExpGain() {
        const expGain = this.controller.gameCore.calculateExpGain(
            this.controller.gameCore.currentEnemy
        );
        this.controller.ui.log(
            `你击败了 ${this.controller.gameCore.currentEnemy.name}！获得 ${expGain} 点经验值！`
        );
        
        const levelUpStats = this.controller.gameCore.gainExp(expGain);
        if (levelUpStats) {
            this.controller.handleLevelUp(levelUpStats);
        }
    }

    updateAchievements() {
        this.controller.achievementSystem.updateStats({
            totalKills: this.controller.achievementSystem.stats.totalKills + 1,
            level: this.controller.gameCore.player.level,
            maxWave: this.controller.gameCore.currentWave
        });

        const newAchievements = this.controller.achievementSystem.checkAchievements();
        this.processNewAchievements(newAchievements);
    }

    processNewAchievements(achievements) {
        achievements.forEach(achievement => {
            this.controller.achievementUI.showUnlockNotification(achievement);
        });
        
        if (achievements.length > 0) {
            this.controller.achievementUI.updateAchievementList();
        }
    }

    handleItemDrop() {
        if (Math.random() < 0.3) {
            const items = ['healthPotion', 'strengthPotion', 'defensePotion'];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            if (this.controller.itemSystem.addItem(randomItem)) {
                this.controller.ui.log(
                    `获得了 ${this.controller.itemSystem.items[randomItem].name}！`
                );
                this.controller.itemUI.updateItemPanel();
            }
        }
    }

    startNextWave() {
        this.controller.gameCore.currentEnemy = this.controller.gameCore.nextWave();
        this.controller.startNewWave();
    }
} 