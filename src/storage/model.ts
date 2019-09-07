import {IStorage, IStorageConfig, IStorageError, IStorageOperationOptions, storageError} from "../storage";
import {GenericModelFactory, IModel} from "../model";
import {GenericResult} from "../result";

/**
 * module provides Abstract model storage
 */

/** Abstract model storage constructor options */
export interface IModelStorageConfig<K, P> extends IStorageConfig {
    modelFactory :GenericModelFactory<K, P>
}

/** Abstract model storage */
export abstract class AbstractModelStorage<K, P> implements IStorage<K, IModel> {
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
