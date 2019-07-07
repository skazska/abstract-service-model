import {ITestModelKey, ITestModelProperties} from "./model";
import {DeleteCRUDExecutable} from "../src/executable/crud/delete";
import {ICRUDExecutableConfig} from "../src/executable/crud";

// test ReadCRUDExecutable implementation
export class TestDeleteExecutable extends DeleteCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
