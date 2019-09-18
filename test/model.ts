import {
    GenericModelFactory,
    SimpleModelAdapter,
} from "../src/model";
import {GenericSchemaModel, SchemaModelAdapter} from "../src/model/schema";

export interface ITestModelKey {
    id :string
}

export interface ITestModelProperties {
    data? :string
    data1? :string
    data2? :string
}

export class TestModel extends GenericSchemaModel<ITestModelKey, ITestModelProperties> {
    constructor(key, properties, options?) {
        super(key, properties, options);
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
export class TestSchemaModelAdapter extends SchemaModelAdapter<ITestModelKey,ITestModelProperties> {
    protected composeData<D extends ITestModelKey & ITestModelProperties>(key: ITestModelKey, properties: ITestModelProperties): D {
        return undefined;
    }

    protected extractKey(data: any): ITestModelKey {
        return undefined;
    }

    protected extractProperties(data: any): ITestModelProperties {
        return undefined;
    }

}

export class TestModelFactory extends GenericModelFactory<ITestModelKey,ITestModelProperties> {
    constructor() {
        super(TestModel, new TestModelDataAdapter(['id'], ['data', 'data1', 'data1']));
    }
}
