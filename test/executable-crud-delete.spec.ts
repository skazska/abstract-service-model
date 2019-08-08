// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {TestModel} from "./model";
import {TestModelFactory} from "./model";
import {ITestStorageConfig, TestStorage} from "./model-storage";
import {TestDeleteExecutable} from "./executable-crud-delete";

// use(sinonChai);

const testStorageConfig :ITestStorageConfig = {
    data: [
        [ 'id', { data: new TestModel({id: 'id'}, {data: 'data'}) } ],
        [ 'di', { data: new TestModel({id: 'di'}, {data1: 'data1'}) } ]
    ],
    modelFactory :new TestModelFactory()
};

describe('TestDeleteExecutable', () => {
    describe('scenario1', () => {
        let instance :TestDeleteExecutable  = null;
        let storage :TestStorage = null;
        beforeEach(() => {
            storage = new TestStorage(testStorageConfig);
            instance = new TestDeleteExecutable ({
                storage: storage
            });
        });
        it('#run should return true Result, data should be removed from test storage', async () => {
            let runResult = await instance.run({id: 'id'});
            expect(runResult.isFailure).to.be.false;
            expect(runResult.get()).to.be.null;

            let deletedResult = await storage.load({id: 'id'});
            expect(deletedResult.isFailure).to.be.true;
        });
    });
});


