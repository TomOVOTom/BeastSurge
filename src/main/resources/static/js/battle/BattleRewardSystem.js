export default class BattleRewardSystem {
    constructor(controller) {
        this.controller = controller;
    }

    handleEnemyDefeat() {
        const expGain = this.controller.gameCore.calculateExpGain(
            this.controller.gameCore.currentEnemy
        );
        
        const levelUpStats = this.controller.gameCore.gainExp(expGain);
        this.controller.ui.log(
            `你击败了 ${this.controller.gameCore.currentEnemy.name}！获得 ${expGain} 点经验值！`
        );
        
        if (levelUpStats) {
            this.handleLevelUp(levelUpStats);
        }

        this.updateAchievements();
        this.handleItemDrop();
        this.startNextWave();
    }

    handleLevelUp(levelUpStats) {
        this.controller.ui.log(`
            ★ 升级了！达到 ${this.controller.gameCore.player.level} 级！ ★
            生命值上限 +${levelUpStats.maxHealth}
            攻击力 +${levelUpStats.attack}
            防御力 +${levelUpStats.defense}
        `);
        
        this.checkUnlocks();
    }

    checkUnlocks() {
        const skillUnlock = this.controller.skillSystem.checkSkillUnlocks(
            this.controller.gameCore.player.level
        );
        if (skillUnlock) {
            this.controller.skillUI.showSkillUnlockNotification(skillUnlock.newUnlock);
            this.controller.skillUI.updateSkillPanel();
        }

        const companionUnlock = this.controller.companionSystem.unlockCompanion(
            this.controller.gameCore.player.level
        );
        if (companionUnlock) {
            this.controller.companionUI.showUnlockNotification(companionUnlock.companions);
        }
    }

    updateAchievements() {
        this.controller.achievementSystem.updateStats({
            totalKills: this.controller.achievementSystem.stats.totalKills + 1,
            level: this.controller.gameCore.player.level,
            maxWave: this.controller.gameCore.currentWave
        });

        const newAchievements = this.controller.achievementSystem.checkAchievements();
        if (newAchievements.length > 0) {
            newAchievements.forEach(achievement => {
                this.controller.achievementUI.showUnlockNotification(achievement);
            });
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
        this.controller.ui.updateUI();
        this.controller.gameCore.currentEnemy = this.controller.gameCore.nextWave();
        this.controller.startNewWave();
        this.controller.gameCore.isPlayerTurn = true;
        this.controller.ui.updateUI();
    }
} 