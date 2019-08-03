import {GenericModel, IGenericModelOptions, IModel, IModelError, ModelValidationResult} from "../model";
import {failure, success} from "../result";

const error = (description :string, field? :string) :IModelError => {
    const err :IModelError = {
        description: description
    };
    if (field) err.field = field;
    return err;
};

export abstract class AbstractModelSchema<K, P> {
    abstract validateKey(key :K) :ModelValidationResult;
    abstract validateProperties(properties :P) :ModelValidationResult;
    static error = error
}

export interface IGenericSchemaModelOptions<K,P> extends IGenericModelOptions<K,P> {
    schema? :AbstractModelSchema<K,P>
}

export class GenericSchemaModel<K,P> extends GenericModel<K, P> implements IModel {
    protected _schema? :AbstractModelSchema<K,P>;
    protected _keySchemaStatus? :ModelValidationResult;
    protected _schemaStatus? :ModelValidationResult;

    constructor (key :K, properties :P, options :IGenericSchemaModelOptions<K,P>) {
        super(key, properties, options);
    }

    protected setOptions(options: IGenericSchemaModelOptions<K, P>) {
        this._schema = options.schema;
        this._keySchemaStatus = success(true);
        this._schemaStatus = success(true);
    }

    protected setKey (key :K) :GenericModel<K,P> {
        this._keySchemaStatus = this._schema.validateKey(key);
        return super.setKey(key);
    }

    setProperties (properties :P) :GenericModel<K,P> {
        this._schemaStatus = this._schema.validateProperties(properties);
        return super.setProperties(properties);
    }

    validate () {
        if (!this._schema) return new ModelValidationResult().success(true);
        return this._schema.validateKey(this.getKey()).merge(this._schema.validateProperties(this.getProperties()));
    }
}
