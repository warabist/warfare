import * as mc from '@minecraft/server';

/**
 * コンテナの補助
 */
export class ContainerUtils {
    /**
     * @remarks
     * セレクター引数のhasitemの簡易版
     * @param container
     * 確認したいコンテナ
     * @param itemId
     * 持っているかを確認したいアイテムのtypeId
     * @param quantity
     * 最低いくつ持っていればいいか
     * デフォルトで1
     * @returns
     * コンテナがアイテムを指定した数持っているか返す
     */
    static hasItem(
        container: mc.Container,
        itemId: string,
        quantity: number = 1
    ): boolean {
        return quantity <= this.getCountHasItem(container, itemId);
    }

    /**
     * @remarks
     * コンテナが指定したアイテムをいくつ持っているかが分かる
     * @param container 
     * 確認したいコンテナ
     * @param itemId
     * 持っているかを確認したいアイテムのtypeId
     * @returns
     * コンテナがitemIdのアイテムをいくつ持っているかを返す
     */
    static getCountHasItem(container: mc.Container, itemId: string): number {
        let count = 0;
        for (let i = 0; i < container.size; i++) {
            const slot = container.getSlot(i);
            if (!slot.hasItem()) continue;
            if (slot.typeId === itemId) count += slot.amount;
        }
        return count;
    }

    /**
     * @remarks
     * clearコマンドの簡易版
     * @param container
     * アイテムを消したいコンテナ
     * @param itemId
     * コンテナから消したいアイテムのtypeId
     * @param count
     * コンテナから消す数
     */
    static clearItem(
        container: mc.Container,
        itemId: string,
        count: number = 10000000
    ): void {
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
            if (this.getCountHasItem(container, itemId) === 0 || count === 0) break;
        }
    }
}
