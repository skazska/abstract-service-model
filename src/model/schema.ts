import {
    GenericModel,
    IModel,
    IModelDataAdepter,
    IModelError,
    IModelOptions, modelError
} from "../model";
import {failure, GenericResult, success} from "../result";

export enum JsTypes {
    string = 'string',
    number = 'number',
    undefined = 'undefined',
    boolean = 'boolean',
    object = 'object'
}

/**
 * field description and validation
 */
export interface ISchemaField {
    fieldType: string;
    dataType: string;
    name: string;
    validate(value: any) :IModelError[];
}

export class JSTypedSchemaField implements ISchemaField {
    public readonly fieldType: string;
    constructor(public readonly name: string, public readonly dataType: JsTypes) {
        this.fieldType = dataType;
    };

    validate(value: any) :IModelError[] {
        const result :IModelError[] = [];
        if (typeof value == this.dataType) result.push(modelError('js type mismatch', this.name));
        return result;
    };
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

export class ModelSchema implements ISchema {
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
 * SchemaModelAdapter implements IModelDataAdepter, provides simple IO transformations for data which is superset
 * of key and properties with same properties names and types
 */
export interface IFieldMap {
    [name :string] :string;
}

export class SchemaModelAdapter<K, P> implements IModelDataAdepter<K, P> {
    constructor(protected schema :ISchema, public fieldMap: IFieldMap) {};

    protected extract(fields :ISchemaFields, data :any) :any{
        const result :any = {};
        for (let name in fields) {
            if (this.fieldMap) {
                const dataName = this.fieldMap[name];
                if (dataName) result[name] = data[dataName];
            } else {
                result[name] = data[name];
            }
        }
    }

    protected extractKey(data: any) :K {
        return this.extract(this.schema.keyFields(), data);
    };

    protected extractProperties(data: any) :P {
        return this.extract(this.schema.propertyFields(), data);
    };

    protected compose(fields :ISchemaFields, data :any) :any {
        const result :any = {};
        for (let name in fields) {
            if (this.fieldMap) {
                const dataName = this.fieldMap[name];
                if (dataName) result[dataName] = data[name];
            } else {
                result[name] = data[name];
            }
        }
        return result;
    }

    protected composeData<D extends K & P>(key :K, properties: P) :D {
        const keyData = this.compose(this.schema.keyFields(), key);
        const propertyData = this.compose(this.schema.propertyFields(), properties);

        return {...keyData, ...propertyData};
    };

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
