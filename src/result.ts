/**
 * Module provides GenericResult class & failure success factories
 */

import {IError} from "./error";

/**
 * Represents result or failure
 */
export class GenericResult<T> {
    /**
     * @param _result result data
     * @param _errors error list
     */
    constructor (
        protected _result? :T,
        protected _errors? :IError[]
    ) {}

    /**
     * returns error list
     */
    get errors () :IError[] {
        return this._errors;
    }

    /**
     * indicates if there errors
     */
    get isFailure () :boolean {
        return !!this._errors
    }

    /**
     * returns result
     */
    get () :T {
        return this._result;
    }

    /**
     * adds error
     * @param err
     */
    error (err :IError) :GenericResult<T> {
        if (!this._errors) {
            this._errors = [err];
        } else {
            this._errors.push(err);
        }
        return this;
    }

    /**
     * sets result data
     * @param data
     */
    success (data :T) :GenericResult<T> {
        this._result = data;
        return this;
    }

    /**
     * represents self as GenericResult<any>
     */
    asFailure() :GenericResult<any> {
        return this;
    }

    /**
     * merges errors from another Result
     * @param results
     */
    mergeErrors (...results :GenericResult<any>[]) :GenericResult<T> {
        results.forEach(result => {
            if (result.isFailure) {
                this._errors = (this._errors || []).concat(result.errors);
            }
        });

        return this;
    }

    /**
     * returns new result from this, with processed result or converted errors
     * @param continuation
     * @param errorConverter
     */
    transform (continuation :(data :T) => any, errorConverter? :(error :IError)=>IError) :GenericResult<any> {
        if (this.isFailure)
            return failure(errorConverter ? this.errors.map(errorConverter) : this.errors);
        try {
            return success(continuation(this.get()));
        } catch (IError) {
            failure(errorConverter ? [errorConverter(IError)] : [IError]);
        }
    }
}

export const failure = (list :IError[]) :GenericResult<null> => {
    return new GenericResult<null>(null, list);
};

export const success = <T>(data :T) :GenericResult<T> => {
    return new GenericResult<T>(data);
};

export const mergeResults = (results :GenericResult<any>[]) :GenericResult<any[]> => {

    return results.reduce((merged, result) => {
        if (result.isFailure) {
            merged.mergeErrors(result);
        } else {
            merged.success(merged.get().concat(result.get()))
        }
        return merged;
    }, new GenericResult<any[]>([]));
};
