import * as mc from '@minecraft/server';
import { PlayerUtils } from '../../utils/index';
import { AmmoManager, ReloadingPlayerManager } from '../managers/index';
import { GunData } from '../guns/data/index';
import { GunReplacer } from './index';

export class Reloader {
    static reload(
        owner: mc.Player,
        ammoManager: AmmoManager,
        gunData: GunData,
        emptyGunItem: mc.ItemStack
    ): void {
        ReloadingPlayerManager.addPlayer(owner);
        this.checkAndStopOnInvalidOwner(owner);
        this.scheduleReload(owner, ammoManager, gunData, emptyGunItem);
    }

    private static checkAndStopOnInvalidOwner(owner: mc.Player): void {
        const intervalId = mc.system.runInterval(() => {
            if (!owner.isValid()) {
                ReloadingPlayerManager.removePlayer(owner);
                mc.system.clearRun(intervalId);
            }
        });
    }

    private static scheduleReload(
        owner: mc.Player,
        ammoManager: AmmoManager,
        gunData: GunData,
        emptyGunItem: mc.ItemStack
    ): void {
        mc.system.runTimeout(() => {
            if (owner == undefined) return;
            if (!PlayerUtils.hasItem(owner, gunData.ammoItemId)) return;
            ReloadingPlayerManager.removePlayer(owner);
            PlayerUtils.clearItem(owner, gunData.ammoItemId, 1);
            ammoManager.setAmmoCount(gunData.capacity);
            GunReplacer.replaceLoadedGun(
                owner,
                emptyGunItem,
                gunData.loadedGunItemId
            );
        }, gunData.reloadTime);
    }
}
