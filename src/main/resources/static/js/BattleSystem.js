export default class BattleSystem {
    constructor(controller) {
        this.controller = controller;
    }

    handlePlayerAttack() {
        if (!this.controller.gameCore.isPlayerTurn) return;
        
        const damage = this.controller.gameCore.calculateDamage(
            this.controller.gameCore.player, 
            this.controller.gameCore.currentEnemy
        );
        
        this.controller.gameCore.currentEnemy.health -= damage;
        this.controller.ui.log(`你对 ${this.controller.gameCore.currentEnemy.name} 造成了 ${damage} 点伤害！`);

        if (this.controller.gameCore.currentEnemy.health <= 0) {
            this.handleEnemyDefeat();
            // 确保在开始新一波时重置玩家回合状态
            this.controller.gameCore.isPlayerTurn = true;
        } else {
            this.controller.gameCore.isPlayerTurn = false;
            this.controller.ui.updateUI();
            this.handleEnemyTurn();
        }
    }

    handlePlayerDefend() {
        this.controller.gameCore.isDefending = true;
        this.controller.ui.log('你采取了防御姿态，下次受到的伤害将减半！');
        this.controller.gameCore.isPlayerTurn = false;
        this.handleEnemyTurn();
        
        if (this.controller.gameCore.isDefending) {
            this.controller.achievementSystem.stats.consecutiveDefends++;
            this.controller.achievementSystem.checkAchievements();
        }
    }

    handleEnemyTurn() {
        if (this.controller.gameCore.currentEnemy.health <= 0) {
            // 如果敌人已死亡，直接返回并确保玩家可以行动
            this.controller.gameCore.isPlayerTurn = true;
            this.controller.ui.updateUI();
            return;
        }

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
        this.controller.ui.log(`${this.controller.gameCore.currentEnemy.name} 对你造成了 ${damage} 点伤害！`);

        if (this.controller.gameCore.isGameOver()) {
            this.controller.handleGameOver();
        } else {
            this.updateTurnEnd();
        }
    }

    updateTurnEnd() {
        // 先更新技能冷却
        this.controller.skillSystem.updateCooldowns();
        this.controller.skillUI.updateSkillPanel();
        
        // 再更新道具效果
        this.controller.itemSystem.updateBuffs(this.controller.gameCore);
        this.controller.itemUI.showBuffStatus();
        
        // 最后才更新伙伴buff，确保buff至少持续一个完整回合
        if (this.controller.gameCore.isPlayerTurn) {
            this.controller.companionSystem.updateBuffsAndCooldowns(this.controller.gameCore.player);
            this.controller.companionUI.updateActiveCompanionInfo();
        }
        
        // 只有在敌人还活着的情况下才设置玩家回合
        if (this.controller.gameCore.currentEnemy.health > 0) {
            this.controller.gameCore.isPlayerTurn = true;
        }
        
        this.controller.gameCore.isDefending = false;
        this.controller.ui.updateUI();
        
        if (!this.controller.gameCore.isDefending) {
            this.controller.achievementSystem.stats.consecutiveDefends = 0;
        }
    }

    handleEnemyDefeat() {
        const expGain = this.controller.gameCore.calculateExpGain(
            this.controller.gameCore.currentEnemy
        );
        
        // 更新经验值和等级
        const levelUpStats = this.controller.gameCore.gainExp(expGain);
        this.controller.ui.log(
            `你击败了 ${this.controller.gameCore.currentEnemy.name}！获得 ${expGain} 点经验值！`
        );
        
        if (levelUpStats) {
            this.controller.ui.log(`
                ★ 升级了！达到 ${this.controller.gameCore.player.level} 级！ ★
                生命值上限 +${levelUpStats.maxHealth}
                攻击力 +${levelUpStats.attack}
                防御力 +${levelUpStats.defense}
            `);
            
            // 检查新解锁的内容
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

        // 更新成就系统
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

        // 处理物品掉落
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

        // 更新UI
        this.controller.ui.updateUI();
        
        // 开始下一波
        this.controller.gameCore.currentEnemy = this.controller.gameCore.nextWave();
        this.controller.startNewWave();
        
        // 确保新一波开始时玩家可以行动
        this.controller.gameCore.isPlayerTurn = true;
        this.controller.ui.updateUI();
    }
}