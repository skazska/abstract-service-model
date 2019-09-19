import {
    GenericModel,
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

/**
 * Model
 */

export class TestModel extends GenericModel<ITestModelKey, ITestModelProperties> {

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

/**
 * SchemaModel
 */

export class TestSchemaModel extends GenericSchemaModel<ITestModelKey, ITestModelProperties> {
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

export class TestSchemaModelAdapter extends SchemaModelAdapter<ITestModelKey,ITestModelProperties, any> {}

export class TestSchemaModelFactory extends GenericModelFactory<ITestModelKey,ITestModelProperties> {}
