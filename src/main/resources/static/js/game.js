import GameCore from './GameCore.js';
import AchievementSystem from './AchievementSystem.js';
import AchievementUI from './AchievementUI.js';
import SkillSystem from './SkillSystem.js';
import SkillUI from './SkillUI.js';
import GameController from './GameController.js';
import CompanionSystem from './CompanionSystem.js';
import CompanionUI from './CompanionUI.js';

class TextGame {
    constructor() {
        this.elements = {
            playerHealth: document.getElementById('playerHealth'),
            playerAttack: document.getElementById('playerAttack'),
            playerDefense: document.getElementById('playerDefense'),
            playerLevel: document.getElementById('playerLevel'),
            playerExp: document.getElementById('playerExp'),
            nextLevelExp: document.getElementById('nextLevelExp'),
            currentWave: document.getElementById('currentWave'),
            enemyName: document.getElementById('enemyName'),
            enemyHealth: document.getElementById('enemyHealth'),
            enemyAttack: document.getElementById('enemyAttack'),
            attackBtn: document.getElementById('attackBtn'),
            defendBtn: document.getElementById('defendBtn'),
            logContent: document.getElementById('logContent')
        };

        this.controller = new GameController(this);
        
        this.bindEvents();
        this.updateUI();
    }

    bindEvents() {
        this.elements.attackBtn.onclick = () => this.controller.playerAttack();
        this.elements.defendBtn.onclick = () => this.controller.playerDefend();
        
        document.addEventListener('click', (e) => {
            const itemButton = e.target.closest('.item-button');
            if (itemButton && !itemButton.classList.contains('empty')) {
                const itemId = itemButton.dataset.itemId;
                if (itemId) {
                    this.controller.useItem(itemId);
                }
            }
        });
        
        document.querySelector('.skill-panel').addEventListener('click', (e) => {
            const skillButton = e.target.closest('.skill-button');
            if (skillButton && !skillButton.disabled) {
                this.controller.useSkill(skillButton.dataset.skillId);
            }
        });
    }

    log(message) {
        const logEntry = document.createElement('p');
        logEntry.textContent = message;
        logEntry.classList.add('fade-in');
        this.elements.logContent.appendChild(logEntry);
        this.elements.logContent.scrollTop = this.elements.logContent.scrollHeight;
    }

    updateUI() {
        const { player, currentEnemy, currentWave, isPlayerTurn } = this.controller.gameCore;
        
        this.elements.playerHealth.textContent = `${player.health}/${player.maxHealth}`;
        this.elements.playerAttack.textContent = player.attack;
        this.elements.playerDefense.textContent = player.defense;
        this.elements.currentWave.textContent = currentWave;
        
        this.elements.playerLevel.textContent = player.level;
        this.elements.playerExp.textContent = player.exp;
        this.elements.nextLevelExp.textContent = player.nextLevelExp;
        
        if (currentEnemy) {
            this.elements.enemyName.textContent = currentEnemy.name;
            this.elements.enemyHealth.textContent = `${currentEnemy.health}/${currentEnemy.maxHealth}`;
            this.elements.enemyAttack.textContent = currentEnemy.attack;
        }

        const buttons = [
            this.elements.attackBtn, 
            this.elements.defendBtn
        ];
        buttons.forEach(btn => btn.disabled = !isPlayerTurn);
    }
}

window.onload = () => {
    new TextGame();
}; 