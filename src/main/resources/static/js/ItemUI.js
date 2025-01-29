class ItemUI {
    constructor(itemSystem) {
        this.itemSystem = itemSystem;
        this.createItemPanel();
    }

    createItemPanel() {
        const panel = document.createElement('div');
        panel.className = 'item-panel';
        document.querySelector('.control-panel').appendChild(panel);
        this.panel = panel;
        this.updateItemPanel();
    }

    updateItemPanel() {
        this.panel.innerHTML = Object.values(this.itemSystem.items)
            .map(item => `
                <button class="item-button ${item.count <= 0 ? 'empty' : ''}"
                        data-item-id="${item.id}"
                        ${item.count <= 0 ? 'disabled' : ''}>
                    ${item.name}
                    <span class="item-count">(${item.count})</span>
                    <span class="item-tooltip">
                        ${item.description}<br>
                        剩余数量: ${item.count}/${item.maxCount}
                    </span>
                </button>
            `).join('');
    }

    showBuffStatus() {
        const activeBuffs = this.itemSystem.getActiveBuffs();
        const buffDisplay = document.getElementById('buffDisplay') || this.createBuffDisplay();
        
        buffDisplay.innerHTML = activeBuffs.map(buff => `
            <div class="buff-item">
                ${buff.type === 'attack' ? '⚔️' : '🛡️'} 
                剩余回合: ${buff.remainingTurns}
            </div>
        `).join('') || '无增益效果';
    }

    createBuffDisplay() {
        const display = document.createElement('div');
        display.id = 'buffDisplay';
        display.className = 'buff-display';
        document.querySelector('.game-info').appendChild(display);
        return display;
    }
}

export default ItemUI; 