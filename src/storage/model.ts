import {IStorage, IStorageConfig, IStorageError} from "../storage";
import {Model, ModelFactory} from "../model";
import {result, Result} from "../result";
import {IAuthError} from "../auth";


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

export abstract class ModelStorage<K, P> implements IStorage<K, P, Model<K,P>> {
    _modelFactory : ModelFactory<K, P>;

    protected constructor(props :IModelStorageConfig<K, P>) {
        this._modelFactory = props.modelFactory;
    }

    abstract newKey?() :Promise<Result<K, IStorageError>>
    abstract load(key :K) :Promise<Result<Model<K,P>, IStorageError>>
    abstract save(data :Model<K,P>) :Promise<Result<any, IStorageError>>
    abstract erase(key :K) :Promise<Result<any, IStorageError>>
    data(key:K, props: P) :Promise<Result<Model<K,P>, IStorageError>> {
        const data = this._modelFactory.model(key, props);
        return Promise.resolve(result(data));
    }

    static error = error
}
