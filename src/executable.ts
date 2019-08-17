import {GenericResult} from "./result";
import {IAuthError, IAuthIdentity} from "./auth";
import {IError, error} from "./error";

export interface IRunError extends IError {
    field? :string,
    operation? :string
}

export interface IExecutable {
    run(params? :any, identity? :IAuthIdentity) :Promise<GenericResult<any, IRunError>>;
}

export interface IExecutableConfig {
    operation? :string;
}


export const executionError = (message :string, operation? :string, field? :string) :IRunError => {
    const err :IRunError = error(message);
    if (field) err.field = field;
    if (operation) err.operation = operation;
    return err;
};

export abstract class AbstractExecutable<I, O> implements IExecutable {
    protected _operation :string;

    protected constructor(props :IExecutableConfig) {
        this._operation = props.operation || '*';
    }

    protected abstract _execute(params :I) :Promise<GenericResult<O, IRunError>>

    protected _authenticate(identity :IAuthIdentity) :GenericResult<any, IAuthError> {
        return identity.access(this._operation);
    }

    async run(params :I, identity? :IAuthIdentity) :Promise<GenericResult<O, IError>> {
        if (identity) {
            const authResult = this._authenticate(identity);
            if (authResult.isFailure) return authResult;
        }
        return this._execute(params);
    }

    static error = executionError
}


