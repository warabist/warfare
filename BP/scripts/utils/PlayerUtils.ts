import * as mc from '@minecraft/server';

export class PlayerUtils {
    static hasItem(
        player: mc.Player,
        itemId: string,
        quantity: number = 1
    ): boolean {
        return quantity <= this.getCountHasItem(player, itemId);
    }

    static getCountHasItem(player: mc.Player, itemId: string): number {
        const { container } = player.getComponent(
            mc.EntityComponentTypes.Inventory
        ) as mc.EntityInventoryComponent;
        if (container == undefined) return 0;

        let count = 0;
        for (let i = 0; i < container.size; i++) {
            const slot = container.getSlot(i);
            if (!slot.hasItem()) continue;
            if (slot.typeId === itemId) count += slot.amount;
        }
        return count;
    }

    static clearItem(
        player: mc.Player,
        itemId: string,
        count: number = 10000000
    ): void {
        const { container } = player.getComponent(
            mc.EntityComponentTypes.Inventory
        ) as mc.EntityInventoryComponent;
        if (container == undefined) return;

        for (let i = 0; i < container.size; i++) {
            const slot = container.getSlot(i);
            if (slot.typeId !== itemId) continue;
            while (slot.hasItem() && count > 0) {
                if (slot.amount === 1) {
                    slot.setItem();
                } else {
                    slot.amount--;
                }
                count--;
            }
            if (this.getCountHasItem(player, itemId) === 0 || count === 0) break;
        }
    }
}
