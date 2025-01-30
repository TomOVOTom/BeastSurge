import BattleRewardSystem from './BattleRewardSystem.js';

export default class BattleSystem {
    constructor(controller) {
        this.controller = controller;
        this.rewardSystem = new BattleRewardSystem(controller);
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
            this.rewardSystem.handleEnemyDefeat();
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
        this.controller.skillSystem.updateCooldowns();
        this.controller.skillUI.updateSkillPanel();
        
        this.controller.itemSystem.updateBuffs(this.controller.gameCore);
        this.controller.itemUI.showBuffStatus();
        
        this.controller.companionSystem.updateBuffsAndCooldowns(this.controller.gameCore.player);
        this.controller.companionUI.updateActiveCompanionInfo();
        
        if (this.controller.gameCore.currentEnemy.health > 0) {
            this.controller.gameCore.isPlayerTurn = true;
        }
        
        this.controller.gameCore.isDefending = false;
        this.controller.ui.updateUI();
        
        if (!this.controller.gameCore.isDefending) {
            this.controller.achievementSystem.stats.consecutiveDefends = 0;
        }
    }
} 