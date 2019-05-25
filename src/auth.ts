import {Result} from "./result";
import {IError} from "./error";

export interface IAuthToken {
}

export interface IAuthError extends IError {}

export interface IIdentity {
    access(realm :string, op: string) :Promise<Result<boolean, IAuthError>>;
}

export interface IAuthPassResult extends Result<IIdentity, IAuthError> {}

export abstract class Auth {
    abstract identify (tokens :IAuthToken) :IAuthPassResult;

}
