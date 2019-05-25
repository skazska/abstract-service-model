import {Result} from "./result";
import {IAuthError, IIdentity} from "./auth";
import {IError} from "./error";

export interface IRunError extends IError {
    operation? :string
}

export const error = (description :string, operation? :string, field? :string) :IRunError => {
    const err :IRunError = {
        description: description
    };
    if (field) err.field = field;
    if (operation) err.operation = operation;
    return err;
};

export interface IExecutable {
    run(params? :any, identity? :IIdentity);
}

export interface IExecutableConfig {
    realm? :string
    operation? :string;
}

export abstract class Executable<I, O> implements IExecutable {
    protected _realm :string;
    protected _operation :string;

    protected constructor(props :IExecutableConfig) {
        this._realm = props.realm || '*';
        this._operation = props.operation || '*';
    }

    protected abstract _execute(params :I) :Promise<Result<O, IRunError>>

    protected _authenticate(identity :IIdentity) :Promise<Result<any, IAuthError>> {
        return identity.access(this._realm, this._operation);
    }

    async run(params :I, identity? :IIdentity) :Promise<Result<O, IError>> {
        if (identity) {
            const authResult = await this._authenticate(identity);
            if (authResult.isFailure) return authResult;
        }
        return this._execute(params);
    }
}


