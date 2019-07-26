import {ModelFactory, GenericModel, IGenericModelOptions} from "../src/model";

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

export class TestModelFactory extends ModelFactory<ITestModelKey,ITestModelProperties> {
    constructor() {
        super(TestModel);
    }

    dataKey (data :any) :ITestModelKey {
        return {id: data.id};
    };
    dataProperties (data :any) :ITestModelProperties {
        let result :ITestModelProperties = {};
        if (data.data) result.data = data.data;
        if (data.data1) result.data1 = data.data1;
        return result;
    };
}
