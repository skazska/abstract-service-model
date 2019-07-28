import {
    GenericSchemaModel,
    AbstractModelSchema,
    ISchemaError,
    IGenericSchemaModelOptions
} from "../src/model/schema";

export interface ITestModelKey {
    id :string
}

export interface ITestModelProperties {
    data? :string
    data1? :string
}

export class Schema extends AbstractModelSchema<ITestModelKey, ITestModelProperties> {
    validateKey(key :ITestModelKey) :boolean|ISchemaError[] {
        return (key.id.length < 10) ||
            [ AbstractModelSchema.error('length should be less than 10', 'id') ];
    };
    validateProperties(properties :ITestModelProperties) :boolean|ISchemaError[] {
        return !!(properties.data || properties.data1) ||
            [ AbstractModelSchema.error('data or data1 field should present', '*') ];
    };
}

export class TestSchemaModel extends GenericSchemaModel<ITestModelKey, ITestModelProperties> {
    constructor(key :ITestModelKey, properties :ITestModelProperties, options :IGenericSchemaModelOptions<ITestModelKey, ITestModelProperties>) {
        super(key, properties, options);
    }
}

// export class TestModelFactory extends ModelFactory<ITestModelKey,ITestModelProperties> {
//     constructor() {
//         super(TestModel);
//     }
//
//     dataKey (data :any) :ITestModelKey {
//         return {id: data.id};
//     };
//     dataProperties (data :any) :ITestModelProperties {
//         let result :ITestModelProperties = {};
//         if (data.data) result.data = data.data;
//         if (data.data1) result.data1 = data.data1;
//         return result;
//     };
// }
