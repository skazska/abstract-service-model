// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
import {ITestModelKey, ITestModelProperties} from "./model";
import {DeleteCRUDExecutable} from "../src/executable/crud/delete";
import {ICRUDExecutableConfig} from "../src/executable/crud";

use(sinonChai);

// test ReadCRUDExecutable implementation
export class TestDeleteExecutable extends DeleteCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
