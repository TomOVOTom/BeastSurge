import GameCore from './GameCore.js';
import AchievementSystem from './AchievementSystem.js';
import AchievementUI from './AchievementUI.js';
import SkillSystem from './SkillSystem.js';
import SkillUI from './SkillUI.js';
import ItemSystem from './ItemSystem.js';
import ItemUI from './ItemUI.js';
import MonsterSystem from './MonsterSystem.js';
import BattleSystem from './BattleSystem.js';
import CompanionSystem from './CompanionSystem.js';
import CompanionUI from './CompanionUI.js';
import GameFlowController from './GameFlowController.js';
import AdminSystem from './AdminSystem.js';

export default class GameController {
    constructor(ui) {
        this.ui = ui;
        this.initializeSystems();
        this.initializeGameState();
    }

    initializeSystems() {
        this.gameCore = new GameCore();
        this.achievementSystem = new AchievementSystem();
        this.achievementUI = new AchievementUI(this.achievementSystem);
        this.skillSystem = new SkillSystem();
        this.skillUI = new SkillUI(this.skillSystem);
        this.itemSystem = new ItemSystem();
        this.itemUI = new ItemUI(this.itemSystem);
        this.monsterSystem = new MonsterSystem();
        this.battleSystem = new BattleSystem(this);
        this.companionSystem = new CompanionSystem();
        this.companionUI = new CompanionUI(this.companionSystem, this);
        this.flowController = new GameFlowController(this);
        this.adminSystem = new AdminSystem(this);
    }

    initializeGameState() {
        this.gameCore.currentEnemy = this.gameCore.generateEnemy();
        this.gameCore.isPlayerTurn = true;
    }

    startNewWave() {
        this.flowController.startNewWave();
    }

    playerAttack() {
        if (!this.gameCore.isPlayerTurn) return;
        this.battleSystem.handlePlayerAttack();
    }

    playerDefend() {
        if (!this.gameCore.isPlayerTurn) return;
        this.battleSystem.handlePlayerDefend();
    }

    useSkill(skillId) {
        if (!this.gameCore.isPlayerTurn) return;
        
        const result = this.skillSystem.useSkill(skillId, this.gameCore);
        if (result.success) {
            this.ui.log(result.message);
            this.skillUI.updateSkillPanel();
            this.ui.updateUI();
            
            // 使用技能后结束玩家回合
            this.gameCore.isPlayerTurn = false;
            this.battleSystem.handleEnemyTurn();
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
            this.ui.updateUI();
            
            // 如果道具有持续效果，更新buff显示
            if (result.duration) {
                this.itemUI.showBuffStatus();
            }
            
            // 使用道具后结束玩家回合
            this.gameCore.isPlayerTurn = false;
            this.battleSystem.handleEnemyTurn();
        } else {
            this.ui.log(result.message);
        }
    }
}