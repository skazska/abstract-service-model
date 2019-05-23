import {Result} from "./result";
import {IError} from "./error";

export interface IAuthToken {
}


export interface IAuthRealm {
}

export interface IAuthAccess {
}

export interface IAuthError extends IError {}

export interface IIdentity {
    access(realm :IAuthRealm) :IAuthAccess;
}

export interface IAuthPassResult extends Result<IIdentity, IAuthError> {

}

export abstract class Auth {
    abstract identify (tokens :IAuthToken) :IAuthPassResult;

}
