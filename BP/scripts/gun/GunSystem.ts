import * as mc from '@minecraft/server';
import { UuidGenerator } from '../utils/index';
import { AmmoManager } from './managers/index';
import { Guns } from './guns/index';

/**
 * 銃のシステム
 */
export class GunSystem {
    constructor() { }

    /**
     * @remarks
     * システムを開始
     */
    start(): void {
        this.registerGuns();
        this.initInterval();
    }

    /**
     * @remarks
     * 銃を登録
     */
    private registerGuns(): void {
        for (const gun of Guns.data) {
            gun.register();
        }
    }

    /**
     * @remarks
     * 繰り返し処理を初期化
     */
    private initInterval(): void {
        mc.system.runInterval(() => {
            this.processAllPlayers(this.playGunHoldAnimation);
            this.processAllPlayers(this.showGunAmmoCount);
        });
        mc.system.runInterval(() => {
            this.processAllPlayers(this.setGunIdToGunItem);
        }, 2);
    }

    /**
     * @remarks
     * 全プレイヤーに処理を行う
     * @param callback
     * プレイヤーごとに行う処理
     */
    private processAllPlayers(callback: (player: mc.Player) => void): void {
        for (const player of mc.world.getPlayers()) {
            callback(player);
        }
    }

    /**
     * @remarks
     * プレイヤーに銃を持った時のアニメーションを再生
     */
    private playGunHoldAnimation(player: mc.Player): void {
        const equippable = player.getComponent(
            mc.EntityComponentTypes.Equippable
        ) as mc.EntityEquippableComponent;
        const mainhandItem = equippable.getEquipment(mc.EquipmentSlot.Mainhand);
        if (!mainhandItem?.getTags().includes('warfare_gun')) return;

        player.playAnimation('animation.player.crossbow_hold', {
            stopExpression:
                "!query.equipped_item_any_tag('slot.weapon.mainhand', 'warfare_gun')",
        });
    }

    /**
     * @remarks
     * プレイヤーに手に持っている銃の残段数を表示
     */
    private showGunAmmoCount(player: mc.Player): void {
        const equippable = player.getComponent(mc.EntityComponentTypes.Equippable) as mc.EntityEquippableComponent;
        const mainhandSlot = equippable.getEquipmentSlot(mc.EquipmentSlot.Mainhand);
        if (!mainhandSlot.hasItem()) return;
        const mainhandItem = mainhandSlot.getItem();
        if (!mainhandItem.getTags().includes('warfare_gun')) return;
        const ammoCount = new AmmoManager(mainhandItem, player).getAmmoCount();
        const capacity = Guns.get(mainhandItem)?.data.capacity;
        player.onScreenDisplay.setActionBar(`§l§6 ${ammoCount} / ${capacity}`);
    }

    /**
     * @remarks
     * プレイヤーが手に持っている銃にidがなければidをつける
     */
    private setGunIdToGunItem(player: mc.Player): void {
        const { container } = player.getComponent(
            mc.EntityComponentTypes.Inventory
        ) as mc.EntityInventoryComponent;
        if (container == undefined) return;
        for (let i = 0; i < container.size; i++) {
            const slot = container.getSlot(i);
            if (!slot.hasItem()) return;
            const item = slot.getItem();
            if (item.isStackable) return;
            if (
                !item.getDynamicPropertyIds().includes('gunId') &&
                item.getTags().includes('warfare_gun')
            ) {
                item.setDynamicProperty('gunId', UuidGenerator.generate());
                new AmmoManager(item, player).setAmmoCount(0);
                slot.setItem(item);
            }
        }
    }
}
