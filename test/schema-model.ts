import {
    GenericSchemaModel,
    AbstractModelSchema,
    IGenericSchemaModelOptions
} from "../src/model/schema";
import {failure, ModelValidationResult, success} from "../src";

export interface ITestModelKey {
    id :string
}

export interface ITestModelProperties {
    data? :string
    data1? :string
}

export class Schema extends AbstractModelSchema<ITestModelKey, ITestModelProperties> {
    validateKey(key :ITestModelKey) :ModelValidationResult {
        if (key.id.length >= 10)
            return failure([ AbstractModelSchema.error('length should be less than 10', 'id') ]);
        return success(true);

    };
    validateProperties(properties :ITestModelProperties) :ModelValidationResult {
        if (!(properties.data || properties.data1))
            return failure([ AbstractModelSchema.error('data or data1 field should present', '*') ]);
        return success(true);
    };
}

export class TestSchemaModel extends GenericSchemaModel<ITestModelKey, ITestModelProperties> {
    constructor(key :ITestModelKey, properties :ITestModelProperties, options :IGenericSchemaModelOptions<ITestModelKey, ITestModelProperties>) {
        super(key, properties, options);
    }
}
