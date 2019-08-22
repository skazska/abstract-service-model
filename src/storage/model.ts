import {IStorage, IStorageConfig, IStorageError, IStorageOperationOptions, storageError} from "../storage";
import {GenericModel, GenericModelFactory, IModel} from "../model";
import {GenericResult} from "../result";


export interface IModelStorageConfig<K, P> extends IStorageConfig {
    modelFactory :GenericModelFactory<K, P>
}

export abstract class AbstractModelStorage<K, P> implements IStorage<K, P, IModel> {
    protected modelFactory : GenericModelFactory<K, P>;

    protected constructor(props :IModelStorageConfig<K, P>) {
        this.modelFactory = props.modelFactory;
    }

    abstract newKey?(options?: IStorageOperationOptions) :Promise<GenericResult<K, IStorageError>>
    abstract load(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<IModel, IStorageError>>
    abstract save(data :IModel, options?: IStorageOperationOptions) :Promise<GenericResult<IModel, IStorageError>>
    abstract erase(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>

    static error = storageError
}
