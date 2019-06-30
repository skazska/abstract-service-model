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

export abstract class ModelFactory<K,P> {
    abstract key (data :any) :K;
    abstract props (data :any) :P;
    model (data :any) :IModel {
        return new Model(this.key(data), this.props(data));
    };
}

import {object as objectTools} from "@skazska/tools-data-transform";

export class Model<K,P> implements IModel {
    static keyNames: ReadonlyArray<string> = [];

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
