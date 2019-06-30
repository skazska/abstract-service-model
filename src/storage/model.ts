import {IStorage, IStorageConfig, IStorageError} from "../storage";
import {IModel, ModelFactory} from "../model";
import {Result} from "../result";


export interface IModelStorageConfig<K, P> extends IStorageConfig {
    modelFactory :ModelFactory<K, P>
}

export abstract class ModelStorage<K, P> implements IStorage<K, IModel> {
    _modelFactory : ModelFactory<K, P>;

    protected constructor(props :IModelStorageConfig<K, P>) {
        this._modelFactory = props.modelFactory;
    }

    abstract load(key :K) :Promise<Result<IModel, IStorageError>>
    abstract save(data :IModel) :Promise<Result<any, IStorageError>>
    abstract erase(key :K) :Promise<Result<any, IStorageError>>
}
