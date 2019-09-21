import {AbstractExecutable, IExecutableConfig, IRunError} from "../executable";
import {IStorageOperationOptions} from "../storage";
import {IModel} from "../model";
import {failure, GenericResult} from "../result";
import {AbstractModelStorage} from "../storage/model";

const createExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, params :ICUExecuteOptions)
    :Promise<GenericResult<any>> =>
{
    // if key is not provided, try obtain new from storage
    if (!params.model.hasKey()) {
        let key = (await storage.newKey()).transform(
            key => key,
            err => AbstractExecutable.error(err.message, 'ask new key from storage')
        );
        if (key.isFailure) return key.asFailure();
        params.model.setKey(key.get());
    }

    // save
    return (await storage.save(params.model, params.options)).transform(
        result => params.model,
        error => AbstractExecutable.error(error.message, 'save to storage')

    );
};

const readExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, key :K)
    :Promise<GenericResult<any>> => {
    return (await storage.load(key)).transform(
        (model) => model,
        (error) => AbstractExecutable.error(error.message, 'read from storage')
    );
};

const updateExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, params :ICUExecuteOptions)
    :Promise<GenericResult<any>> =>
{
    // save
    return (await storage.save(params.model, params.options)).transform(
        result => params.model,
        error => AbstractExecutable.error(error.message, 'save to storage')
    );
};

const deleteExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, key :K)
    :Promise<GenericResult<any>> => {
    return (await storage.erase(key)).transform(
    result => null,
    err => AbstractExecutable.error(err.message, 'erase from storage')
    );
};

export interface ICRUDExecutableConfig<I, O, K, P> extends IExecutableConfig {
    storage? :AbstractModelStorage<K, P>
    executor? :(storage :AbstractModelStorage<K, P>, params: I)=>Promise<GenericResult<O>>
}

export interface ICUExecuteOptions {
    model : IModel,
    options?: IStorageOperationOptions
}

export abstract class CRUDExecutable<I, O, K, P> extends AbstractExecutable<I, O> {
    protected storage: AbstractModelStorage<K, P>;
    protected executor :(storage :AbstractModelStorage<K, P>, params: I)=>Promise<GenericResult<O>>;

    constructor(props: ICRUDExecutableConfig<I, O, K, P>) {
        super(props);
        this.storage = props.storage;
        this.executor = props.executor;
    }

    protected async _execute(params: I): Promise<GenericResult<O>> {
        return this.executor(this.storage, params);
    }

    static createExecutor = createExecutor;

    static readExecutor = readExecutor;

    static updateExecutor = updateExecutor;

    static deleteExecutor = deleteExecutor;
}

