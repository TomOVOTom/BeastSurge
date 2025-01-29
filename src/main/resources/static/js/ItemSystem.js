class ItemSystem {
    constructor() {
        this.items = {
            healthPotion: {
                id: 'healthPotion',
                name: '生命药水',
                description: '恢复50%最大生命值',
                count: 3,
                maxCount: 5,
                execute: (gameCore) => {
                    const healAmount = Math.floor(gameCore.player.maxHealth * 0.5);
                    gameCore.player.health = Math.min(
                        gameCore.player.health + healAmount,
                        gameCore.player.maxHealth
                    );
                    return {
                        healAmount,
                        message: `使用生命药水，恢复 ${healAmount} 点生命值！`
                    };
                }
            },
            strengthPotion: {
                id: 'strengthPotion',
                name: '力量药水',
                description: '在接下来的3回合内，攻击力提升50%',
                count: 2,
                maxCount: 3,
                duration: 3,
                execute: (gameCore) => {
                    const buffAmount = Math.floor(gameCore.player.attack * 0.5);
                    gameCore.player.attack += buffAmount;
                    return {
                        buffAmount,
                        duration: 3,
                        type: 'attack',
                        message: `使用力量药水，攻击力提升 ${buffAmount} 点，持续3回合！`
                    };
                }
            },
            defensePotion: {
                id: 'defensePotion',
                name: '防御药水',
                description: '在接下来的3回合内，防御力提升100%',
                count: 2,
                maxCount: 3,
                duration: 3,
                execute: (gameCore) => {
                    const buffAmount = gameCore.player.defense;
                    gameCore.player.defense += buffAmount;
                    return {
                        buffAmount,
                        duration: 3,
                        type: 'defense',
                        message: `使用防御药水，防御力提升 ${buffAmount} 点，持续3回合！`
                    };
                }
            }
        };

        this.activeBuffs = [];
    }

    useItem(itemId, gameCore) {
        const item = this.items[itemId];
        if (!item || item.count <= 0) {
            return { success: false, message: '道具数量不足' };
        }

        item.count--;
        const result = item.execute(gameCore);

        if (result.duration) {
            this.activeBuffs.push({
                id: itemId,
                type: result.type,
                amount: result.buffAmount,
                remainingTurns: result.duration
            });
        }

        return { success: true, ...result };
    }

    updateBuffs(gameCore) {
        this.activeBuffs = this.activeBuffs.filter(buff => {
            buff.remainingTurns--;
            if (buff.remainingTurns <= 0) {
                // 移除buff效果
                if (buff.type === 'attack') {
                    gameCore.player.attack -= buff.amount;
                } else if (buff.type === 'defense') {
                    gameCore.player.defense -= buff.amount;
                }
                return false;
            }
            return true;
        });
    }

    addItem(itemId, amount = 1) {
        const item = this.items[itemId];
        if (item) {
            item.count = Math.min(item.count + amount, item.maxCount);
            return true;
        }
        return false;
    }

    getActiveBuffs() {
        return this.activeBuffs;
    }
}

export default ItemSystem; 