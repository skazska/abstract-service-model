import {Model} from "../src/model";

export interface ITestModelKey {
    id :string
}

export interface ITestModelProperties {
    data? :string
    data1? :string
}

export class TestModel extends Model<ITestModelKey, ITestModelProperties> {
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
