import {Result} from "./result";
import {IError} from "./error";

export interface IStorageError extends IError {}

export interface IStorage<P, D> {
    read(params :P) :Promise<Result<D, IStorageError>>
    write(data :D) :Promise<Result<any, IStorageError>>
    erase(params :P) :Promise<Result<any, IStorageError>>
}
