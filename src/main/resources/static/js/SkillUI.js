class SkillUI {
    constructor(skillSystem) {
        this.skillSystem = skillSystem;
        this.createSkillPanel();
    }

    createSkillPanel() {
        const panel = document.createElement('div');
        panel.className = 'skill-panel';
        document.querySelector('.control-panel').appendChild(panel);
        this.panel = panel;
        this.updateSkillPanel();
    }

    updateSkillPanel() {
        this.panel.innerHTML = Object.values(this.skillSystem.skills)
            .filter(skill => skill.unlocked)
            .map(skill => `
                <button class="skill-button ${skill.currentCooldown > 0 ? 'cooling' : ''}"
                        data-skill-id="${skill.id}"
                        ${skill.currentCooldown > 0 ? 'disabled' : ''}>
                    ${skill.name}
                    ${skill.currentCooldown > 0 ? `(${skill.currentCooldown})` : ''}
                    <span class="skill-tooltip">
                        ${skill.description}<br>
                        冷却时间: ${skill.cooldown} 回合
                    </span>
                </button>
            `).join('');
    }

    showSkillUnlockNotification(skill) {
        const notification = document.createElement('div');
        notification.className = 'skill-notification';
        notification.innerHTML = `
            <h4>🎯 解锁新技能</h4>
            <p>${skill.name}</p>
            <p>${skill.description}</p>
        `;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 1000);
        }, 3000);
    }
}

export default SkillUI; 