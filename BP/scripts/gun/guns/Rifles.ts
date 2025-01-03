import { AutomaticGun } from './types/index';

/**
 * ライフルのリスト
 */
export class Rifles {
    private static test = new AutomaticGun({
        loadedGunItemId: 'warfare:loaded_test',
        emptyGunItemId: 'warfare:empty_test',
        ammoItemId: 'warfare:test_magazine',
        bulletProjectileId: 'minecraft:arrow',
        power: 10,
        uncertainty: 3,
        capacity: 30,
        zoomRatio: 2,
        reloadTime: 30,
        rate: 2
    });

    private static ak47 = new AutomaticGun({
        loadedGunItemId: 'warfare:loaded_ak47',
        emptyGunItemId: 'warfare:empty_ak47',
        ammoItemId: 'warfare:ak47_magazine',
        bulletProjectileId: 'warfare:ak47_bullet',
        power: 10,
        uncertainty: 3,
        capacity: 30,
        zoomRatio: 2,
        reloadTime: 30,
        rate: 2
    });

    static data = [this.test, this.ak47];
}