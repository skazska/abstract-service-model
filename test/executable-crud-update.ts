import {ITestModelKey, ITestModelProperties} from "./model";
import {UpdateCRUDExecutable} from "../src/executable/crud/update";
import {ICRUDExecutableConfig} from "../src/executable/crud";

// test CreateCRUDExecutable implementation
export class TestUpdateExecutable extends UpdateCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
