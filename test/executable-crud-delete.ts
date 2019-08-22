import {ITestModelKey, ITestModelProperties} from "./model";
import {CRUDExecutable, ICRUDExecutableConfig} from "../src/executable/crud";

// test ReadCRUDExecutable implementation
export class TestDeleteExecutable extends CRUDExecutable<ITestModelKey, null, ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, null, ITestModelKey, ITestModelProperties>) {
        super(props);
        this.executor = CRUDExecutable.deleteExecutor;
    }
}
