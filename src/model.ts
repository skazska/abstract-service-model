import {object as objectTools} from "@skazska/tools-data-transform";
import {IError, error} from "./error";
import {GenericResult, mergeResults} from "./result";

export interface IModelError extends IError {
    field? :string,
    isModelError? :boolean
}

export const isModelError = (error :IError) :error is IModelError => {
    return 'isModelError' in error;
};

export const modelError = (message :string, field? :string) => {
    const err :IModelError = error(message);
    err.isModelError = true;
    if (field) err.field = field;
    return err;
};

export class ModelValidationResult extends GenericResult<any, IModelError> {}

export interface IModel {
    /**
     * returns key fields
     */
    getKey () :any;

    /**
     * sets key fields
     */
    setKey (key :any) :IModel;

    /**
     * checks if key are set
     */
    hasKey () :boolean;

    /**
     * returns data fields
     */
    getProperties () :any;

    /**
     * sets data fields
     */
    setProperties (properties :any) :IModel;

    /**
     * updates data fields
     */
    update (properties :any) :IModel;
}

export interface IModelOptions {}

export abstract class GenericModel<K,P> implements IModel {
    protected _key :K;
    protected _properties :P;
    protected _options :any;

    protected constructor(key :K, properties :P, options? :IModelOptions) {
        this.setOptions(options);
        this.setKey(key);
        this.setProperties(properties);
    }

    protected setOptions(options: IModelOptions) {
        this._options = {...options};
    }

    protected getOptions() {
        return this._options;
    }

    getKey () :K {
        return {... this._key};
    }

    hasKey () :boolean {
        return !!this._key;
    }

    setKey(key :K) :GenericModel<K,P> {
        if (this.hasKey()) throw new Error("Model key can't be modified");
        this._key = (key !== null && typeof key === 'object') ? {... key} : key;
        return this;
    }

    getProperties () :P {
        return this._properties;
    }

    setProperties (properties :P) :GenericModel<K,P> {
        this._properties = properties;
        return this;
    }

    update (properties :P) :IModel {
        objectTools.update(this._properties, properties);
        return this;
    }

    static error = modelError;
}

export interface IModelConstructor<K,P> {
    new(key :K, properties :P, options? :IModelOptions) :GenericModel<K,P>
}

export interface IModelDataAdepter<K,P> {
    getKey (data :any) :GenericResult<K, IModelError>;
    getProperties (data :any) :GenericResult<P, IModelError>;
    getData (key :K, properties: P) :GenericResult<any, IModelError>;
}

export abstract class GenericModelFactory<K,P> {
    constructor(
        protected modelConstructor :IModelConstructor<K,P>,
        protected dataAdapter :IModelDataAdepter<K, P>
    ) { }

    dataKey (data :any) :GenericResult<K, IModelError> {
        return this.dataAdapter.getKey(data);
    };
    dataProperties (data :any) :GenericResult<P, IModelError> {
        return this.dataAdapter.getProperties(data);
    };
    dataModel (data :any) :GenericResult<GenericModel<K,P>, IModelError> {
        const results = [this.dataKey(data), this.dataProperties(data)];
        return <GenericResult<GenericModel<K,P>, IModelError>>mergeResults(results).wrap(
            (results) => { return new this.modelConstructor(results[0], results[1])}
        );
    };
    model (key: K, props: P) :GenericModel<K,P> {
        return new this.modelConstructor(key, props);
    };
    data (model :IModel) :any {
        return this.dataAdapter.getData(model.getKey(), model.getProperties())
    }

    static error = modelError;
}
