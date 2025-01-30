export const monsters = {
    // 普通怪物
    wolf: {
        name: '野狼',
        type: 'normal',
        baseHealth: 30,
        baseAttack: 8,
        description: '常见的野兽，攻击力适中',
        expValue: 20
    },
    bear: {
        name: '狂暴熊',
        type: 'normal',
        baseHealth: 50,
        baseAttack: 12,
        description: '皮糙肉厚的野兽，生命值较高',
        expValue: 25
    },
    tiger: {
        name: '魔化虎',
        type: 'normal',
        baseHealth: 40,
        baseAttack: 15,
        description: '迅捷的猛兽，攻击力较高',
        expValue: 30
    },

    // 精英怪物
    darkWolf: {
        name: '暗影狼王',
        type: 'elite',
        baseHealth: 80,
        baseAttack: 20,
        description: '狼群的首领，具有额外的防御能力',
        expValue: 50,
        special: {
            defense: 8,
            ability: '每三回合获得一次减伤效果'
        }
    },
    giantBear: {
        name: '远古巨熊',
        type: 'elite',
        baseHealth: 120,
        baseAttack: 25,
        description: '体型巨大的远古生物，生命值极高',
        expValue: 60,
        special: {
            heal: true,
            ability: '生命值低于30%时会恢复30%最大生命值'
        }
    },

    // Boss怪物
    dragonWolf: {
        name: '龙血狼',
        type: 'boss',
        baseHealth: 200,
        baseAttack: 35,
        description: '融合了龙之血脉的狼王，具有毁灭性的力量',
        expValue: 100,
        special: {
            rageMode: true,
            ability: '生命值低于50%时进入狂暴状态，攻击力提升50%'
        }
    },
    demonBear: {
        name: '魔化巨熊',
        type: 'boss',
        baseHealth: 250,
        baseAttack: 30,
        description: '被魔气侵蚀的巨熊，拥有恐怖的再生能力',
        expValue: 120,
        special: {
            regeneration: true,
            ability: '每回合恢复5%最大生命值'
        }
    }
};

export const waveSettings = {
    normalWaves: {
        pool: ['wolf', 'bear', 'tiger'],
        levelMultiplier: 0.5
    },
    eliteWaves: {
        pool: ['darkWolf', 'giantBear'],
        startWave: 5,
        frequency: 5,
        levelMultiplier: 0.7
    },
    bossWaves: {
        pool: ['dragonWolf', 'demonBear'],
        startWave: 10,
        frequency: 10,
        levelMultiplier: 1
    }
}; 