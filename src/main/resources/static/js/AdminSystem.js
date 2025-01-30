class AdminSystem {
    constructor(gameController) {
        this.controller = gameController;
        this.isAdminMode = false;
        this.bindAdminHotkey();
    }

    bindAdminHotkey() {
        // 使用 Ctrl + Alt + A 开启管理员模式
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
                this.toggleAdminMode();
            }
        });
    }

    toggleAdminMode() {
        this.isAdminMode = !this.isAdminMode;
        if (this.isAdminMode) {
            this.createAdminPanel();
        } else {
            this.removeAdminPanel();
        }
    }

    createAdminPanel() {
        const panel = document.createElement('div');
        panel.id = 'adminPanel';
        panel.className = 'admin-panel';
        panel.innerHTML = `
            <h3>管理员控制面板</h3>
            <div class="admin-controls">
                <button onclick="window.adminSystem.setPlayerStats('maxHealth', 999)">无限生命</button>
                <button onclick="window.adminSystem.setPlayerStats('attack', 100)">提升攻击</button>
                <button onclick="window.adminSystem.setPlayerStats('defense', 50)">提升防御</button>
                <button onclick="window.adminSystem.addAllItems()">获得所有道具</button>
                <button onclick="window.adminSystem.unlockAllSkills()">解锁所有技能</button>
                <button onclick="window.adminSystem.unlockAllCompanions()">解锁所有伙伴</button>
                <button onclick="window.adminSystem.levelUp(5)">提升5级</button>
                <button onclick="window.adminSystem.killCurrentEnemy()">秒杀当前敌人</button>
            </div>
        `;
        document.body.appendChild(panel);
        
        // 添加到全局以便HTML onclick能访问
        window.adminSystem = this;
    }

    removeAdminPanel() {
        const panel = document.getElementById('adminPanel');
        if (panel) {
            panel.remove();
        }
    }

    setPlayerStats(stat, value) {
        const player = this.controller.gameCore.player;
        player[stat] = value;
        if (stat === 'maxHealth') {
            player.health = value;
        }
        this.controller.ui.updateUI();
        this.controller.ui.log(`[管理员] 设置 ${stat} 为 ${value}`);
    }

    addAllItems() {
        Object.keys(this.controller.itemSystem.items).forEach(itemId => {
            this.controller.itemSystem.items[itemId].count = 
                this.controller.itemSystem.items[itemId].maxCount;
        });
        this.controller.itemUI.updateItemPanel();
        this.controller.ui.log('[管理员] 获得所有道具');
    }

    unlockAllSkills() {
        Object.values(this.controller.skillSystem.skills).forEach(skill => {
            skill.unlocked = true;
            skill.currentCooldown = 0;
        });
        this.controller.skillUI.updateSkillPanel();
        this.controller.ui.log('[管理员] 解锁所有技能');
    }

    unlockAllCompanions() {
        Object.values(this.controller.companionSystem.companions).forEach(companion => {
            companion.unlocked = true;
        });
        this.controller.companionUI.updateCompanionList();
        this.controller.ui.log('[管理员] 解锁所有伙伴');
    }

    levelUp(levels) {
        for (let i = 0; i < levels; i++) {
            const stats = this.controller.gameCore.levelUp();
            if (stats) {
                this.controller.ui.log(`[管理员] 升级! 当前等级: ${this.controller.gameCore.player.level}`);
            }
        }
        this.controller.ui.updateUI();
    }

    killCurrentEnemy() {
        this.controller.gameCore.currentEnemy.health = 0;
        this.controller.ui.updateUI();
        this.controller.ui.log('[管理员] 秒杀当前敌人');
        this.controller.battleSystem.handleEnemyDefeat();
    }
}

export default AdminSystem; 