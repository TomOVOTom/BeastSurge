class SkillSystem {
    constructor() {
        this.skills = {
            heavyStrike: {
                id: 'heavyStrike',
                name: '重击',
                description: '造成200%的攻击力伤害',
                cooldown: 3,
                currentCooldown: 0,
                unlocked: true,
                execute: (gameCore) => {
                    const damage = gameCore.player.attack * 2;
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
                cooldown: 5,
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
            doubleStrike: {
                id: 'doubleStrike',
                name: '连击',
                description: '快速攻击两次，每次造成80%的攻击力伤害',
                cooldown: 4,
                currentCooldown: 0,
                unlocked: false,
                requiredLevel: 5,
                execute: (gameCore) => {
                    const damage = Math.floor(gameCore.player.attack * 0.8);
                    const totalDamage = damage * 2;
                    gameCore.currentEnemy.health -= totalDamage;
                    return {
                        damage: totalDamage,
                        message: `使用连击，造成两次 ${damage} 点伤害，总计 ${totalDamage} 点伤害！`
                    };
                }
            }
        };
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
        Object.values(this.skills).forEach(skill => {
            if (!skill.unlocked && skill.requiredLevel && playerLevel >= skill.requiredLevel) {
                skill.unlocked = true;
                return { newUnlock: skill };
            }
        });
        return null;
    }
}

export default SkillSystem; 