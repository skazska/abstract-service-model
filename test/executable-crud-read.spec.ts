// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {TestModel} from "./model";
import {TestModelFactory} from "./model";
import {ITestStorageConfig, TestStorage} from "./model-storage";
import {TestReadExecutable} from "./executable-crud-read";
import {GenericResult, IModelError} from "../src";

// use(sinonChai);

const testStorageConfig :ITestStorageConfig = {
    data: [
        [ 'id', { data: new TestModel({id: 'id'}, {data: 'data'}) } ],
        [ 'di', { data: new TestModel({id: 'di'}, {data1: 'data1'}) } ]
    ],
    modelFactory :new TestModelFactory()
};

describe('TestReadExecutable', () => {
    describe('scenario1', () => {
        let instance :TestReadExecutable  = null;
        beforeEach(() => {
            instance = new TestReadExecutable ({
                storage :new TestStorage(testStorageConfig)
            });
        });
        it('#run should return successful Result', async () => {
            let runResult = await instance.run({id: 'id'});
            expect(runResult.isFailure).to.be.false;
            let model = runResult.get();
            expect(model.getKey()).eql({id: 'id'});
            expect(model.getProperties()).eql({data: 'data'});
            expect(model.id).to.eql('id');
            expect(model.data).to.eql('data');
        });
    });
});


