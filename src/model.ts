import {object as objectTools} from "@skazska/tools-data-transform";
import {IError} from "./error";
import {GenericResult} from "./result";

export interface IModelError extends IError {
    field? :string
}

export class ModelValidationResult extends GenericResult<any, IModelError> {}

export interface IModel {
    /**
     * returns key fields
     */
    getKey () :any;

    /**
     * returns data fields
     */
    getProperties () :any;

    /**
     * sets data fields
     */
    setProperties (properties :any) :IModel;

    /**
     * returns combined keys and data fields record
     */
    getData () :any;

    /**
     * updates data fields
     */
    update (properties :any) :IModel;
}

export interface IGenericModelOptions<K,P> {}

export abstract class GenericModel<K,P> implements IModel {
    protected _key :K;
    protected _properties :P;

    protected constructor(key :K, properties :P, options? :IGenericModelOptions<K,P>) {
        this.setOptions(options);
        this.setKey(key);
        this.setProperties(properties);
    }

    protected abstract setOptions(options: IGenericModelOptions<K,P>)

    getKey () :K {
        return {... this._key};
    }

    protected setKey(key :K) :GenericModel<K,P> {
        this._key = typeof key === 'object' ? {... key} : key;
        return this;
    }

    getProperties () :P {
        return this._properties;
    }

    setProperties (properties :P) :GenericModel<K,P> {
        this._properties = properties;
        return this;
    }

    getData () :K & P {
        return {... this.getProperties(), ... this.getKey()}
    }

    update (properties :P) :IModel {
        objectTools.update(this._properties, properties);
        return this;
    }
}

export interface IModelConstructor<K,P> {
    new(key :K, properties :P, options? :IGenericModelOptions<K,P>) :GenericModel<K,P>
}

export interface IModelDataAdepter<K,P> {
    getKey (data :any) :K;
    getProperties (data :any) :P;
}

export abstract class GenericModelFactory<K,P> {
    constructor(
        protected modelConstructor :IModelConstructor<K,P>,
        protected dataAdapter :IModelDataAdepter<K, P>
    ) { }

    dataKey (data :any) :K {
        return this.dataAdapter.getKey(data);
    };
    dataProperties (data :any) :P {
        return this.dataAdapter.getProperties(data);
    };
    dataModel (data :any) :GenericModel<K,P> {
        return new this.modelConstructor(this.dataKey(data), this.dataProperties(data));
    };
    model (key: K, props: P) :GenericModel<K,P> {
        return new this.modelConstructor(key, props);
    }
}
