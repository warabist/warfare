import * as mc from '@minecraft/server';

/**
 * 継承しon～をオーバーライド、subscribeEventを実行すればイベントが登録される
 */
export abstract class SubscriberAdapter {
    /**
     * @remarks
     * オーバーライドされたon～をイベントとして登録
     */
    subscribeEvent(): void {
        if (this.onAfterStopUseItem !== SubscriberAdapter.prototype.onAfterStopUseItem) {
            mc.world.afterEvents.itemStopUse.subscribe((eventData) => {
                this.onAfterStopUseItem(eventData);
            });
        }
        if (this.onBeforeUseItem !== SubscriberAdapter.prototype.onBeforeUseItem) {
            mc.world.beforeEvents.itemUse.subscribe((eventData) => {
                this.onBeforeUseItem(eventData);
            });
        }
    }
    protected onAfterStopUseItem(eventData: mc.ItemStopUseAfterEvent): void { }
    protected onBeforeUseItem(eventData: mc.ItemUseBeforeEvent): void { }
}