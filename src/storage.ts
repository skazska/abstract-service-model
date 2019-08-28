import {GenericResult} from "./result";
import {error, IError} from "./error";
import {IAuthError} from "./auth";

export interface IStorageError extends IError {
    source? :any,
    isStorageError? :boolean
}

export const isStorageError = (error :IError) :error is IStorageError => {
    return 'isStorageError' in error;
};


export const storageError = (message :string, source? :string) => {
    const err :IStorageError = error(message);
    err.isStorageError = true;
    if (source) err.source = source;
    return err;
};

export interface IStorageConfig {}

export interface IStorageOperationOptions {}

export interface IStorage<K, P, D> {
    newKey?(options?: IStorageOperationOptions) :Promise<GenericResult<K, IStorageError>>
    load(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<D, IStorageError>>
    save(data :D, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
    erase(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
}
