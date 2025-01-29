class GameCore {
    constructor() {
        this.player = {
            health: 100,
            maxHealth: 100,
            attack: 10,
            defense: 5,
            level: 1,
            exp: 0,
            nextLevelExp: 100  // 升级所需经验
        };

        this.currentWave = 1;
        this.currentEnemy = null;
        this.isPlayerTurn = true;
        this.isDefending = false;
    }

    generateEnemy() {
        const enemies = [
            { name: '野狼', baseHealth: 30, baseAttack: 8 },
            { name: '狂暴熊', baseHealth: 50, baseAttack: 12 },
            { name: '魔化虎', baseHealth: 40, baseAttack: 15 }
        ];

        const enemy = enemies[Math.floor(Math.random() * enemies.length)];
        const multiplier = 1 + (this.currentWave - 1) * 0.5;

        return {
            name: enemy.name,
            health: Math.floor(enemy.baseHealth * multiplier),
            maxHealth: Math.floor(enemy.baseHealth * multiplier),
            attack: Math.floor(enemy.baseAttack * multiplier)
        };
    }

    calculateDamage(attacker, defender, isDefending = false) {
        let damage = Math.max(1, attacker.attack);
        if (isDefending) {
            damage = Math.floor(damage / 2);
        }
        return damage;
    }

    isGameOver() {
        return this.player.health <= 0;
    }

    nextWave() {
        this.currentWave++;
        return this.generateEnemy();
    }

    calculateExpGain(enemy) {
        // 基础经验值 + 波数加成
        return Math.floor(20 + (this.currentWave * 5));
    }

    gainExp(amount) {
        this.player.exp += amount;
        if (this.player.exp >= this.player.nextLevelExp) {
            return this.levelUp();
        }
        return null;
    }

    levelUp() {
        this.player.level++;
        this.player.exp -= this.player.nextLevelExp;
        this.player.nextLevelExp = Math.floor(this.player.nextLevelExp * 1.5);

        // 升级属性提升
        const stats = {
            maxHealth: Math.floor(this.player.maxHealth * 0.2),
            attack: Math.floor(this.player.attack * 0.15),
            defense: Math.floor(this.player.defense * 0.15)
        };

        this.player.maxHealth += stats.maxHealth;
        this.player.health = this.player.maxHealth; // 升级时回满血
        this.player.attack += stats.attack;
        this.player.defense += stats.defense;

        return stats;
    }
}

export default GameCore; 