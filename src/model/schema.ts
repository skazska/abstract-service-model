import {GenericModel, IGenericModelOptions, IModel, IModelError, IModelOptions, ModelValidationResult} from "../model";
import {failure, success} from "../result";
import {ISchema} from "../../dist/model/schema";

/**
 * describes field description
 */
export interface IFieldDescription {

}

/**
 * describes interface of Mode Scheme
 */
export interface ISchema {
    validateField (name :string, value :any) :true|IModelError[];
    validate(model: IModel) :true|IModelError[];
    readonly isValid :true|IModelError[];
    readonly [field :string] :IFieldDescription;
}

export interface ISchemaModelOptions extends IModelOptions {
    schema: ISchema
}

export class AbstractModelSchema implements ISchema {

}

export abstract class GenericSchemaModel<K, P> extends GenericModel<K, P> implements IModel {
    protected _schema :ISchema;
    protected setOptions(options: ISchemaModelOptions) {
        super.setOptions(options);
        this._schema = options.schema;
    }

    setKey (key :K) :GenericModel<K,P> {
        const result = super.setKey(key);
        this._schema.validate(this);
        return result;
    }

    setProperties (properties :P) :GenericModel<K,P> {
        const result = super.setProperties(properties);
        this._schema.validate(this);
        return result;
    }

    update(properties: P): IModel {
        const result = super.update(properties);
        this._schema.validate(this);
        return result;
    }
}
//
// export interface IGenericSchemaModelOptions<K,P> extends IGenericModelOptions<K,P> {
//     schema? :AbstractModelSchema<K,P>
// }
//
// export class GenericSchemaModel<K,P> extends GenericModel<K, P> implements IModel {
//     protected _schema? :AbstractModelSchema<K,P>;
//     protected _keySchemaStatus? :ModelValidationResult;
//     protected _schemaStatus? :ModelValidationResult;
//
//     constructor (key :K, properties :P, options :IGenericSchemaModelOptions<K,P>) {
//         super(key, properties, options);
//     }
//
//     protected setOptions(options: IGenericSchemaModelOptions<K, P>) {
//         this._schema = options.schema;
//         this._keySchemaStatus = success(true);
//         this._schemaStatus = success(true);
//     }
//
//     protected setKey (key :K) :GenericModel<K,P> {
//         this._keySchemaStatus = this._schema.validateKey(key);
//         return super.setKey(key);
//     }
//
//     setProperties (properties :P) :GenericModel<K,P> {
//         this._schemaStatus = this._schema.validateProperties(properties);
//         return super.setProperties(properties);
//     }
//
//     validate () {
//         if (!this._schema) return new ModelValidationResult().success(true);
//         return this._schema.validateKey(this.getKey()).mergeErrors(this._schema.validateProperties(this.getProperties()));
//     }
// }
