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

export default class SystemInitializer {
    constructor(ui) {
        this.ui = ui;
        this.systems = {};
        this.initializeSystems();
    }

    initializeSystems() {
        this.systems = {
            gameCore: new GameCore(),
            achievement: {
                system: new AchievementSystem(),
                ui: null
            },
            skill: {
                system: new SkillSystem(),
                ui: null
            },
            item: {
                system: new ItemSystem(),
                ui: null
            },
            monster: new MonsterSystem(),
            companion: {
                system: new CompanionSystem(),
                ui: null
            }
        };

        // 初始化UI组件
        this.initializeUIComponents();
        
        // 初始化战斗系统
        this.systems.battle = new BattleSystem(this.systems);
        this.systems.flow = new GameFlowController(this.systems);

        return this.systems;
    }

    initializeUIComponents() {
        this.systems.achievement.ui = new AchievementUI(this.systems.achievement.system);
        this.systems.skill.ui = new SkillUI(this.systems.skill.system);
        this.systems.item.ui = new ItemUI(this.systems.item.system);
        this.systems.companion.ui = new CompanionUI(this.systems.companion.system);
    }
} 