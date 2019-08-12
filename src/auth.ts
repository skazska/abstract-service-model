import {GenericResult} from "./result";
import {IError, error} from "./error";

export interface IAuthToken {
}

export interface IAuthError extends IError {
    realm? :string
    operation? :string
}

export interface IAuthIdentity {
    access(realm :string, op: string) :Promise<GenericResult<boolean, IAuthError>>;
}

export interface IIdentityResult extends GenericResult<IAuthIdentity, IAuthError> {}

export interface IAuth {
    identify (tokens :IAuthToken) :Promise<IIdentityResult>;
}

export const authError = (message :string, operation? :string, realm? :string) :IAuthError => {
    const err :IAuthError = error(message);
    if (realm) err.realm = realm;
    if (operation) err.operation = operation;
    return err;
};

export abstract class AbstractAuth implements IAuth {
    abstract identify (tokens :IAuthToken) :Promise<IIdentityResult>;

    static error = authError;
}
