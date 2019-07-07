import {GenericResult} from "./result";
import {IAuthError, IAuthIdentity} from "./auth";
import {IError} from "./error";

export interface IRunError extends IError {
    field? :string,
    operation? :string
}

export interface IExecutable {
    run(params? :any, identity? :IAuthIdentity) :Promise<GenericResult<any, IRunError>>;
}

export interface IExecutableConfig {
    realm? :string
    operation? :string;
}


const error = (description :string, operation? :string, field? :string) :IRunError => {
    const err :IRunError = {
        description: description
    };
    if (field) err.field = field;
    if (operation) err.operation = operation;
    return err;
};

export abstract class AbstractExecutable<I, O> implements IExecutable {
    protected _realm :string;
    protected _operation :string;

    protected constructor(props :IExecutableConfig) {
        this._realm = props.realm || '*';
        this._operation = props.operation || '*';
    }

    protected abstract _execute(params :I) :Promise<GenericResult<O, IRunError>>

    protected _authenticate(identity :IAuthIdentity) :Promise<GenericResult<any, IAuthError>> {
        return identity.access(this._realm, this._operation);
    }

    async run(params :I, identity? :IAuthIdentity) :Promise<GenericResult<O, IError>> {
        if (identity) {
            const authResult = await this._authenticate(identity);
            if (authResult.isFailure) return authResult;
        }
        return this._execute(params);
    }

    static error = error
}


