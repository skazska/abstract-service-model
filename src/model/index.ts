import {IModelKey, IModel, IModelProperties} from "./interface"
import {object as objectTools} from "@skazska/tools-data-transform";

export * from "./interface";

export class Model implements IModel {
    static keyNames: ReadonlyArray<string> = [];

    protected _key :IModelKey;
    protected _properties :IModelProperties;

    constructor (key :IModelKey, properties :IModelProperties) {
        this.properties = properties;
        this._key = {... key};
    }

    set properties (properties :IModelProperties) {
        this._properties = properties;
    }

    get properties () :IModelProperties {
        return this._properties;
    }

    get key () :IModelKey {
        return {... this._key};
    }

    get data () :any {
        return {... this.properties, ... this.key}
    }

    update (properties :IModelProperties) :IModel {
        objectTools.update(this._properties, properties);
        return this;
    }
}