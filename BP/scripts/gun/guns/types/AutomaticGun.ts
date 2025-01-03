import * as mc from '@minecraft/server';
import { Gun } from './index';
import { AmmoManager } from '../../managers/index';
import { AutomaticGunData } from '../data/index';

/**
 * 長押しで自動発射する銃
 */
export class AutomaticGun extends Gun {
    /**
     * @remarks
     * 銃のデータ
     */
    data: AutomaticGunData;
    /**
     * @remarks
     * アイテムを使用したプレイヤーのidリスト
     * beforeでの連続発火防止用に使われる
     */
    protected usedItemPlayerIds: Set<string>;
    /**
     * @remarks
     * 自動発射インターバルのマップ
     * [使用者のid, インターバルid]という並び
     */
    protected autoShootIntervalIdMap: Map<string, number>;

    constructor(data: AutomaticGunData) {
        super();
        this.data = data;
        this.usedItemPlayerIds = new Set();
        this.autoShootIntervalIdMap = new Map();
    }

    /**
     * @remarks
     * アイテムを使用した際の処理
     * @param eventData
     * イベントのデータ
     */
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

    /**
     * @remarks
     * アイテムの使用をやめた際の処理
     * @param eventData
     * イベントのデータ
     */
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

    /**
     * @remarks
     * 自動発射開始
     * @param ammoManager
     * 銃のammoManager
     * @param owner
     * 銃の所有者
     */
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

    /**
     * @remarks
     * 自動発射インターバルをクリア
     * @param owner
     * 銃の所有者
     */
    protected clearAutoShootInterval(owner: mc.Player): void {
        mc.system.clearRun(this.autoShootIntervalIdMap.get(owner.id) ?? 0);
    }

    /**
     * @remarks
     * 自動発射インターバルを登録
     * @param owner
     * 銃の所有者
     * @param owner
     * インターバルのId
     */
    protected registerAutoShootInterval(owner: mc.Player, intervalId: number): void {
        this.autoShootIntervalIdMap.set(owner.id, intervalId);
    }
}
