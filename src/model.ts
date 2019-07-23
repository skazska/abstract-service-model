import {object as objectTools} from "@skazska/tools-data-transform";

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
    setProperties (properties :any) :any;

    /**
     * returns schema
     */
    getSchema () :any;

    /**
     * sets schema
     */
    setSchema (schema :any) :any;

    /**
     * returns combined keys and data fields record
     */
    getData () :any;

    /**
     * updates data fields
     */
    update (properties :any) :any;
}

export class GenericModel<K,P> implements IModel {
    protected _key :K;
    protected _properties :P;
    protected _schema? :any;

    constructor (key :K, properties :P, schema? :any) {
        this.setProperties(properties);
        this._key = typeof key === 'object' ? {... key} : key;
        this.setSchema(schema);
    }

    getSchema() :any {
        return this._schema;
    }

    setSchema(schema :any) :GenericModel<K,P> {
        this._schema = schema;
        return this;
    }

    setProperties (properties :P) :GenericModel<K,P> {
        this._properties = properties;
        return this;
    }

    getProperties () :P {
        return this._properties;
    }

    getKey () :K {
        return {... this._key};
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
    new(key :K, properties :P) :GenericModel<K,P>
}

export abstract class ModelFactory<K,P> {
    constructor(
        protected modelConstructor :IModelConstructor<K,P>
    ) { }

    abstract dataKey (data :any) :K;
    abstract dataProperties (data :any) :P;
    dataModel (data :any) :GenericModel<K,P> {
        return new this.modelConstructor(this.dataKey(data), this.dataProperties(data));
    };
    model (key: K, props: P) :GenericModel<K,P> {
        return new this.modelConstructor(key, props);
    }
}
