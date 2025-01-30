class CompanionUI {
    constructor(companionSystem, controller) {
        if (!companionSystem || !controller) {
            throw new Error('CompanionUI requires companionSystem and controller');
        }
        this.companionSystem = companionSystem;
        this.controller = controller;
        
        // 添加到全局以便HTML onclick能访问
        window.companionUI = this;
        
        // 初始化面板
        this.initializePanel();
    }

    initializePanel() {
        // 先检查是否已存在面板
        const existingPanel = document.querySelector('.companion-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        // 创建伙伴面板
        const panel = document.createElement('div');
        panel.className = 'companion-panel';
        
        // 创建伙伴选择区域
        panel.innerHTML = `
            <h3>可用伙伴</h3>
            <div class="companion-list"></div>
            <div class="companion-info"></div>
        `;

        // 将面板添加到左侧面板中
        const leftPanel = document.querySelector('.left-panel');
        if (leftPanel) {
            leftPanel.appendChild(panel);
        }

        this.updateCompanionList();
    }

    updateCompanionList() {
        const companionList = document.querySelector('.companion-list');
        companionList.innerHTML = this.companionSystem.getAllCompanions()
            .map(companion => `
                <div class="companion-card ${companion.type}" data-id="${companion.id}">
                    <h4>${companion.name}</h4>
                    <p class="companion-type">${this.getTypeText(companion.type)}</p>
                    <p class="companion-description">${companion.description}</p>
                    <p class="companion-ability">技能：${companion.ability.name}</p>
                    <p class="companion-unlock">解锁等级：${companion.unlockLevel}</p>
                    <button class="summon-btn" data-id="${companion.id}">
                        召唤伙伴
                    </button>
                </div>
            `).join('');

        // 绑定召唤按钮事件
        companionList.querySelectorAll('.summon-btn').forEach(btn => {
            btn.onclick = () => this.summonCompanion(btn.dataset.id);
        });
    }

    summonCompanion(companionId) {
        if (this.companionSystem.setActiveCompanion(companionId)) {
            this.updateActiveCompanionInfo();
            // 更新所有召唤按钮状态
            document.querySelectorAll('.summon-btn').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.id === companionId);
            });
        }
    }

    updateActiveCompanionInfo() {
        const info = this.companionSystem.getActiveCompanionInfo();
        const infoArea = document.querySelector('.companion-info');
        
        if (info) {
            infoArea.innerHTML = `
                <h3>当前伙伴</h3>
                <div class="active-companion ${info.type}">
                    <h4>${info.name}</h4>
                    <p>${info.description}</p>
                    <p>技能：${info.ability}</p>
                    <p class="cooldown ${info.cooldown > 0 ? 'on-cooldown' : ''}">
                        冷却时间：${info.cooldown || '就绪'}
                    </p>
                    ${this.renderBuffs(info.buffs)}
                    <button class="companion-ability-btn" 
                            ${info.cooldown > 0 ? 'disabled' : ''}>
                        使用技能
                    </button>
                </div>
            `;

            // 添加事件监听器
            const abilityBtn = infoArea.querySelector('.companion-ability-btn');
            if (abilityBtn) {
                // 使用 once: true 确保事件只触发一次
                abilityBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.useCompanionAbility();
                }, { once: true });
            }
        } else {
            infoArea.innerHTML = '<p>未召唤伙伴</p>';
        }
    }

    useCompanionAbility() {
        if (!this.controller || !this.controller.gameCore) {
            console.error('Controller or gameCore not initialized');
            return;
        }

        if (!this.controller.gameCore.isPlayerTurn) {
            this.controller.ui.log('不是你的回合！');
            return;
        }

        const result = this.companionSystem.useCompanionAbility(
            this.controller.gameCore.player,
            this.controller.gameCore.currentEnemy
        );
        
        if (result.success) {
            this.controller.ui.log(result.message);
            
            // 立即更新UI显示
            this.controller.ui.updateUI();
            this.updateActiveCompanionInfo();
            
            // 使用伙伴技能后结束回合
            this.controller.gameCore.isPlayerTurn = false;
            
            // 不要在这里调用 updateBuffsAndCooldowns
            requestAnimationFrame(() => {
                // 直接调用敌人回合，让 BattleSystem 来处理回合结束逻辑
                this.controller.battleSystem.handleEnemyTurn();
            });
        } else {
            this.controller.ui.log(result.message);
        }
    }

    renderBuffs(buffs) {
        if (!buffs || buffs.length === 0) return '';
        
        return `
            <div class="buff-list">
                <h4>当前增益</h4>
                ${buffs.map(buff => `
                    <div class="buff">
                        ${this.getBuffIcon(buff.stat)} +${buff.value}
                        (${buff.remainingTurns}回合)
                    </div>
                `).join('')}
            </div>
        `;
    }

    getTypeText(type) {
        const types = {
            healer: '治疗型',
            attacker: '攻击型',
            buffer: '增益型',
            defender: '防御型'
        };
        return types[type] || type;
    }

    getBuffIcon(stat) {
        const icons = {
            attack: '⚔️',
            defense: '🛡️',
            health: '❤️'
        };
        return icons[stat] || '✨';
    }

    showUnlockNotification(companions) {
        companions.forEach(companion => {
            const notification = document.createElement('div');
            notification.className = 'companion-unlock-notification fade-in';
            notification.innerHTML = `
                <h4>新伙伴解锁！</h4>
                <p>${companion.name}</p>
                <p>${companion.description}</p>
            `;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.remove();
            }, 3000);
        });

        this.updateCompanionList();
    }
}

export default CompanionUI; 