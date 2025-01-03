import * as mc from '@minecraft/server';

/**
 * リロード中プレイヤーの管理
 */
export class ReloadingPlayerManager {
    /**
     * @remarks
     * リロード中のプレイヤーIdのリスト
     */
    private static reloadingPlayerIds: Set<string> = new Set();

    /**
     * @remarks
     * プレイヤーがリロードしているかを調べる
     * @param player
     * 調べたいプレイヤー
     * @returns
     * プレイヤーがリロード中かを返す
     */
    static isPlayerReloading(player: mc.Player): boolean {
        return this.reloadingPlayerIds.has(player.id);
    }

    /**
     * @remarks
     * リロード中プレイヤーのリストにプレイヤーを追加
     * @param player
     * 追加したいプレイヤー
     */
    static addPlayer(player: mc.Player): void {
        this.reloadingPlayerIds.add(player.id);
    }

    /**
     * @remarks
     * リロード中プレイヤーのリストからプレイヤーを削除
     * @param player
     * 削除したいプレイヤー
     */
    static removePlayer(player: mc.Player): void {
        this.reloadingPlayerIds.delete(player.id);
    }
}
