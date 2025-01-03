import * as mc from '@minecraft/server';

/**
 * 空の銃、弾のある銃をそれぞれ置き換える
 */
export class GunReplacer {
    /**
     * @remarks
     * ロードされた銃を空の銃に置き換える
     * @param owner
     * 銃の所有者
     * @param loadedGunItem
     * ロードされた銃のItemStack
     * @param emptyGunItemId
     * 空の銃のアイテムtypeId
     */
    static replaceEmptyGun(
        owner: mc.Player,
        loadedGunItem: mc.ItemStack,
        emptyGunItemId: string
    ): void {
        const equippable = owner.getComponent(
            mc.EntityComponentTypes.Equippable
        ) as mc.EntityEquippableComponent;
        const emptyGunItem = new mc.ItemStack(emptyGunItemId, 1);
        //loadedGunItemのデータをemptyGunItemに移植
        emptyGunItem.nameTag = loadedGunItem.nameTag;
        for (const id of loadedGunItem.getDynamicPropertyIds()) {
            emptyGunItem.setDynamicProperty(id, loadedGunItem.getDynamicProperty(id));
        }
        emptyGunItem.setLore(loadedGunItem.getLore());
        equippable.setEquipment(mc.EquipmentSlot.Mainhand, emptyGunItem);
    }

    /**
     * @remarks
     * 空の銃をロードされた銃に置き換える
     * @param owner
     * 銃の所有者
     * @param emptyGunItem 
     * 空の銃のItemStack
     * @param loadedGunId
     * ロードされた銃アイテムのtypeId
     */
    static replaceLoadedGun(
        owner: mc.Player,
        emptyGunItem: mc.ItemStack,
        loadedGunId: string
    ): void {
        const equippable = owner.getComponent(
            mc.EntityComponentTypes.Equippable
        ) as mc.EntityEquippableComponent;
        const loadedGunItem = new mc.ItemStack(loadedGunId, 1);
        //emptyGunItemのデータをloadedGunItemに移植
        loadedGunItem.nameTag = emptyGunItem.nameTag;
        for (const id of emptyGunItem.getDynamicPropertyIds()) {
            loadedGunItem.setDynamicProperty(id, emptyGunItem.getDynamicProperty(id));
        }
        loadedGunItem.setLore(emptyGunItem.getLore());
        equippable.setEquipment(mc.EquipmentSlot.Mainhand, loadedGunItem);
    }
}
