import { GunData } from './index';

/**
 * 自動発射銃のデータ
 */
export interface AutomaticGunData extends GunData {
    rate: number;
}
