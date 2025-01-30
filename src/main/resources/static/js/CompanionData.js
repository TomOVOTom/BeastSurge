export const companions = {
    // 治疗型伙伴
    fairy: {
        id: 'fairy',
        name: '治愈精灵',
        type: 'healer',
        description: '善良的精灵，能为主人恢复生命力',
        baseStats: {
            healPower: 20,
            cooldown: 3
        },
        unlockLevel: 3,
        ability: {
            name: '治愈之光',
            description: '恢复主人一定生命值',
            execute: (player, stats) => ({
                type: 'heal',
                value: stats.healPower
            })
        }
    },

    // 攻击型伙伴
    phoenix: {
        id: 'phoenix',
        name: '火焰凤凰',
        type: 'attacker',
        description: '永生不死的神鸟，能对敌人造成额外伤害',
        baseStats: {
            attackPower: 30,
            cooldown: 4
        },
        unlockLevel: 5,
        ability: {
            name: '凤凰之怒',
            description: '对敌人造成额外伤害',
            execute: (player, stats) => ({
                type: 'attack',
                value: stats.attackPower
            })
        }
    },

    // 增益型伙伴
    dragon: {
        id: 'dragon',
        name: '幼龙',
        type: 'buffer',
        description: '年幼的龙，能为主人提供力量增益',
        baseStats: {
            buffPower: 10,
            duration: 2,
            cooldown: 5
        },
        unlockLevel: 7,
        ability: {
            name: '龙之力',
            description: '暂时提升主人的攻击力',
            execute: (player, stats) => ({
                type: 'buff',
                stat: 'attack',
                value: stats.buffPower,
                duration: stats.duration
            })
        }
    },

    // 防御型伙伴
    golem: {
        id: 'golem',
        name: '石头傀儡',
        type: 'defender',
        description: '忠诚的守护者，能为主人提供防御增益',
        baseStats: {
            defensePower: 15,
            duration: 2,
            cooldown: 4
        },
        unlockLevel: 6,
        ability: {
            name: '岩石护盾',
            description: '暂时提升主人的防御力',
            execute: (player, stats) => ({
                type: 'buff',
                stat: 'defense',
                value: stats.defensePower,
                duration: stats.duration
            })
        }
    }
}; 