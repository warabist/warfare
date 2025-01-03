/**
* uuidを生成する
*/
export class UuidGenerator {
    /**
     * @remarks
     * uuid生成
     * @returns
     * xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxxという形
     */
    static generate(): string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            let r = (Math.random() * 16) | 0,
                v = c === 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}
