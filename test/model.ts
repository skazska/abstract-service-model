import {
    GenericModelFactory,
    GenericModel,
    IGenericModelOptions,
    IModelDataAdepter,
    ModelValidationResult, IModelError
} from "../src/model";
import {GenericResult, success} from "../src";

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

    protected setOptions(options: IGenericModelOptions<ITestModelKey, ITestModelProperties>) {

    }

    get id() {
        return this._key.id;
    }

    get data() {
        return this._properties.data;
    }

    get data1() {
        return this._properties.data1;
    }

    set data(val :string) {
        this._properties.data = val;
    }

    set data1(val :string) {
        this._properties.data1 = val;
    }

}

class TestModelDataAdapter implements IModelDataAdepter<ITestModelKey,ITestModelProperties> {
    getKey (data :any) :GenericResult<ITestModelKey, IModelError> {
        return success({id: data.id});
    };
    getProperties (data :any) :GenericResult<ITestModelProperties, IModelError> {
        let result :ITestModelProperties = {};
        if (data.data) result.data = data.data;
        if (data.data1) result.data1 = data.data1;
        return success(result);
    };
    getData(key: ITestModelKey, properties: ITestModelProperties): any {
        return {...key, ...properties}
    }
}

export class TestModelFactory extends GenericModelFactory<ITestModelKey,ITestModelProperties> {
    constructor() {
        super(TestModel, new TestModelDataAdapter());
    }
}
