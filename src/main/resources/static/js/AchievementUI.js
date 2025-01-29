class AchievementUI {
    constructor(achievementSystem) {
        this.achievementSystem = achievementSystem;
        this.createAchievementPanel();
    }

    createAchievementPanel() {
        // 创建成就面板
        const panel = document.createElement('div');
        panel.className = 'achievement-panel';
        panel.innerHTML = `
            <div class="achievement-header">
                <h3>成就系统</h3>
                <button id="toggleAchievements">显示/隐藏</button>
            </div>
            <div class="achievement-list" style="display: none;"></div>
        `;
        document.body.appendChild(panel);

        // 绑定事件
        const toggleBtn = document.getElementById('toggleAchievements');
        const achievementList = panel.querySelector('.achievement-list');
        toggleBtn.onclick = () => {
            achievementList.style.display = 
                achievementList.style.display === 'none' ? 'block' : 'none';
        };

        this.achievementList = achievementList;
        this.updateAchievementList();
    }

    updateAchievementList() {
        const achievements = this.achievementSystem.getAllAchievements();
        this.achievementList.innerHTML = achievements.map(achievement => `
            <div class="achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}">
                <h4>${achievement.name}</h4>
                <p>${achievement.description}</p>
                ${achievement.unlocked ? '<span class="achievement-complete">✓</span>' : ''}
            </div>
        `).join('');
    }

    showUnlockNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <h4>🏆 解锁成就</h4>
            <p>${achievement.name}</p>
            <p>${achievement.description}</p>
        `;
        document.body.appendChild(notification);

        // 3秒后移除通知
        setTimeout(() => {
            notification.classList.add('fade-out');
            setTimeout(() => notification.remove(), 1000);
        }, 3000);
    }
}

export default AchievementUI; 