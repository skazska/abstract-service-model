// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {TestModel, TestModelFactory} from "./model";
import {ITestStorageConfig, TestStorage} from "./model-storage";
import {TestUpdateExecutable} from "./executable-crud-create";

// use(sinonChai);

const testStorageConfig :ITestStorageConfig = {
    data: [
        // [ 'id', { data: new TestModel({id: 'id'}, {data: 'data'}) } ],
        [ 'di', { data: new TestModel({id: 'di'}, {data1: 'data1'}) } ]
    ],
    modelFactory :new TestModelFactory()
};

describe('TestCreateExecutable', () => {
    describe('scenario1', () => {
        let instance :TestUpdateExecutable  = null;
        let storage :TestStorage = null;
        beforeEach(() => {
            storage = new TestStorage(testStorageConfig);
            instance = new TestUpdateExecutable ({
                storage: storage
            });
        });
        it("#run should return successful Result with model, data should be entered in test storage", async () => {
            let data = {model: testStorageConfig.modelFactory.dataModel({ data: 'data', id: 'id'}).get()};
            let runResult = await instance.run(data);
            expect(runResult.isFailure).to.be.false;
            let model :TestModel = runResult.get();
            expect(model.getKey()).eql({id: 'id'});
            expect(model.getProperties()).to.eql({data: 'data'});
            expect(model.id).eql('id');
            expect(model.data).eql('data');

            let insertedResult = await storage.load({id: 'id'});
            expect(insertedResult.isFailure).to.be.false;
            model = insertedResult.get();
            expect(model.getKey()).eql({id: 'id'});
            expect(model.getProperties()).eql({data: 'data'});
            expect(model.id).eql('id');
            expect(model.data).eql('data');
        });
    });
});


