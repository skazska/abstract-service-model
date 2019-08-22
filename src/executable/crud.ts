import {AbstractExecutable, IExecutableConfig, IRunError} from "../executable";
import {IStorageOperationOptions} from "../storage";
import {IModel} from "../model";
import {failure, GenericResult} from "../result";
import {AbstractModelStorage} from "../storage/model";

const createExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, params :ICUExecuteOptions)
    :Promise<GenericResult<any, IRunError>> =>
{
    // if key is not provided, try obtain new from storage
    if (!params.model.hasKey()) {
        let key = (await storage.newKey()).wrap(
            key => key,
            err => AbstractExecutable.error(err.message, 'ask new key from storage')
        );
        if (key.isFailure) return failure(key.errors);
        params.model.setKey(key.get());
    }

    // save
    return (await storage.save(params.model, params.options)).wrap(
        result => params.model,
        error => AbstractExecutable.error(error.message, 'save to storage')

    );
};

const readExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, key :K)
    :Promise<GenericResult<any, IRunError>> => {
    return (await storage.load(key)).wrap(
        (model) => model,
        (error) => AbstractExecutable.error(error.message, 'read from storage')
    );
};

const updateExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, params :ICUExecuteOptions)
    :Promise<GenericResult<any, IRunError>> =>
{
    // save
    return (await storage.save(params.model, params.options)).wrap(
        result => params.model,
        error => AbstractExecutable.error(error.message, 'save to storage')
    );
};

const deleteExecutor = async <K, P>(storage :AbstractModelStorage<K, P>, key :K)
    :Promise<GenericResult<any, IRunError>> => {
    return (await storage.erase(key)).wrap(
    result => null,
    err => AbstractExecutable.error(err.message, 'erase from storage')
    );
};

export interface ICRUDExecutableConfig<I, O, K, P> extends IExecutableConfig {
    storage? :AbstractModelStorage<K, P>
    executor? :(storage :AbstractModelStorage<K, P>, params: I)=>Promise<GenericResult<O, IRunError>>
}

export interface ICUExecuteOptions {
    model : IModel,
    options?: IStorageOperationOptions
}

export abstract class CRUDExecutable<I, O, K, P> extends AbstractExecutable<I, O> {
    protected storage: AbstractModelStorage<K, P>;
    protected executor :(storage :AbstractModelStorage<K, P>, params: I)=>Promise<GenericResult<O, IRunError>>;

    constructor(props: ICRUDExecutableConfig<I, O, K, P>) {
        super(props);
        this.storage = props.storage;
        this.executor = props.executor;
    }

    protected async _execute(params: I): Promise<GenericResult<O, IRunError>> {
        return this.executor(this.storage, params);
    }

    static createExecutor = createExecutor;

    static readExecutor = readExecutor;

    static updateExecutor = updateExecutor;

    static deleteExecutor = deleteExecutor;
}

