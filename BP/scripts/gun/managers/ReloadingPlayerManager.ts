import * as mc from '@minecraft/server';

export class ReloadingPlayerManager {
    private static reloadingPlayerIds: Set<string> = new Set();

    static isPlayerReloading(player: mc.Player): boolean {
        return this.reloadingPlayerIds.has(player.id);
    }

    static addPlayer(player: mc.Player): void {
        this.reloadingPlayerIds.add(player.id);
    }

    static removePlayer(player: mc.Player): void {
        this.reloadingPlayerIds.delete(player.id);
    }
}
