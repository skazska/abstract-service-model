// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
import {ITestModelKey, ITestModelProperties} from "./model";
import {UpdateCRUDExecutable} from "../src/executable/crud/update";
import {ICRUDExecutableConfig} from "../src/executable/crud";

use(sinonChai);

// test CreateCRUDExecutable implementation
export class TestUpdateExecutable extends UpdateCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
