import * as mc from '@minecraft/server';
import { SubscriberAdapter } from '../../../adapters/index';
import { GunData } from '../data/index';
import { AmmoManager, ReloadingPlayerManager } from '../../managers/index';
import { ProjectileShooter, ContainerUtils } from '../../../utils/index';
import { Reloader } from '../../utils/index';

/**
 * 銃の基盤
 */
export abstract class Gun extends SubscriberAdapter {
    /**
     * @remarks
     * 銃のデータを保管
     */
    abstract data: GunData;

    /**
     * @remarks
     * 銃を登録する
     */
    register(): void {
        this.subscribeEvent();
    }

    /**
     * @remarks
     * 発射処理
     * 一発
     * @param ammoManager
     * 銃のammoManager
     * @param owner
     * 銃の所有者
     */
    protected shoot(ammoManager: AmmoManager, owner: mc.Player): void {
        ProjectileShooter.shoot(owner, this.data.bulletProjectileId, {
            power: this.data.power,
            uncertainty: this.data.uncertainty,
        });
        ammoManager.removeAmmoCount(1, this.data.emptyGunItemId);
    }

    /**
     * @remarks
     * リロード処理
     * @param ammoManager
     * 銃のammoManager
     * @param eventData
     * アイテムを使ったイベントのデータ
     * キャンセルしたいのでbeforeeventを
     */
    protected reload(
        ammoManager: AmmoManager,
        eventData: mc.ItemUseBeforeEvent
    ): void {
        const owner = eventData.source;
        const { container } = owner.getComponent(mc.EntityComponentTypes.Inventory) as mc.EntityInventoryComponent;
        if (
            !ContainerUtils.hasItem(container, this.data.ammoItemId) ||
            ReloadingPlayerManager.isPlayerReloading(owner)
        ) {
            eventData.cancel = true;
            return;
        }
        Reloader.reload(owner, ammoManager, this.data, eventData.itemStack);
    }
}
