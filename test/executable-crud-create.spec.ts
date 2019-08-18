// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {TestModel, TestModelFactory} from "./model";
import {ITestStorageConfig, TestStorage} from "./model-storage";
import {TestUpdateExecutable} from "./executable-crud-create";
import {AuthIdentity} from "../src";

// use(sinonChai);

const testStorageConfig :ITestStorageConfig = {
    data: [
        // [ 'id', { data: new TestModel({id: 'id'}, {data: 'data'}) } ],
        [ 'di', { data: new TestModel({id: 'di'}, {data1: 'data1'}) } ]
    ],
    modelFactory :new TestModelFactory()
};

describe('TestCreateExecutable', () => {
    describe('scenario1, without authentication', () => {
        let instance: TestUpdateExecutable = null;
        let storage: TestStorage = null;
        beforeEach(() => {
            storage = new TestStorage(testStorageConfig);
            instance = new TestUpdateExecutable({
                storage: storage
            });
        });
        xit("#run should return successful Result with model, data should be entered in test storage", async () => {
            let data = {model: testStorageConfig.modelFactory.dataModel({data: 'data', id: 'id'}).get()};
            let runResult = await instance.run(data);
            expect(runResult.isFailure).to.be.false;
            let model: TestModel = runResult.get();
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

        it("#run should return failure if no key provided and failure in model's newKey", async () => {
            let data = {model: testStorageConfig.modelFactory.model(null, {data: 'data'})};
            let runResult = await instance.run(data);
            expect(runResult.isFailure).to.be.true;
            expect(runResult.errors[0].message).equal('use natural key');
        });
    });
    describe('scenario2, with authentication', () => {
        let instance: TestUpdateExecutable = null;
        let storage: TestStorage = null;
        let identity = new AuthIdentity('user', {create: true});
        beforeEach(() => {
            storage = new TestStorage(testStorageConfig);
        });
        it ('should return failure if accesObject differs', async () => {
            instance = new TestUpdateExecutable({
                storage: storage,
                accessObject: 'xcreate'
            });
            let data = {model: testStorageConfig.modelFactory.dataModel({data: 'data', id: 'id'}).get()};
            let runResult = await instance.run(data, identity);
            expect(runResult.isFailure).to.be.true;
            expect(runResult.errors[0].message).equal('action not permitted');

        });
        it ('should return success if accesObject same', async () => {
            instance = new TestUpdateExecutable({
                storage: storage,
                accessObject: 'create'
            });
            let data = {model: testStorageConfig.modelFactory.dataModel({data: 'data', id: 'id'}).get()};
            let runResult = await instance.run(data, identity);
            expect(runResult.isFailure).to.be.false;

        })
    });
});

