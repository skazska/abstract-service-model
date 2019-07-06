// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
import {ITestModelKey, ITestModelProperties} from "./model";
import {CreateCRUDExecutable} from "../src/executable/crud/create";
import {ICRUDExecutableConfig} from "../src/executable/crud";

use(sinonChai);

// test CreateCRUDExecutable implementation
export class TestUpdateExecutable extends CreateCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
