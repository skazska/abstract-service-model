import {ITestModelKey, ITestModelProperties} from "./model";
import {CreateCRUDExecutable} from "../src/executable/crud/create";
import {ICRUDExecutableConfig} from "../src/executable/crud";

// test CreateCRUDExecutable implementation
export class TestUpdateExecutable extends CreateCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
