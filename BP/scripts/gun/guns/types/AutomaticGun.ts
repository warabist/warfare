import * as mc from '@minecraft/server';
import { Gun } from './index';
import { AmmoManager } from '../../managers/index';
import { AutomaticGunData } from '../data/index';

export class AutomaticGun extends Gun {
    data: AutomaticGunData;
    protected usedItemPlayerIds: Set<string>;
    protected autoShootIntervalIdMap: Map<string, number>;

    constructor(data: AutomaticGunData) {
        super();
        this.data = data;
        this.usedItemPlayerIds = new Set();
        this.autoShootIntervalIdMap = new Map();
    }

    override onBeforeUseItem(eventData: mc.ItemUseBeforeEvent): void {
        const { itemStack, source } = eventData;

        //イベント連続発火での複数回実行防止
        if (this.usedItemPlayerIds.has(source.id)) {
            return;
        } else {
            this.usedItemPlayerIds.add(source.id);
        }

        const ammoManager = new AmmoManager(itemStack, source);
        switch (itemStack.typeId) {
            case this.data.loadedGunItemId: {
                this.startAutoShoot(ammoManager, source);
                break;
            }
            case this.data.emptyGunItemId: {
                this.reload(ammoManager, eventData);
                break;
            }
        }
    }

    override onAfterStopUseItem(eventData: mc.ItemStopUseAfterEvent): void {
        const { itemStack, source } = eventData;

        //onUseItemBeforeイベント連続発火での複数回実行防止
        if (this.usedItemPlayerIds.has(source.id)) {
            this.usedItemPlayerIds.delete(source.id);
        }

        if (itemStack?.typeId === this.data.loadedGunItemId) {
            this.clearAutoShootInterval(source);
        }
    }

    protected startAutoShoot(ammoManager: AmmoManager, owner: mc.Player): void {
        mc.system.run(() => {
            this.shoot(ammoManager, owner); //shootingが始まった瞬間にshootする これが無いと一番初めのshootはrate後になる
            const autoShootIntervalId = mc.system.runInterval(() => {
                if (!owner.isValid() || ammoManager.getAmmoCount() === 0) {
                    this.clearAutoShootInterval(owner);
                    return;
                }
                this.shoot(ammoManager, owner);
            }, this.data.rate);
            this.registerAutoShootInterval(owner, autoShootIntervalId);
        });
    }

    protected clearAutoShootInterval(owner: mc.Player): void {
        mc.system.clearRun(this.autoShootIntervalIdMap.get(owner.id) ?? 0);
    }

    protected registerAutoShootInterval(owner: mc.Player, intervalId: number): void {
        this.autoShootIntervalIdMap.set(owner.id, intervalId);
    }
}
