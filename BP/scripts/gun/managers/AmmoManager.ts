import * as mc from '@minecraft/server';
import { GunReplacer } from '../utils/index';

export class AmmoManager {
    private gunItem: mc.ItemStack;
    private owner: mc.Player;
    private gunId: string;

    constructor(gunItem: mc.ItemStack, owner: mc.Player) {
        this.gunItem = gunItem;
        this.owner = owner;
        this.gunId = gunItem.getDynamicProperty('gunId') as string;
    }

    getAmmoCount(): number {
        return mc.world.getDynamicProperty(this.gunId) as number;
    }

    setAmmoCount(count: number): void {
        mc.world.setDynamicProperty(this.gunId, count);
    }

    addAmmoCount(count: number): void {
        this.setAmmoCount(this.getAmmoCount() + count);
    }

    removeAmmoCount(count: number, emptyGunItemId: string): void {
        const newCount = this.getAmmoCount() - count;
        this.setAmmoCount(newCount);
        if (newCount <= 0) {
            GunReplacer.replaceEmptyGun(this.owner, this.gunItem, emptyGunItemId);
        }
    }
}
