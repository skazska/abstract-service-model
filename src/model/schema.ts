/**
 * @module
 * provides model schema template and infrastructure
 */

import {
    GenericModel,
    IModel,
    IModelDataAdepter,
    IModelError,
    IModelOptions, modelError
} from "../model";
import {failure, GenericResult, success} from "../result";

/**
 * javascript data types
 */
export enum JsTypes {
    string = 'string',
    number = 'number',
    undefined = 'undefined',
    boolean = 'boolean',
    object = 'object'
}

/**
 * model field description structure
 */
export interface IFieldDescription {
    [property :string] :any
}

/**
 * field description and validation
 */

/**
 * model schema field interface
 */
export interface ISchemaField {
    name: string;
    fieldType: string;

    /** implement, should generate field description */
    description() :IFieldDescription;

    /**
     * implement field validation logic
     * @param value - field value
     */
    validate(value: any) :IModelError[];
}

/**
 * model schema validator interface
 */
export interface ISchemaValidator {
    name :string;

    /** implement descriptions, should return validation description */
    description() :string;

    /**implement check method should return null on success and check failure text on fail */
    check(value :any): null|string;
}

/**
 * javascript type validator
 */
export class JSTypeSchemaValidator implements ISchemaValidator {
    public readonly name: string;
    constructor(public readonly dataType: JsTypes) {
        this.name = 'js type';
    };

    check(value: any): string | null {
        return (typeof value === this.dataType || typeof value === 'undefined') ? null : 'js type mismatch';
    }

    description(): string {
        return 'of type ' + this.dataType;
    }
}

/**
 * required validator
 */
export class RequiredSchemaValidator implements ISchemaValidator {
    public readonly name: string;
    constructor() {
        this.name = 'required';
    };

    check(value: any): string | null {
        return typeof value == 'undefined' ? 'missing field' : null;
    }

    description(): string {
        return 'required';
    }
}

/**
 * schema field implementation
 */
export class SchemaField implements ISchemaField {
    constructor(
        public readonly name: string,
        public readonly fieldType: string,
        public readonly validators: ISchemaValidator[]
    ) {};

    description(): IFieldDescription {
        return this.validators.reduce((description, validator) => {
            description[validator.name] = validator.description();
            return description;
        }, {});
    }

    validate(value: any) :IModelError[] {
        return this.validators.map(validator => {
            const result = validator.check(value);
            return result ? modelError(result, this.name) : null
        }).filter(error => !!error);
    };
}



/**
 * describes interface of Model Schema
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

type ISchemaFields = ISchemaField[];

/**
 * Model schema implementation
 */
export class ModelSchema implements ISchema {
    _keyFields :ISchemaFields;
    _propertyFields :ISchemaFields;
    _errors :IModelError[];

    constructor(keyFields :ISchemaFields, propertyFields :ISchemaFields) {
        this._keyFields = keyFields;
        this._propertyFields = propertyFields;
        this.clear();
    }

    /** clears error messages */
    protected clear() {
        this._errors = [];
    }

    /** returns valid status */
    isValid() :boolean {
        return !this._errors.length;
    }

    /** returns validation error list */
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
        if (!data) return [modelError('no data')];
        return fields.reduce((errors, field) :IModelError[] => {
            return errors.concat(field.validate(data[field.name]));
        }, []);
    }

    validateKey(key: any) :IModelError[] {
        return this._validate(this._keyFields, key);
    }

    validateProperties(properties: any): IModelError[] {
        return this._validate(this._propertyFields, properties);
    }

    validate(model: IModel): IModelError[] {
        this.clear();
        this._errors = [];
        if (model.hasKey()) this._errors = this._errors.concat(this.validateKey(model.getKey()));
        this._errors = this._errors.concat(this.validateProperties(model.getProperties()));
        return this._errors;
    }

    field(name: string): ISchemaField {
        return this._keyFields[name] || this._propertyFields[name];
    }
}

/** Model with schema constructor options*/
export interface ISchemaModelOptions extends IModelOptions {
    schema: ISchema
}

/**
 * Model with schema generic implementation
 */
export class GenericSchemaModel<K, P> extends GenericModel<K, P> implements IModel {
    protected _schema :ISchema;

    /**
     * expects schema instance in options
     * @param key
     * @param properties
     * @param options
     */
    constructor(key :K, properties :P, options :ISchemaModelOptions) {
        super(key, properties, options);
    }

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

    static error = modelError;
}

/**
 * SchemaModelAdapter implements IModelDataAdepter, provides simple IO transformations for data which is superset
 * of key and properties with same properties names and types
 */
export interface IFieldMap {
    [name :string] :string;
}

export class SchemaModelAdapter<K, P, D> implements IModelDataAdepter<K, P> {
    constructor(protected schema :ISchema, public fieldMap: IFieldMap) {};

    protected extract(fields :ISchemaFields, data :D) :any{
        return fields.reduce((result, field) => {
            if (this.fieldMap) {
                const dataName = this.fieldMap[field.name];
                if (dataName) result[field.name] = data[dataName];
            } else {
                result[field.name] = data[field.name];
            }
            return result;
        }, {});
    }

    protected extractKey(data: D) :K {
        return this.extract(this.schema.keyFields(), data);
    };

    protected extractProperties(data: D) :P {
        return this.extract(this.schema.propertyFields(), data);
    };

    protected compose(fields :ISchemaFields, data :Partial<K & D>) :any {
        return fields.reduce((result, field) => {
            if (this.fieldMap) {
                const dataName = this.fieldMap[field.name];
                if (dataName) result[dataName] = data[field.name];
            } else {
                result[field.name] = data[field.name];
            }
            return result;
        }, {});
    }

    protected composeData(key :K, properties: P) :D {
        const keyData = this.compose(this.schema.keyFields(), key);
        const propertyData = this.compose(this.schema.propertyFields(), properties);

        return {...keyData, ...propertyData};
    };

    getKey (data :D) :GenericResult<K> {
        let key :K;
        try {
            key= this.extractKey(data);
        } catch (e) {
            return failure([modelError(e.message, null)]);
        }
        const errors = this.schema.validateKey(key);
        return new GenericResult<K>(key, errors);
    };
    getProperties (data :D) :GenericResult<P> {
        let properties :P;
        try {
            properties= this.extractProperties(data);
        } catch (e) {
            return failure([modelError(e.message, null)]);
        }
        const errors = this.schema.validateProperties(properties);
        return new GenericResult<P>(properties, errors);
    };
    getData (key: K, properties: P) :GenericResult<D> {
        return success(this.composeData(key, properties));
    }
}
