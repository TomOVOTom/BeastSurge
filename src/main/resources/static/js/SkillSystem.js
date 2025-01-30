class SkillSystem {
    constructor() {
        this.skills = {
            heavyStrike: {
                id: 'heavyStrike',
                name: '重击',
                description: '造成150%的攻击伤害',
                unlockLevel: 1,
                cooldown: 3,
                currentCooldown: 0,
                unlocked: true,
                execute: (gameCore) => {
                    const damage = Math.floor(gameCore.player.attack * 1.5);
                    gameCore.currentEnemy.health -= damage;
                    return {
                        damage,
                        message: `使用重击，造成 ${damage} 点伤害！`
                    };
                }
            },
            heal: {
                id: 'heal',
                name: '治疗',
                description: '恢复30%最大生命值',
                unlockLevel: 1,
                cooldown: 4,
                currentCooldown: 0,
                unlocked: true,
                execute: (gameCore) => {
                    const healAmount = Math.floor(gameCore.player.maxHealth * 0.3);
                    gameCore.player.health = Math.min(
                        gameCore.player.health + healAmount,
                        gameCore.player.maxHealth
                    );
                    return {
                        healAmount,
                        message: `使用治疗，恢复 ${healAmount} 点生命值！`
                    };
                }
            },
            rage: {
                id: 'rage',
                name: '狂暴',
                description: '提升50%攻击力，持续3回合',
                unlockLevel: 3,
                cooldown: 5,
                currentCooldown: 0,
                duration: 3,
                execute: (gameCore) => {
                    const buffAmount = Math.floor(gameCore.player.attack * 0.5);
                    gameCore.player.attack += buffAmount;
                    return {
                        buffAmount,
                        duration: 3,
                        type: 'attack',
                        message: `进入狂暴状态，攻击力提升 ${buffAmount} 点！`
                    };
                }
            },
            doubleStrike: {
                id: 'doubleStrike',
                name: '连击',
                description: '快速攻击两次，每次造成80%的攻击伤害',
                unlockLevel: 4,
                cooldown: 4,
                currentCooldown: 0,
                execute: (gameCore) => {
                    const damage = Math.floor(gameCore.player.attack * 0.8);
                    const totalDamage = damage * 2;
                    gameCore.currentEnemy.health -= totalDamage;
                    return {
                        damage: totalDamage,
                        message: `使用连击，连续攻击两次，总共造成 ${totalDamage} 点伤害！`
                    };
                }
            },
            ironSkin: {
                id: 'ironSkin',
                name: '铁甲',
                description: '提升100%防御力，持续2回合',
                unlockLevel: 5,
                cooldown: 5,
                currentCooldown: 0,
                duration: 2,
                execute: (gameCore) => {
                    const buffAmount = gameCore.player.defense;
                    gameCore.player.defense += buffAmount;
                    return {
                        buffAmount,
                        duration: 2,
                        type: 'defense',
                        message: `激活铁甲，防御力提升 ${buffAmount} 点！`
                    };
                }
            },
            lifeSteal: {
                id: 'lifeSteal',
                name: '生命汲取',
                description: '造成100%攻击伤害，并回复造成伤害50%的生命值',
                unlockLevel: 6,
                cooldown: 4,
                currentCooldown: 0,
                execute: (gameCore) => {
                    const damage = gameCore.player.attack;
                    const healAmount = Math.floor(damage * 0.5);
                    gameCore.currentEnemy.health -= damage;
                    gameCore.player.health = Math.min(
                        gameCore.player.health + healAmount,
                        gameCore.player.maxHealth
                    );
                    return {
                        damage,
                        healAmount,
                        message: `使用生命汲取，造成 ${damage} 点伤害并恢复 ${healAmount} 点生命值！`
                    };
                }
            },
            execute: {
                id: 'execute',
                name: '处决',
                description: '对生命值低于30%的敌人造成300%攻击伤害',
                unlockLevel: 7,
                cooldown: 6,
                currentCooldown: 0,
                execute: (gameCore) => {
                    const isLowHealth = gameCore.currentEnemy.health < (gameCore.currentEnemy.maxHealth * 0.3);
                    const damage = isLowHealth ? 
                        Math.floor(gameCore.player.attack * 3) : 
                        gameCore.player.attack;
                    gameCore.currentEnemy.health -= damage;
                    return {
                        damage,
                        message: isLowHealth ? 
                            `使用处决，造成致命一击 ${damage} 点伤害！` :
                            `使用处决，造成 ${damage} 点伤害`
                    };
                }
            }
        };

        this.activeBuffs = [];
    }

    updateCooldowns() {
        Object.values(this.skills).forEach(skill => {
            if (skill.currentCooldown > 0) {
                skill.currentCooldown--;
            }
        });
    }

    useSkill(skillId, gameCore) {
        const skill = this.skills[skillId];
        if (!skill || !skill.unlocked) {
            return { success: false, message: '技能未解锁' };
        }
        
        if (skill.currentCooldown > 0) {
            return { success: false, message: `技能冷却中 (剩余 ${skill.currentCooldown} 回合)` };
        }

        const result = skill.execute(gameCore);
        skill.currentCooldown = skill.cooldown;
        return { success: true, ...result };
    }

    checkSkillUnlocks(playerLevel) {
        let newUnlock = null;
        Object.values(this.skills).forEach(skill => {
            if (!skill.unlocked && skill.unlockLevel && playerLevel >= skill.unlockLevel) {
                skill.unlocked = true;
                newUnlock = skill;
            }
        });
        return newUnlock ? { newUnlock } : null;
    }
}

export default SkillSystem; 