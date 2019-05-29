import {Result} from "./result";
import {IError} from "./error";

export interface IAuthToken {
}

export interface IAuthError extends IError {}

export interface IAuthIdentity {
    access(realm :string, op: string) :Promise<Result<boolean, IAuthError>>;
}

export interface IIdentityResult extends Result<IAuthIdentity, IAuthError> {}

export abstract class Auth {
    abstract identify (tokens :IAuthToken) :Promise<IIdentityResult>;
}
