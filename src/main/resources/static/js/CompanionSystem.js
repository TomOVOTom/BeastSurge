import { companions } from './CompanionData.js';

class CompanionSystem {
    constructor() {
        this.companions = companions;
        this.activeCompanion = null;
        this.cooldowns = {};
        this.buffs = [];
    }

    unlockCompanion(playerlevel) {
        const newUnlocks = Object.values(this.companions)
            .filter(companion => companion.unlockLevel === playerlevel);
        
        if (newUnlocks.length > 0) {
            return {
                type: 'companion_unlock',
                companions: newUnlocks
            };
        }
        return null;
    }

    setActiveCompanion(companionId) {
        const companion = this.companions[companionId];
        if (companion) {
            this.activeCompanion = {
                ...companion,
                stats: { ...companion.baseStats }
            };
            this.activeCompanion.id = companionId;
            this.cooldowns[companionId] = 0;
            console.log('激活伙伴:', this.activeCompanion); // 添加调试日志
            return true;
        }
        return false;
    }

    useCompanionAbility(player, enemy) {
        if (!this.activeCompanion) {
            return { success: false, message: '没有激活的伙伴' };
        }

        const companionId = this.activeCompanion.id;
        console.log('使用伙伴技能前状态:', {
            companionId,
            playerStats: {
                attack: player.attack,
                defense: player.defense
            },
            currentBuffs: this.buffs
        });

        if (this.cooldowns[companionId] > 0) {
            return { 
                success: false, 
                message: `${this.activeCompanion.name}还需要${this.cooldowns[companionId]}回合才能再次使用技能`
            };
        }

        try {
            const result = this.activeCompanion.ability.execute(player, this.activeCompanion.stats);
            
            // 立即应用效果
            switch (result.type) {
                case 'heal':
                    const healAmount = Math.min(player.maxHealth - player.health, result.value);
                    player.health = Math.min(player.maxHealth, player.health + healAmount);
                    result.message = `${this.activeCompanion.name}发动${this.activeCompanion.ability.name}，恢复了${healAmount}点生命值！`;
                    break;
                
                case 'attack':
                    const damage = result.value;
                    enemy.health = Math.max(0, enemy.health - damage);
                    result.message = `${this.activeCompanion.name}发动${this.activeCompanion.ability.name}，对敌人造成了${damage}点伤害！`;
                    break;
                
                case 'buff':
                    this.addBuff(player, {
                        stat: result.stat,
                        value: result.value,
                        duration: result.duration,
                        source: this.activeCompanion.name
                    });
                    result.message = `${this.activeCompanion.name}发动${this.activeCompanion.ability.name}，${result.stat === 'attack' ? '攻击力' : '防御力'}提升了${result.value}点！`;
                    break;
            }

            // 设置冷却时间
            this.cooldowns[companionId] = this.activeCompanion.stats.cooldown;

            console.log('使用伙伴技能后状态:', {
                playerStats: {
                    attack: player.attack,
                    defense: player.defense
                },
                currentBuffs: this.buffs
            });

            return { 
                success: true, 
                message: result.message
            };
        } catch (error) {
            console.error('伙伴技能执行错误:', error);
            return {
                success: false,
                message: '技能执行出错'
            };
        }
    }

    addBuff(player, buff) {
        console.log('添加buff前状态:', {
            playerStats: {
                attack: player.attack,
                defense: player.defense
            },
            currentBuffs: this.buffs
        });

        // 移除同类型的旧buff
        const existingBuff = this.buffs.find(b => b.stat === buff.stat);
        if (existingBuff) {
            player[buff.stat] -= existingBuff.value;
            this.buffs = this.buffs.filter(b => b.stat !== buff.stat);
            console.log('移除旧buff:', {
                removedBuff: existingBuff,
                newStats: {
                    attack: player.attack,
                    defense: player.defense
                }
            });
        }
        
        // 添加新buff
        const newBuff = {
            stat: buff.stat,
            value: buff.value,
            remainingTurns: buff.duration,
            source: buff.source
        };
        this.buffs.push(newBuff);
        
        // 应用buff效果
        player[buff.stat] += buff.value;
        
        console.log('添加buff后状态:', {
            addedBuff: newBuff,
            playerStats: {
                attack: player.attack,
                defense: player.defense
            },
            currentBuffs: this.buffs
        });
    }

    updateBuffsAndCooldowns(player) {
        console.log('更新buff前状态:', {
            playerStats: {
                attack: player.attack,
                defense: player.defense
            },
            currentBuffs: this.buffs
        });

        // 更新增益效果
        const expiredBuffs = [];
        const activeBuffs = [];

        this.buffs.forEach(buff => {
            buff.remainingTurns--;
            if (buff.remainingTurns <= 0) {
                expiredBuffs.push(buff);
            } else {
                activeBuffs.push(buff);
            }
        });

        // 移除过期的buff效果
        expiredBuffs.forEach(buff => {
            player[buff.stat] -= buff.value;
            console.log(`Buff已过期: ${buff.source}的${buff.stat}效果 -${buff.value}`);
        });

        this.buffs = activeBuffs;

        console.log('更新buff后状态:', {
            playerStats: {
                attack: player.attack,
                defense: player.defense
            },
            currentBuffs: this.buffs
        });

        // 更新冷却时间
        Object.keys(this.cooldowns).forEach(companionId => {
            if (this.cooldowns[companionId] > 0) {
                this.cooldowns[companionId]--;
                console.log(`${this.companions[companionId].name} 冷却时间: ${this.cooldowns[companionId]}`);
            }
        });
    }

    getActiveCompanionInfo() {
        if (!this.activeCompanion) return null;

        return {
            name: this.activeCompanion.name,
            type: this.activeCompanion.type,
            description: this.activeCompanion.description,
            ability: this.activeCompanion.ability.name,
            cooldown: this.cooldowns[this.activeCompanion.id],
            buffs: this.buffs.map(buff => ({
                ...buff,
                icon: buff.stat === 'attack' ? '⚔️' : '🛡️'
            }))
        };
    }

    getAllCompanions() {
        return Object.values(this.companions);
    }
}

export default CompanionSystem; 