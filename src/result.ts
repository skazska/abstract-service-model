export interface IFail<E> {
    isFailure? :boolean,
    errors? :Array<E>
}

export class Result<T, E> implements IFail<E> {
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

    error (err :E) :Result<T, E> {
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

export const failure = <E>(list :E[]) :Result<null, E> => {
    return new Result<null, E>(null, list);
};

export const result = <T>(data :T) :Result<T, never> => {
    return new Result<T, never>(data);
};

