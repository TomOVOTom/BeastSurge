export default class GameFlowController {
    constructor(controller) {
        this.controller = controller;
    }

    startNewWave() {
        this.controller.gameCore.currentEnemy = this.controller.monsterSystem.generateMonster(
            this.controller.gameCore.currentWave
        );
        this.controller.ui.log(
            `第 ${this.controller.gameCore.currentWave} 波 - ${this.controller.gameCore.currentEnemy.name} 出现了！`
        );
        this.controller.ui.log(`描述: ${this.controller.gameCore.currentEnemy.description}`);
        this.controller.ui.updateUI();
    }

    enemyTurn() {
        const specialEffect = this.controller.monsterSystem.processSpecialAbilities(
            this.controller.gameCore.currentEnemy
        );
        
        if (specialEffect) {
            this.controller.ui.log(specialEffect.message);
        }

        this.processEnemyAttack();
        this.updateTurnEnd();
    }

    processEnemyAttack() {
        const damage = this.controller.gameCore.calculateDamage(
            this.controller.gameCore.currentEnemy,
            this.controller.gameCore.player,
            this.controller.gameCore.isDefending
        );

        this.controller.gameCore.player.health -= damage;
        this.controller.ui.log(
            `${this.controller.gameCore.currentEnemy.name} 对你造成了 ${damage} 点伤害！`
        );

        if (this.controller.gameCore.isGameOver()) {
            this.handleGameOver();
        }
    }

    handleEnemyDefeat() {
        this.processExpGain();
        this.updateAchievements();
        this.processItemDrop();
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
            this.handleLevelUp(levelUpStats);
        }
    }

    handleLevelUp(stats) {
        this.controller.ui.log(`
            ★ 升级了！达到 ${this.controller.gameCore.player.level} 级！ ★
            生命值上限 +${stats.maxHealth}
            攻击力 +${stats.attack}
            防御力 +${stats.defense}
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

    processItemDrop() {
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
        this.startNewWave();
    }

    handleGameOver() {
        this.controller.ui.log('游戏结束！你被击败了。');
        alert(`游戏结束！\n你坚持到了第 ${this.controller.gameCore.currentWave} 波`);
        location.reload();
    }

    updateTurnEnd() {
        this.controller.skillSystem.updateCooldowns();
        this.controller.skillUI.updateSkillPanel();
        
        this.controller.itemSystem.updateBuffs(this.controller.gameCore);
        this.controller.itemUI.showBuffStatus();
        
        this.controller.gameCore.isPlayerTurn = true;
        this.controller.gameCore.isDefending = false;
        this.controller.ui.updateUI();
        
        if (!this.controller.gameCore.isDefending) {
            this.controller.achievementSystem.stats.consecutiveDefends = 0;
        }
    }
} 