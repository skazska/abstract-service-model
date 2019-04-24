import {Model, IModelKey, IModelProperties} from "../src/model";

export interface ITestModelKey extends IModelKey {
    id :string
}

export interface ITestModelProperties extends IModelProperties {
    data? :string
    data1? :string
}

export class TestModel extends Model {
    constructor(key :ITestModelKey, properties :ITestModelProperties) {
        super(key, properties);
    }

    get key() :ITestModelKey {
        return <ITestModelKey>super.key;
    }

    get properties() :ITestModelProperties {
        return <ITestModelProperties>super.properties;
    }

    set properties(properties :ITestModelProperties) {
        super.properties = properties;
    }

}
