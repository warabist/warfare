import * as mc from '@minecraft/server';
import { Gun } from './types/index';
import { Rifles } from './index';

export class Guns {
    static data: Gun[] = [...Rifles.data];

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
