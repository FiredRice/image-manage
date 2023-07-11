import { ReadFile, WriteFile } from 'wailsjs/go/file/File';

class Store {
    private value: any = {};
    private savePath: string;

    public constructor(savePath: string) {
        this.savePath = savePath;
    }

    public async init() {
        try {
            const str = await ReadFile(this.savePath);
            this.value = JSON.parse(str);
        } catch (error: any) {
            console.log(error);
        }
    }

    private async writeConfig() {
        try {
            await WriteFile(this.savePath, JSON.stringify(this.value));
        } catch (error) {
            console.log(error);
        }
    }

    public get(key: string) {
        return this.value[key];
    }

    public async set(key: string, value) {
        this.value[key] = value;
        await this.writeConfig();
    }

    public async setValues(value: any) {
        this.value = Object.assign({}, this.value, value);
        await this.writeConfig();
    }

    public getValues() {
        return { ...this.value };
    }

    public async clear() {
        try {
            this.value = {};
            await this.writeConfig();
        } catch (error) {
            console.log(error);
        }
    }

    public async remove(key: string) {
        Reflect.deleteProperty(this.value, key);
        await this.writeConfig();
    }

    public async batchRemove(keys: string[]) {
        keys.forEach(key => {
            Reflect.deleteProperty(this.value, key);
        });
        await this.writeConfig();
    }
}

export const imagesStore = new Store('data/images.json');
export const labelsStore = new Store('data/labels.json');
export const tableStore = new Store('data/table.json');

export async function initStores() {
    const promises = [
        imagesStore.init(),
        labelsStore.init(),
        tableStore.init()
    ];
    try {
        await Promise.all(promises);
    } catch (error) {
        console.log(error);
    }
}