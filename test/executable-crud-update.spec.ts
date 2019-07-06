// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
import {TestModel} from "./model";
import {TestModelFactory} from "./model";
import {ITestStorageConfig, TestStorage} from "./model-storage";
import {TestUpdateExecutable} from "./executable-crud-update";

use(sinonChai);

const testStorageConfig :ITestStorageConfig = {
    data: [
        [ 'id', { data: new TestModel({id: 'id'}, {data: 'data'}) } ],
        [ 'di', { data: new TestModel({id: 'di'}, {data1: 'data1'}) } ]
    ],
    modelFactory :new TestModelFactory()
};

describe('TestUpdateExecutable', () => {
    describe('scenario1', () => {
        let instance :TestUpdateExecutable  = null;
        let storage :TestStorage = null;
        beforeEach(() => {
            storage = new TestStorage(testStorageConfig);
            instance = new TestUpdateExecutable ({
                storage: storage
            });
        });
        it("#run should return successful Result with model, data should be updated in test storage", async () => {
            let data = { data: {data1: 'data2'}, key: {id: 'id'}};
            let runResult = await instance.run(data);
            expect(runResult.isFailure).to.be.false;
            let model = runResult.get();
            expect(model).to.have.property('key').which.is.eql({id: 'id'});
            expect(model).to.have.property('properties').which.is.eql({data1: 'data2'});
            expect(model).to.have.property('data').which.is.eql({id: 'id', data1: 'data2'});
            let insertedResult = await storage.load({id: 'id'});
            expect(insertedResult.isFailure).to.be.false;
            model = insertedResult.get();
            expect(model).to.have.property('key').which.is.eql({id: 'id'});
            expect(model).to.have.property('properties').which.is.eql({data1: 'data2'});
            expect(model).to.have.property('data').which.is.eql({id: 'id', data1: 'data2'});
        });
    });
});


