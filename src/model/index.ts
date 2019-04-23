import {ModelKeyInterface, ModelInterface, ModelPropertiesInterface} from "./interface"
import {object as objectTools} from "@skazska/tools-data-transform";

export * from "./interface";

export class Model implements ModelInterface {
    static keyNames: ReadonlyArray<string> = [];

    protected _key :ModelKeyInterface;
    protected _properties :ModelPropertiesInterface;

    constructor (key :ModelKeyInterface, properties :ModelPropertiesInterface) {
        this.properties = properties;
        this._key = {... key};
    }

    set properties (properties :ModelPropertiesInterface) {
        this._properties = properties;
    }

    get properties () :ModelPropertiesInterface {
        return this._properties;
    }

    get key () :ModelKeyInterface {
        return {... this._key};
    }

    get data () :any {
        return {... this.properties, ... this.key}
    }

    update (properties :ModelPropertiesInterface) :ModelInterface {
        objectTools.update(this._properties, properties);
        return this;
    }
}