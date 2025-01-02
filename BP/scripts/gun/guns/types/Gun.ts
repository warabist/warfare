import * as mc from '@minecraft/server';
import { SubscriberAdapter } from '../../../adapters/index';
import { GunData } from '../data/index';
import { AmmoManager, ReloadingPlayerManager } from '../../managers/index';
import { ProjectileShooter, PlayerUtils } from '../../../utils/index';
import { Reloader } from '../../utils/index';

export abstract class Gun extends SubscriberAdapter {
    abstract data: GunData;

    register(): void {
        this.subscribeEvent();
    }

    protected shoot(ammoManager: AmmoManager, owner: mc.Player): void {
        ProjectileShooter.shoot(owner, this.data.bulletProjectileId, {
            power: this.data.power,
            uncertainty: this.data.uncertainty,
        });
        ammoManager.removeAmmoCount(1, this.data.emptyGunItemId);
    }

    protected reload(
        ammoManager: AmmoManager,
        eventData: mc.ItemUseBeforeEvent
    ): void {
        const owner = eventData.source;
        if (
            !PlayerUtils.hasItem(owner, this.data.ammoItemId) ||
            ReloadingPlayerManager.isPlayerReloading(owner)
        ) {
            eventData.cancel = true;
            return;
        }
        Reloader.reload(owner, ammoManager, this.data, eventData.itemStack);
    }
}
