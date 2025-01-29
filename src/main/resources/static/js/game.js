import GameCore from './GameCore.js';
import AchievementSystem from './AchievementSystem.js';
import AchievementUI from './AchievementUI.js';
import SkillSystem from './SkillSystem.js';
import SkillUI from './SkillUI.js';
import GameController from './GameController.js';

class TextGame {
    constructor() {
        this.bindElements();
        this.controller = new GameController(this);
        this.bindEvents();
        this.updateUI();
        this.controller.startNewWave();
    }

    bindElements() {
        this.elements = {
            playerHealth: document.getElementById('playerHealth'),
            playerAttack: document.getElementById('playerAttack'),
            playerDefense: document.getElementById('playerDefense'),
            currentWave: document.getElementById('currentWave'),
            enemyName: document.getElementById('enemyName'),
            enemyHealth: document.getElementById('enemyHealth'),
            enemyAttack: document.getElementById('enemyAttack'),
            logContent: document.getElementById('logContent'),
            attackBtn: document.getElementById('attackBtn'),
            defendBtn: document.getElementById('defendBtn'),
            itemBtn: document.getElementById('itemBtn'),
            playerLevel: document.getElementById('playerLevel'),
            playerExp: document.getElementById('playerExp'),
            nextLevelExp: document.getElementById('nextLevelExp'),
            playerHealthBar: document.getElementById('playerHealthBar'),
            enemyHealthBar: document.getElementById('enemyHealthBar')
        };
    }

    bindEvents() {
        this.elements.attackBtn.onclick = () => this.controller.playerAttack();
        this.elements.defendBtn.onclick = () => this.controller.playerDefend();
        
        document.querySelector('.item-panel').addEventListener('click', (e) => {
            const itemButton = e.target.closest('.item-button');
            if (itemButton && !itemButton.disabled) {
                this.controller.useItem(itemButton.dataset.itemId);
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
        this.elements.playerLevel.textContent = player.level;
        this.elements.playerExp.textContent = player.exp;
        this.elements.nextLevelExp.textContent = player.nextLevelExp;
        
        const playerHealthPercent = (player.health / player.maxHealth) * 100;
        document.getElementById('playerHealthBar').style.width = `${playerHealthPercent}%`;
        
        this.elements.currentWave.textContent = currentWave;
        
        if (currentEnemy) {
            this.elements.enemyName.textContent = currentEnemy.name;
            this.elements.enemyHealth.textContent = `${currentEnemy.health}/${currentEnemy.maxHealth}`;
            this.elements.enemyAttack.textContent = currentEnemy.attack;
            
            const enemyHealthPercent = (currentEnemy.health / currentEnemy.maxHealth) * 100;
            document.getElementById('enemyHealthBar').style.width = `${enemyHealthPercent}%`;
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