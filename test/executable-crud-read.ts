import {ITestModelKey, ITestModelProperties} from "./model";
import {ReadCRUDExecutable} from "../src/executable/crud/read";
import {ICRUDExecutableConfig} from "../src/executable/crud";

// test ReadCRUDExecutable implementation
export class TestReadExecutable extends ReadCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
