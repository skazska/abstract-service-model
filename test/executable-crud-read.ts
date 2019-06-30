// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
import {ITestModelKey, ITestModelProperties, TestModel} from "./model";
import {IReadExecutableConfig, ReadCRUDExecutable} from "../src/executable/crud/read";
import {TestModelFactory} from "./model";
import {TestStorage} from "./model-storage";

use(sinonChai);

// test ReadCRUDExecutable implementation
export class TestReadExecutable extends ReadCRUDExecutable<ITestModelKey, ITestModelProperties> {
    constructor(props :IReadExecutableConfig<ITestModelKey, ITestModelProperties>) {
        super(props);
    }
}
