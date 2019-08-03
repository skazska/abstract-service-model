export class GenericResult<T, E> {
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

    success (data :T) :GenericResult<T, E> {
        this._result = data;
        return this;
    }

    merge (...results :GenericResult<T, E>[]) :GenericResult<T, E> {
        results.forEach(result => {
            if (result.isFailure) {
                this._errors = (this._errors || []).concat(result.errors);
            }
        });

        return this;
    }
}

export const failure = <E>(list :E[]) :GenericResult<null, E> => {
    return new GenericResult<null, E>(null, list);
};

export const success = <T>(data :T) :GenericResult<T, never> => {
    return new GenericResult<T, never>(data);
};

