import {IStorage, IStorageConfig, IStorageError, IStorageOperationOptions} from "../storage";
import {GenericModel, GenericModelFactory} from "../model";
import {success, GenericResult} from "../result";


export interface IModelStorageConfig<K, P> extends IStorageConfig {
    modelFactory :GenericModelFactory<K, P>
}

const error = (description :string, source? :any) :IStorageError => {
    const err :IStorageError = {
        description: description
    };
    if (source) err.source = source;
    return err;
};

export abstract class AbstractModelStorage<K, P> implements IStorage<K, P, GenericModel<K,P>> {
    _modelFactory : GenericModelFactory<K, P>;

    protected constructor(props :IModelStorageConfig<K, P>) {
        this._modelFactory = props.modelFactory;
    }

    abstract newKey?(options?: IStorageOperationOptions) :Promise<GenericResult<K, IStorageError>>
    abstract load(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<GenericModel<K,P>, IStorageError>>
    abstract save(data :GenericModel<K,P>, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
    abstract erase(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
    data(key:K, props: P) :Promise<GenericResult<GenericModel<K,P>, IStorageError>> {
        const data = this._modelFactory.model(key, props);
        return Promise.resolve(success(data));
    }

    static error = error
}
