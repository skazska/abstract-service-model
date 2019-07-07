import {object as objectTools} from "@skazska/tools-data-transform";

export interface IModel {
    /**
     * @property
     * holds key fields
     */

    readonly key :any;
    /**
     * @property
     * holds data fields
     */
    properties :any;

    /**
     * @property
     * provides combined keys and data fields record
     */
    readonly data :any;

    /**
     * updates data fields
     */
    update (properties :any) :IModel;
}

export class GenericModel<K,P> implements IModel {
    protected _key :K;
    protected _properties :P;

    constructor (key :K, properties :P) {
        this.properties = properties;
        this._key = typeof key === 'object' ? {... key} : key;
    }

    set properties (properties :P) {
        this._properties = properties;
    }

    get properties () :P {
        return this._properties;
    }

    get key () :K {
        return {... this._key};
    }

    get data () :K & P {
        return {... this.properties, ... this.key}
    }

    update (properties :P) :IModel {
        objectTools.update(this._properties, properties);
        return this;
    }
}

interface IModelConstructor<K,P> {
    new(key :K, properties :P) :GenericModel<K,P>
}

export abstract class ModelFactory<K,P> {
    protected modelConstructor :IModelConstructor<K,P>;
    protected constructor(modelConstructor? :IModelConstructor<K,P>) {
        this.modelConstructor = modelConstructor;
    }
    abstract key (data :any) :K;
    abstract props (data :any) :P;
    dataModel (data :any) :GenericModel<K,P> {
        return new this.modelConstructor(this.key(data), this.props(data));
    };
    model (key: K, props: P) :GenericModel<K,P> {
        return new this.modelConstructor(key, props);
    }
}
