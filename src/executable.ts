/**
 * module provides basic Executeble template and infrastructure
 * descendant should implement _execute method
 */

import {GenericResult} from "./result";
import {IAuthError, IAuthIdentity} from "./auth";
import {IError, error} from "./error";

/** run error structure interface */
export interface IRunError extends IError {
    field? :string,
    operation? :string
    isRunError? :boolean
}

/** run error type guard */
export const isRunError = (error :IError) :error is IRunError => {
    return 'isRunError' in error;
};

/** Executable interface */
export interface IExecutable {
    run(params? :any, identity? :IAuthIdentity) :Promise<GenericResult<any>>;
}

/** Executable constructor options structure */
export interface IExecutableConfig {
    /** authorization object */
    accessObject?: string;
    /** authorization operation */
    operation? :string;
}

/**
 * returns new run error
 * @param message
 * @param operation
 * @param field
 */
export const executionError = (message :string, operation? :string, field? :string) :IRunError => {
    const err :IRunError = error(message);
    err.isRunError = true;
    if (field) err.field = field;
    if (operation) err.operation = operation;
    return err;
};

export abstract class AbstractExecutable<I, O> implements IExecutable {
    /** authorization object */
    protected accessObject :string;
    /** authorization operation */
    protected operation :string;

    protected constructor(props :IExecutableConfig) {
        this.accessObject = props.accessObject;
        this.operation = props.operation;
    }

    /** implement executable logic */
    protected abstract _execute(params :I) :Promise<GenericResult<O>>

    /** check authorization */
    protected _authenticate(identity :IAuthIdentity, params :I) :GenericResult<any> {
        return identity.access(this.accessObject, this.operation);
    }

    /** executable run method, expects params and optionally identity object to check authorization */
    async run(params :I, identity? :IAuthIdentity) :Promise<GenericResult<O>> {
        if (identity) {
            const authResult = this._authenticate(identity, params);
            if (authResult.isFailure) return authResult;
        }

        return this._execute(params);
    }

    static error = executionError
}


