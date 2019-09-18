import {
    GenericModel,
    IModel,
    IModelDataAdepter,
    IModelError,
    IModelOptions, modelError
} from "../model";
import {failure, GenericResult, success} from "../result";

/**
 * describes field description
 */
export interface ISchemaField {
    validate(value: any) :IModelError[];
}



/**
 * describes interface of Mode Scheme
 */
export interface ISchema {
    validateKey (key :any) :IModelError[];
    validateProperties (properties :any) :IModelError[];
    validate(model: IModel) :IModelError[];
    keyFields() :ISchemaFields;
    propertyFields() :ISchemaFields;
    isValid() :boolean;
    errors() :IModelError[];
    field(name :string) :ISchemaField;
}

interface ISchemaFields {
    [name :string] :ISchemaField;
}

export class AbstractModelSchema implements ISchema {
    _keyFields :ISchemaFields;
    _propertyFields :ISchemaFields;
    _errors :IModelError[];
    constructor(keyFields :ISchemaFields, propertyFields :ISchemaFields) {
        this._keyFields = keyFields;
        this._propertyFields = propertyFields;
        this.clear();
    }

    protected clear() {
        this._errors = [];
    }

    isValid() :boolean {
        return !this._errors.length;
    }

    errors(): IModelError[] {
        return this._errors;
    }

    keyFields() :ISchemaFields {
        return this._keyFields;
    }

    propertyFields() :ISchemaFields {
        return this._propertyFields;
    }

    protected _validate(fields :ISchemaFields, data: any): IModelError[] {
        let errors :IModelError[] = [];
        for (let field in fields) {
            const fieldErrors = fields[field].validate(data[field]);
            if (fieldErrors.length) errors = errors.concat(fieldErrors);
        }
        return errors;
    }

    validateKey(key: any) :IModelError[] {
        return this._validate(this._keyFields, key);
    }

    validateProperties(properties: any): IModelError[] {
        return this._validate(this._propertyFields, properties);
    }

    validate(model: IModel): IModelError[] {
        this.clear();
        this._errors = this.validateKey(model.getKey());
        this._errors = this._errors.concat(this.validateProperties(model.getProperties()));
        return this._errors;
    }

    field(name: string): ISchemaField {
        return this._keyFields[name] || this._propertyFields[name];
    }
}

export interface ISchemaModelOptions extends IModelOptions {
    schema: ISchema
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

/**
 * SimpleModelAdapter implements IModelDataAdepter, provides simple IO transformations for data which is superset
 * of key and properties with same properties names and types
 */
export abstract class AbstractSchemaModelAdapter<K, P> implements IModelDataAdepter<K, P> {
    protected constructor(protected schema :ISchema) {};

    protected abstract extractKey(data: any) :K;

    protected abstract extractProperties(data: any) :P;

    protected abstract composeData<D extends K & P>(key :K, properties: P) :D;

    getKey <D extends K & P>(data :D) :GenericResult<K, IModelError> {
        let key :K;
        try {
            key= this.extractKey(data);
        } catch (e) {
            return failure([modelError(e.message, null)]);
        }
        const errors = this.schema.validateKey(key);
        return new GenericResult<K, IModelError>(key, errors);
    };
    getProperties <D extends K & P>(data :D) :GenericResult<P, IModelError> {
        let properties :P;
        try {
            properties= this.extractProperties(data);
        } catch (e) {
            return failure([modelError(e.message, null)]);
        }
        const errors = this.schema.validateProperties(properties);
        return new GenericResult<P, IModelError>(properties, errors);
    };
    getData <D extends K & P>(key: K, properties: P) :GenericResult<D, IModelError> {
        return success(this.composeData(key, properties));
    }
}
