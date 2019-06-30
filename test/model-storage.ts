import {IStorageError} from "../src/storage";
import {failure, result, Result} from "../src/result";
import {ITestModelKey, ITestModelProperties} from "./model";
import {error} from "../src/auth";
import {IModelStorageConfig, ModelStorage} from "../src/storage/model";
import {IModel} from "../src/model";

// test model storage record format
interface IRecord {
    data :IModel,
    isRemoved?: boolean
}

export interface ITestStorageConfig extends IModelStorageConfig<ITestModelKey, ITestModelProperties> {
    data: Iterable<[string, IRecord]>
}

// test model storage implementation
export class TestStorage extends ModelStorage<ITestModelKey, ITestModelProperties> {
    public data: Map<string, IRecord>;

    constructor (config :ITestStorageConfig) {
        super(config);
        this.data = new Map(config.data);
    }

    load(key :ITestModelKey) :Promise<Result<IModel, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = this.data.get(key.id);
                if (typeof data === 'undefined') return resolve(failure([error('not found')]));
                if (data.isRemoved) return resolve(failure([error('record removed')]));
                resolve(result(data.data))
            }, 10);
        });
    }
    save(data :IModel) :Promise<Result<any, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.data.set(data.key.id, {data: data});
                return resolve(result(data))
            }, 10);
        });
    }
    erase(key :ITestModelKey) :Promise<Result<any, IStorageError>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                let data = this.data.get(key.id);
                if (typeof data === 'undefined') return resolve(failure([error('not found')]));
                if (data.isRemoved) return resolve(failure([error('record removed')]));
                data.isRemoved = true;
                return resolve(result(true));
            }, 10);
        });
    }
}
