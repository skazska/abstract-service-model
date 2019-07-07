import {IStorageError} from "../src/storage";
import {failure, result, Result} from "../src/result";
import {ITestModelKey, ITestModelProperties, TestModel} from "./model";
import {IModelStorageConfig, ModelStorage} from "../src/storage/model";

// test model storage record format
interface IRecord {
    data :TestModel,
    isRemoved?: boolean
}

export interface ITestStorageConfig extends IModelStorageConfig<ITestModelKey, ITestModelProperties> {
    data: [string, IRecord][]
}

// test model storage implementation
export class TestStorage extends ModelStorage<ITestModelKey, ITestModelProperties> {
    public _data: Map<string, IRecord>;

    constructor (config :ITestStorageConfig) {
        super(config);
        this._data = new Map(config.data);
    }

    newKey(): Promise<Result<ITestModelKey, IStorageError>> {
        return Promise.resolve(failure([ModelStorage.error('use natural key')]));
    }

    load(key :ITestModelKey) :Promise<Result<TestModel, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = this._data.get(key.id);
                if (typeof data === 'undefined') return resolve(failure([ModelStorage.error('not found')]));
                if (data.isRemoved) return resolve(failure([ModelStorage.error('record removed')]));
                resolve(result(data.data))
            }, 10);
        });
    }
    save(data :TestModel) :Promise<Result<any, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this._data.set(data.key.id, {data: data});
                return resolve(result(data))
            }, 10);
        });
    }
    erase(key :ITestModelKey) :Promise<Result<any, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = this._data.get(key.id);
                if (typeof data === 'undefined') return resolve(failure([ModelStorage.error('not found')]));
                if (data.isRemoved) return resolve(failure([ModelStorage.error('record removed')]));
                data.isRemoved = true;
                return resolve(result(true));
            }, 10);
        });
    }
}
