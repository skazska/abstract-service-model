import {object as objectTools} from "@skazska/tools-data-transform";
import {IError} from "../error";
import {GenericModel, IGenericModelOptions, IModel} from "../model";

export interface ISchemaError extends IError {
    field? :string
}

export interface IGenericSchemaModelOptions<K,P> extends IGenericModelOptions<K,P> {
    schema? :IModelSchema<K,P>
}

export class GenericSchemaModel<K,P> extends GenericModel<K, P> {
    protected _schema? :IModelSchema<K,P>;
    protected _keySchemaStatus? :boolean|ISchemaError[];
    protected _schemaStatus? :boolean|ISchemaError[];

    constructor (key :K, properties :P, options :IGenericSchemaModelOptions<K,P>) {
        super(key, properties, options);
    }

    setOptions(options: IGenericSchemaModelOptions<K, P>) {
        this._schema = options.schema;
        this._keySchemaStatus = true;
        this._schemaStatus = true;
    }

    setKey (key :K) :GenericModel<K,P> {
        this._schemaStatus = this._schema.validateKey(key);
        this._key = typeof key === 'object' ? {... key} : key;
        return this;
    }

    setProperties (properties :P) :GenericModel<K,P> {
        this._schemaStatus = this._schema.validateProperties(properties);
        this._properties = properties;
        return this;
    }

    getSchema() :any {
        return this._schema;
    }

    getSchemaStatus() :boolean|ISchemaError[] {
        if (this._schemaStatus === true && this._keySchemaStatus === true) return true;
        if (this._schemaStatus === true) return this._keySchemaStatus;
        if (this._keySchemaStatus === true) return this._schemaStatus;
        return (<ISchemaError[]>this._keySchemaStatus).concat(<ISchemaError[]>this._schemaStatus);
    }

    validate () {
        if (this._schema) {
            this._keySchemaStatus = this._schema.validateKey(this.getKey());
            this._schemaStatus = this._schema.validateProperties(this.getProperties());
        }
        return this.getSchemaStatus();
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

export interface IModelSchema<K, P> {
    validateKey(key :K) :boolean|ISchemaError[];
    validateProperties(properties :P) :boolean|ISchemaError[];
}
