import {IStorageError} from "../src/storage";
import {failure, success, GenericResult} from "../src/result";
import {ITestModelKey, ITestModelProperties, TestModel} from "./model";
import {IModelStorageConfig, AbstractModelStorage} from "../src/storage/model";

// test model storage record format
interface IRecord {
    data :TestModel,
    isRemoved?: boolean
}

export interface ITestStorageConfig extends IModelStorageConfig<ITestModelKey, ITestModelProperties> {
    data: [string, IRecord][]
}

// test model storage implementation
export class TestStorage extends AbstractModelStorage<ITestModelKey, ITestModelProperties> {
    public _data: Map<string, IRecord>;

    constructor (config :ITestStorageConfig) {
        super(config);
        this._data = new Map(config.data);
    }

    newKey(): Promise<GenericResult<ITestModelKey, IStorageError>> {
        return Promise.resolve(failure([AbstractModelStorage.error('use natural key')]));
    }

    load(key :ITestModelKey) :Promise<GenericResult<TestModel, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = this._data.get(key.id);
                if (typeof data === 'undefined') return resolve(failure([AbstractModelStorage.error('not found')]));
                if (data.isRemoved) return resolve(failure([AbstractModelStorage.error('record removed')]));
                resolve(success(data.data))
            }, 10);
        });
    }
    save(data :TestModel) :Promise<GenericResult<any, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this._data.set(data.getKey().id, {data: data});
                return resolve(success(data))
            }, 10);
        });
    }
    erase(key :ITestModelKey) :Promise<GenericResult<any, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = this._data.get(key.id);
                if (typeof data === 'undefined') return resolve(failure([AbstractModelStorage.error('not found')]));
                if (data.isRemoved) return resolve(failure([AbstractModelStorage.error('record removed')]));
                data.isRemoved = true;
                return resolve(success(true));
            }, 10);
        });
    }
}
