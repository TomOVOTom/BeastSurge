import GameCore from './GameCore.js';
import AchievementSystem from './AchievementSystem.js';
import AchievementUI from './AchievementUI.js';
import SkillSystem from './SkillSystem.js';
import SkillUI from './SkillUI.js';
import ItemSystem from './ItemSystem.js';
import ItemUI from './ItemUI.js';

export default class GameController {
    constructor(ui) {
        this.ui = ui;
        this.gameCore = new GameCore();
        this.achievementSystem = new AchievementSystem();
        this.achievementUI = new AchievementUI(this.achievementSystem);
        this.skillSystem = new SkillSystem();
        this.skillUI = new SkillUI(this.skillSystem);
        this.itemSystem = new ItemSystem();
        this.itemUI = new ItemUI(this.itemSystem);
        
        // 初始化游戏状态
        this.gameCore.currentEnemy = this.gameCore.generateEnemy();
        this.gameCore.isPlayerTurn = true;
    }

    startNewWave() {
        this.gameCore.currentEnemy = this.gameCore.generateEnemy();
        this.ui.log(`第 ${this.gameCore.currentWave} 波 - ${this.gameCore.currentEnemy.name} 出现了！`);
        this.ui.updateUI();
    }

    playerAttack() {
        if (!this.gameCore.isPlayerTurn) return;

        const damage = this.gameCore.calculateDamage(this.gameCore.player, this.gameCore.currentEnemy);
        this.gameCore.currentEnemy.health -= damage;
        this.ui.log(`你对 ${this.gameCore.currentEnemy.name} 造成了 ${damage} 点伤害！`);

        if (this.gameCore.currentEnemy.health <= 0) {
            this.handleEnemyDefeat();
        } else {
            this.gameCore.isPlayerTurn = false;
            this.ui.updateUI();
            this.enemyTurn();
        }
    }

    playerDefend() {
        if (!this.gameCore.isPlayerTurn) return;
        this.gameCore.isDefending = true;
        this.ui.log('你采取了防御姿态，下次受到的伤害将减半！');
        this.gameCore.isPlayerTurn = false;
        this.enemyTurn();
        
        if (this.gameCore.isDefending) {
            this.achievementSystem.stats.consecutiveDefends++;
            this.achievementSystem.checkAchievements();
        }
    }

    enemyTurn() {
        const damage = this.gameCore.calculateDamage(
            this.gameCore.currentEnemy, 
            this.gameCore.player, 
            this.gameCore.isDefending
        );
        
        this.gameCore.player.health -= damage;
        this.ui.log(`${this.gameCore.currentEnemy.name} 对你造成了 ${damage} 点伤害！`);

        if (this.gameCore.isGameOver()) {
            this.handleGameOver();
        } else {
            this.skillSystem.updateCooldowns();
            this.skillUI.updateSkillPanel();
            
            // 更新buff持续时间
            this.itemSystem.updateBuffs(this.gameCore);
            this.itemUI.showBuffStatus();
            
            this.gameCore.isPlayerTurn = true;
            this.gameCore.isDefending = false;
            this.ui.updateUI();
            
            if (!this.gameCore.isDefending) {
                this.achievementSystem.stats.consecutiveDefends = 0;
            }
        }
    }

    handleEnemyDefeat() {
        const expGain = this.gameCore.calculateExpGain(this.gameCore.currentEnemy);
        this.ui.log(`你击败了 ${this.gameCore.currentEnemy.name}！获得 ${expGain} 点经验值！`);
        
        const levelUpStats = this.gameCore.gainExp(expGain);
        if (levelUpStats) {
            this.handleLevelUp(levelUpStats);
        }

        this.gameCore.currentEnemy = this.gameCore.nextWave();
        this.startNewWave();

        this.achievementSystem.updateStats({
            totalKills: this.achievementSystem.stats.totalKills + 1,
            level: this.gameCore.player.level,
            maxWave: this.gameCore.currentWave
        });

        const newAchievements = this.achievementSystem.checkAchievements();
        newAchievements.forEach(achievement => {
            this.achievementUI.showUnlockNotification(achievement);
        });
        
        if (newAchievements.length > 0) {
            this.achievementUI.updateAchievementList();
        }

        // 随机掉落道具
        if (Math.random() < 0.3) { // 30%概率掉落道具
            const items = ['healthPotion', 'strengthPotion', 'defensePotion'];
            const randomItem = items[Math.floor(Math.random() * items.length)];
            if (this.itemSystem.addItem(randomItem)) {
                this.ui.log(`获得了 ${this.itemSystem.items[randomItem].name}！`);
                this.itemUI.updateItemPanel();
            }
        }
    }

    handleLevelUp(stats) {
        this.ui.log(`
            ★ 升级了！达到 ${this.gameCore.player.level} 级！ ★
            生命值上限 +${stats.maxHealth}
            攻击力 +${stats.attack}
            防御力 +${stats.defense}
        `);
        
        const skillUnlock = this.skillSystem.checkSkillUnlocks(this.gameCore.player.level);
        if (skillUnlock) {
            this.skillUI.showSkillUnlockNotification(skillUnlock.newUnlock);
            this.skillUI.updateSkillPanel();
        }
    }

    handleGameOver() {
        this.ui.log('游戏结束！你被击败了。');
        alert(`游戏结束！\n你坚持到了第 ${this.gameCore.currentWave} 波`);
        location.reload();
    }

    useSkill(skillId) {
        if (!this.gameCore.isPlayerTurn) return;

        const result = this.skillSystem.useSkill(skillId, this.gameCore);
        if (result.success) {
            this.ui.log(result.message);
            this.skillUI.updateSkillPanel();
            
            if (this.gameCore.currentEnemy.health <= 0) {
                this.handleEnemyDefeat();
            } else {
                this.gameCore.isPlayerTurn = false;
                this.ui.updateUI();
                this.enemyTurn();
            }
        } else {
            this.ui.log(result.message);
        }
    }

    useItem(itemId) {
        if (!this.gameCore.isPlayerTurn) return;

        const result = this.itemSystem.useItem(itemId, this.gameCore);
        if (result.success) {
            this.ui.log(result.message);
            this.itemUI.updateItemPanel();
            this.itemUI.showBuffStatus();
            
            this.gameCore.isPlayerTurn = false;
            this.ui.updateUI();
            this.enemyTurn();
        } else {
            this.ui.log(result.message);
        }
    }
} 