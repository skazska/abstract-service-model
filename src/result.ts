export interface IFail<E> {
    isFailure? :boolean,
    errors? :Array<E>
}

export class GenericResult<T, E> implements IFail<E> {
    constructor (
        protected _result? :T,
        protected _errors? :E[]
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

    error (err :E) :GenericResult<T, E> {
        if (!this._errors) {
            this._errors = [err];
        } else {
            this._errors.push(err);
        }
        return this;
    }

    success (data :T) {
        this._result = data;
    }
}

export const failure = <E>(list :E[]) :GenericResult<null, E> => {
    return new GenericResult<null, E>(null, list);
};

export const success = <T>(data :T) :GenericResult<T, never> => {
    return new GenericResult<T, never>(data);
};

