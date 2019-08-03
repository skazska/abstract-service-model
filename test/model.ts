import {
    GenericModelFactory,
    GenericModel,
    IGenericModelOptions,
    IModelDataAdepter,
    ModelValidationResult
} from "../src/model";

export interface ITestModelKey {
    id :string
}

export interface ITestModelProperties {
    data? :string
    data1? :string
}

export class TestModel extends GenericModel<ITestModelKey, ITestModelProperties> {
    constructor(key :ITestModelKey, properties :ITestModelProperties) {
        super(key, properties);
    }

    setOptions(options: IGenericModelOptions<ITestModelKey, ITestModelProperties>) {

    }
}

class TestModelDataAdapter implements IModelDataAdepter<ITestModelKey,ITestModelProperties> {
    getKey (data :any) :ITestModelKey {
        return {id: data.id};
    };
    getProperties (data :any) :ITestModelProperties {
        let result :ITestModelProperties = {};
        if (data.data) result.data = data.data;
        if (data.data1) result.data1 = data.data1;
        return result;
    };
}

export class TestModelFactory extends GenericModelFactory<ITestModelKey,ITestModelProperties> {
    constructor() {
        super(TestModel, new TestModelDataAdapter());
    }
}
