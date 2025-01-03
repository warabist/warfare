import * as mc from '@minecraft/server';
import { ContainerUtils } from '../../utils/index';
import { AmmoManager, ReloadingPlayerManager } from '../managers/index';
import { GunData } from '../guns/data/index';
import { GunReplacer } from './index';

/**
 * リロードさせる
 */
export class Reloader {
    /**
     * @remarks
     * 銃をリロードする
     * @param owner
     * 銃の所有者
     * @param ammoManager
     * リロードしたい銃のammoManager
     * @param gunData
     * リロードしたい銃のデータ
     * @param emptyGunItem
     * 弾切れした銃のItemStack
     */
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

    /**
     * @remarks
     * リロードしているプレイヤーがscriptから操作不可能になればリロードを中止
     * @param owner
     * 銃の所有者
     */
    private static checkAndStopOnInvalidOwner(owner: mc.Player): void {
        const intervalId = mc.system.runInterval(() => {
            if (!owner.isValid()) {
                ReloadingPlayerManager.removePlayer(owner);
                mc.system.clearRun(intervalId);
            }
        });
    }

    /**
     * @remarks
     * リロードを始める
     * @param owner 
     * 銃の所有者
     * @param ammoManager
     * リロードしたい銃のammoManager
     * @param gunData
     * リロードしたい銃のデータ
     * @param emptyGunItem
     * 弾切れした銃のItemStack
     */
    private static scheduleReload(
        owner: mc.Player,
        ammoManager: AmmoManager,
        gunData: GunData,
        emptyGunItem: mc.ItemStack
    ): void {
        mc.system.runTimeout(() => {
            if (owner == undefined) return;
            const { container } = owner.getComponent(mc.EntityComponentTypes.Inventory) as mc.EntityInventoryComponent;
            if (!ContainerUtils.hasItem(container, gunData.ammoItemId)) return;
            ReloadingPlayerManager.removePlayer(owner);
            ContainerUtils.clearItem(container, gunData.ammoItemId, 1);
            ammoManager.setAmmoCount(gunData.capacity);
            GunReplacer.replaceLoadedGun(
                owner,
                emptyGunItem,
                gunData.loadedGunItemId
            );
        }, gunData.reloadTime);
    }
}
