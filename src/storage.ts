import {Result} from "./result";
import {IError} from "./error";

export interface IStorageError extends IError {};

export interface IStorage<P, D> {
    read(params :P) :Result<any, IStorageError>
    write(data :D) :Result<any, IStorageError>
}
