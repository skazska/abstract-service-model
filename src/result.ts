export class GenericResult<T, E> {
    constructor (
        protected _result? :T,
        protected _errors? :E[]
    ) {}

    get errors () :E[] {
        return this._errors;
    }

    get isFailure () :boolean {
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

    mergeErrors (...results :GenericResult<any, E>[]) :GenericResult<T, E> {
        results.forEach(result => {
            if (result.isFailure) {
                this._errors = (this._errors || []).concat(result.errors);
            }
        });

        return this;
    }

    wrap <T1, E1>(continuation :(data :T) => T1, errorConverter? :(error :E)=>E1) :GenericResult<T1, E1> {
        if (this.isFailure)
            return failure(errorConverter ? this.errors.map(errorConverter) : <E1[]><any>this.errors);
        try {
            return success(continuation(this.get()));
        } catch (e) {
            failure(errorConverter ? [errorConverter(e)] : [e]);
        }
    }
}

export const failure = <E>(list :E[]) :GenericResult<null, E> => {
    return new GenericResult<null, E>(null, list);
};

export const success = <T>(data :T) :GenericResult<T, never> => {
    return new GenericResult<T, never>(data);
};

export const mergeResults = (results :GenericResult<any,any>[]) :GenericResult<any[],any> => {
    return results.reduce((merged, result) => {
        if (result.isFailure) {
            merged.mergeErrors(result);
        } else {
            merged.success(merged.get().concat(result.get()))
        }
        return merged;
    }, new GenericResult<any[], any>([]));
};
