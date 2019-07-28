import {IError} from "../error";
import {GenericModel, IGenericModelOptions, IModel} from "../model";

export interface ISchemaError extends IError {
    field? :string
}

const error = (description :string, field? :string) :ISchemaError => {
    const err :ISchemaError = {
        description: description
    };
    if (field) err.field = field;
    return err;
};

export abstract class AbstractModelSchema<K, P> {
    abstract validateKey(key :K) :boolean|ISchemaError[];
    abstract validateProperties(properties :P) :boolean|ISchemaError[];
    static error = error
}

export interface IGenericSchemaModelOptions<K,P> extends IGenericModelOptions<K,P> {
    schema? :AbstractModelSchema<K,P>
}

export class GenericSchemaModel<K,P> extends GenericModel<K, P> {
    protected _schema? :AbstractModelSchema<K,P>;
    protected _keySchemaStatus? :boolean|ISchemaError[];
    protected _schemaStatus? :boolean|ISchemaError[];

    constructor (key :K, properties :P, options :IGenericSchemaModelOptions<K,P>) {
        super(key, properties, options);
    }

    protected setOptions(options: IGenericSchemaModelOptions<K, P>) {
        this._schema = options.schema;
        this._keySchemaStatus = true;
        this._schemaStatus = true;
    }

    setKey (key :K) :GenericModel<K,P> {
        this._keySchemaStatus = this._schema.validateKey(key);
        return super.setKey(key);
    }

    setProperties (properties :P) :GenericModel<K,P> {
        this._schemaStatus = this._schema.validateProperties(properties);
        return super.setProperties(properties);
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

// export interface IModelConstructor<K,P> {
//     new(key :K, properties :P) :GenericModel<K,P>
// }

// export abstract class ModelFactory<K,P> {
//     constructor(
//         protected modelConstructor :IModelConstructor<K,P>
//     ) { }
//
//     abstract dataKey (data :any) :K;
//     abstract dataProperties (data :any) :P;
//     dataModel (data :any) :GenericModel<K,P> {
//         return new this.modelConstructor(this.dataKey(data), this.dataProperties(data));
//     };
//     model (key: K, props: P) :GenericModel<K,P> {
//         return new this.modelConstructor(key, props);
//     }
// }
