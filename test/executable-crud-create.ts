import {ITestModelKey, ITestModelProperties, TestModel} from "./model";
import {CRUDExecutable, ICRUDExecutableConfig, ICUExecuteOptions} from "../src/executable/crud";

// test CreateCRUDExecutable implementation
export class TestCreateExecutable
    extends CRUDExecutable<ICUExecuteOptions, TestModel, ITestModelKey, ITestModelProperties>
{
    constructor(props :ICRUDExecutableConfig<ICUExecuteOptions, TestModel, ITestModelKey, ITestModelProperties>) {
        super(props);
        this.executor = CRUDExecutable.createExecutor;
    }
}
