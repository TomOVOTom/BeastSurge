import { monsters, waveSettings } from './MonsterData.js';

class MonsterSystem {
    constructor() {
        this.monsters = monsters;
        this.waveSettings = waveSettings;
    }

    generateMonster(wave) {
        let monsterPool;
        let multiplier = 1 + (wave - 1) * 0.5;

        // 决定这波出现什么类型的怪物
        if (wave % 10 === 0 && wave >= this.waveSettings.bossWaves.startWave) {
            monsterPool = this.waveSettings.bossWaves.pool;
            multiplier *= this.waveSettings.bossWaves.levelMultiplier;
        } else if (wave % 5 === 0 && wave >= this.waveSettings.eliteWaves.startWave) {
            monsterPool = this.waveSettings.eliteWaves.pool;
            multiplier *= this.waveSettings.eliteWaves.levelMultiplier;
        } else {
            monsterPool = this.waveSettings.normalWaves.pool;
            multiplier *= this.waveSettings.normalWaves.levelMultiplier;
        }

        const monsterId = monsterPool[Math.floor(Math.random() * monsterPool.length)];
        const monster = this.monsters[monsterId];

        return {
            name: monster.name,
            type: monster.type,
            health: Math.floor(monster.baseHealth * multiplier),
            maxHealth: Math.floor(monster.baseHealth * multiplier),
            attack: Math.floor(monster.baseAttack * multiplier),
            description: monster.description,
            expValue: Math.floor(monster.expValue * multiplier),
            special: monster.special || null,
            currentTurn: 0
        };
    }

    processSpecialAbilities(monster) {
        if (!monster.special) return null;

        let effect = null;
        monster.currentTurn++;

        switch (monster.type) {
            case 'elite':
                effect = this.processEliteAbilities(monster);
                break;
            case 'boss':
                effect = this.processBossAbilities(monster);
                break;
        }

        return effect;
    }

    processEliteAbilities(monster) {
        if (monster.special.defense && monster.currentTurn % 3 === 0) {
            return {
                type: 'defense',
                message: `${monster.name}进入了防御姿态！`
            };
        } else if (monster.special.heal && monster.health < monster.maxHealth * 0.3) {
            const healAmount = Math.floor(monster.maxHealth * 0.3);
            monster.health = Math.min(monster.maxHealth, monster.health + healAmount);
            return {
                type: 'heal',
                message: `${monster.name}恢复了${healAmount}点生命值！`
            };
        }
        return null;
    }

    processBossAbilities(monster) {
        if (monster.special.rageMode && 
            monster.health < monster.maxHealth * 0.5 && 
            !monster.isEnraged) {
            monster.attack = Math.floor(monster.attack * 1.5);
            monster.isEnraged = true;
            return {
                type: 'rage',
                message: `${monster.name}进入了狂暴状态！`
            };
        } else if (monster.special.regeneration) {
            const regenAmount = Math.floor(monster.maxHealth * 0.05);
            monster.health = Math.min(monster.maxHealth, monster.health + regenAmount);
            return {
                type: 'regeneration',
                message: `${monster.name}恢复了${regenAmount}点生命值！`
            };
        }
        return null;
    }
}

export default MonsterSystem; 