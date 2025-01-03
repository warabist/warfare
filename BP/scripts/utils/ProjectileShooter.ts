import * as mc from '@minecraft/server';
import { Vector3Utils } from './index';

/**
 * 発射体を飛ばす
 */
export class ProjectileShooter {
    /**
     * @remarks
     * ownerからprojectileIdの発射体か発射される
     * @param owner
     * 発射体の主
     * このプレイヤーの頭の前に発射体がスポーン
     * @param projectileId
     * 発射体のtypeId
     * @param options
     * 発射のオプション
     */
    static shoot(
        owner: mc.Player,
        projectileId: string,
        options?: {
            power?: number;
            uncertainty?: number;
        }
    ): void {
        const viewDirection = owner.getViewDirection();
        const projectileEntity = owner.dimension.spawnEntity(
            projectileId,
            Vector3Utils.add(owner.getHeadLocation(), viewDirection)
        );
        const projectile = projectileEntity.getComponent(
            mc.EntityComponentTypes.Projectile
        ) as mc.EntityProjectileComponent;
        projectile.owner = owner
        projectile.shoot(Vector3Utils.scale(viewDirection, options?.power ?? 1), {
            uncertainty: options?.uncertainty ?? 0,
        });
    }
}