import {IStorage, IStorageConfig, IStorageError, IStorageOperationOptions, storageError} from "../storage";
import {GenericModel, GenericModelFactory} from "../model";
import {GenericResult} from "../result";


export interface IModelStorageConfig<K, P> extends IStorageConfig {
    modelFactory :GenericModelFactory<K, P>
}

export abstract class AbstractModelStorage<K, P> implements IStorage<K, P, GenericModel<K,P>> {
    protected modelFactory : GenericModelFactory<K, P>;

    protected constructor(props :IModelStorageConfig<K, P>) {
        this.modelFactory = props.modelFactory;
    }

    abstract newKey?(options?: IStorageOperationOptions) :Promise<GenericResult<K, IStorageError>>
    abstract load(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<GenericModel<K,P>, IStorageError>>
    abstract save(data :GenericModel<K,P>, options?: IStorageOperationOptions) :Promise<GenericResult<GenericModel<K,P>, IStorageError>>
    abstract erase(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>

    static error = storageError
}
