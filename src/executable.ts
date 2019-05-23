import {Result} from "./result";
import {IIdentity} from "./auth";
import {IError} from "./error";

export interface IServiceAuthenticator {
    key (data: any)
}


export interface IRunError extends IError {}

export interface IRunParams {}

export interface IRunData {}

export interface IRunResult extends Result<IRunData, IRunError> {}

export abstract class Executable {
    abstract run(params :IRunParams, authPass :IIdentity) :IRunResult
}
