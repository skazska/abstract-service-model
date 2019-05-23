export interface IFail<E> {
    isFailure? :boolean,
    errors? :Array<E>
}

export class Result<T, E> implements IFail<E> {
    constructor (
        protected _result :T,
        protected _errors:E[]
    ) {}

    get errors () {
        return this._errors;
    }

    get isFailure () {
        return !!this._errors
    }

    get () :T {
        return this._result;
    }
}

