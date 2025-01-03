import * as mc from '@minecraft/server';
import { Gun } from './types/index';
import { Rifles } from './index';

/**
 * 銃のリスト
 */
export class Guns {
    static data: Gun[] = [...Rifles.data];

    /**
     * @remarks
     * ItemStackから銃を取得する
     * @param itemStack
     * 判定したいプレイヤー
     * @returns
     * アイテムが銃であればその種類を返す
     * 銃でなければundefinedを返す
     */
    static get(itemStack: mc.ItemStack): Gun | undefined {
        const typeId = itemStack.typeId;
        for (let i = 0; i < this.data.length; i++) {
            const currentGun = this.data[i];
            if ((typeId === currentGun.data.emptyGunItemId) || (typeId === currentGun.data.loadedGunItemId)) {
                return currentGun;
            } else {
                continue;
            }
        }
    }
}
