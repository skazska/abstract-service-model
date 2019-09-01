import {
    GenericModelFactory,
    GenericModel,
    IModelOptions,
    IModelDataAdepter,
    ModelValidationResult, IModelError, modelError, SimpleModelAdapter
} from "../src/model";
import {failure, GenericResult, success} from "../src";

export interface ITestModelKey {
    id :string
}

export interface ITestModelProperties {
    data? :string
    data1? :string
    data2? :string
}

export interface ITestModelOptions extends IModelOptions{
    option1: string
}

export class TestModel extends GenericModel<ITestModelKey, ITestModelProperties> {

    constructor(key :ITestModelKey, properties :ITestModelProperties, options? :ITestModelOptions) {
        super(key, properties);
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

export class TestModelDataAdapter extends SimpleModelAdapter<ITestModelKey,ITestModelProperties> {}

export class TestModelFactory extends GenericModelFactory<ITestModelKey,ITestModelProperties> {
    constructor() {
        super(TestModel, new TestModelDataAdapter(['id'], ['data', 'data1', 'data1']));
    }
}
