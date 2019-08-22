import {ITestModelKey, ITestModelProperties, TestModel} from "./model";
import {CRUDExecutable, ICRUDExecutableConfig} from "../src/executable/crud";

// test ReadCRUDExecutable implementation
export class TestReadExecutable extends CRUDExecutable<ITestModelKey, TestModel, ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, TestModel, ITestModelKey, ITestModelProperties>) {
        super(props);
        this.executor = CRUDExecutable.readExecutor;
    }
}
