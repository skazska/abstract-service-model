import {ModelKeyInterface, ModelInterface, ModelPropertiesInterface} from "./interface"
import {object as objectTools} from "@skazska/tools-data-transform";

export * from "./interface";

export class Model implements ModelInterface {
    protected _keys :ReadonlyArray<string> = ['id'];
    protected _key :ModelKeyInterface;
    protected _properties :ModelPropertiesInterface;

    /**
     * constructor
     * @param {*} id
     * @param {Object} properties
     * @param {Service} service
     */
    constructor (key, properties) {
        this.properties = properties;
        this._key = {... key};
    }

    set properties (properties) {
        this._properties = {...properties};
    }

    get properties () {
        return {... this._properties};
    }

    get key () {
        return {... this._key};
    }

    get keys () {
        return [... this._keys];
    }

    get data () {
        return {... this.properties, ... this.key}
    }

    update (properties) {
        objectTools.update(this._properties, properties);
        return this;
    }
}