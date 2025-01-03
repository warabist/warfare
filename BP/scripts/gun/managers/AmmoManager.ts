import * as mc from '@minecraft/server';
import { GunReplacer } from '../utils/index';

/**
 * 銃の残弾を管理
 */
export class AmmoManager {
    /**
     * @remarks
     * 銃のItemStack
     * loaded_gun、empty_gunだとかは関係なし
     */
    private gunItem: mc.ItemStack;
    /**
     * @remarks
     * 銃の所有者
     */
    private owner: mc.Player;
    /**
     * @remarks
     * 銃のid
     */
    private gunId: string;

    constructor(gunItem: mc.ItemStack, owner: mc.Player) {
        this.gunItem = gunItem;
        this.owner = owner;
        this.gunId = gunItem.getDynamicProperty('gunId') as string;
    }

    /**
     * @remarks
     * 銃の残弾数を調べる
     * @returns
     * 銃の残弾数を返す
     */
    getAmmoCount(): number {
        return mc.world.getDynamicProperty(this.gunId) as number;
    }

    /**
     * @remarks
     * 銃の残弾数をセットする
     * @param count
     * 銃の残弾数はこの数になる
     */
    setAmmoCount(count: number): void {
        mc.world.setDynamicProperty(this.gunId, count);
    }

    /**
     * @remarks
     * 銃の残弾数を増やす
     * @param count
     * この数分だけ増える
     */
    addAmmoCount(count: number): void {
        this.setAmmoCount(this.getAmmoCount() + count);
    }

    /**
     * @remarks
     * 銃の残弾数を減らす
     * @param count 
     * この数分だけ減る
     * @param emptyGunItemId
     * 空の銃アイテムのtypeId
     */
    removeAmmoCount(count: number, emptyGunItemId: string): void {
        const newCount = this.getAmmoCount() - count;
        this.setAmmoCount(newCount);
        if (newCount <= 0) {
            GunReplacer.replaceEmptyGun(this.owner, this.gunItem, emptyGunItemId);
        }
    }
}
