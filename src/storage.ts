import {GenericResult} from "./result";
import {error, IError} from "./error";
import {IAuthError} from "./auth";

/**
 * module provides storage interface and storage error interface and factory function
 */

/** Basic storage error interface */
export interface IStorageError extends IError {
    source? :any,
    isStorageError? :boolean
}

/** storage error type guard */
export const isStorageError = (error :IError) :error is IStorageError => {
    return 'isStorageError' in error;
};


/** Basic storage error factory function */
export const storageError = (message :string, source? :string) => {
    const err :IStorageError = error(message);
    err.isStorageError = true;
    if (source) err.source = source;
    return err;
};

/** Abstract Storage constructor options */
export interface IStorageConfig {}

/** Abstract Storage operation options */
export interface IStorageOperationOptions {}

/** Abstract storage interface */
export interface IStorage<K, D> {
    newKey?(options?: IStorageOperationOptions) :Promise<GenericResult<K, IStorageError>>
    load(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<D, IStorageError>>
    save(data :D, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
    erase(key :K, options?: IStorageOperationOptions) :Promise<GenericResult<any, IStorageError>>
}
