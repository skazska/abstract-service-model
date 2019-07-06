// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
import {ITestModelKey, ITestModelProperties} from "./model";
import {ReadCRUDExecutable} from "../src/executable/crud/read";
import {ICRUDExecutableConfig} from "../src/executable/crud";

use(sinonChai);

// test ReadCRUDExecutable implementation
export class TestReadExecutable extends ReadCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :ICRUDExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
