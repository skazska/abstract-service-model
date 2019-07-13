import {IStorage, IStorageConfig, IStorageError} from "../storage";
import {GenericModel, ModelFactory} from "../model";
import {success, GenericResult} from "../result";


export interface IModelStorageConfig<K, P> extends IStorageConfig {
    modelFactory :ModelFactory<K, P>
}

const error = (description :string, source? :any) :IStorageError => {
    const err :IStorageError = {
        description: description
    };
    if (source) err.source = source;
    return err;
};

export abstract class AbstractModelStorage<K, P> implements IStorage<K, P, GenericModel<K,P>> {
    _modelFactory : ModelFactory<K, P>;

    protected constructor(props :IModelStorageConfig<K, P>) {
        this._modelFactory = props.modelFactory;
    }

    abstract newKey?() :Promise<GenericResult<K, IStorageError>>
    abstract load(key :K) :Promise<GenericResult<GenericModel<K,P>, IStorageError>>
    abstract save(data :GenericModel<K,P>) :Promise<GenericResult<any, IStorageError>>
    abstract erase(key :K) :Promise<GenericResult<any, IStorageError>>
    data(key:K, props: P) :Promise<GenericResult<GenericModel<K,P>, IStorageError>> {
        const data = this._modelFactory.model(key, props);
        return Promise.resolve(success(data));
    }

    static error = error
}
