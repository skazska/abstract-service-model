import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {IOTest} from "./i-o";
import {AuthTest} from "./auth";
import {TestReadExecutable} from "./executable-crud-read";
import {ITestStorageConfig, TestStorage} from "./model-storage";
import {TestModel, TestModelFactory} from "./model";
import {RegExIdentity} from "../src";

// use(sinonChai);

const testStorageConfig :ITestStorageConfig = {
    data: [
        [ 'id', { data: new TestModel({id: 'id'}, {data: 'data'}) } ],
        [ 'di', { data: new TestModel({id: 'di'}, {data1: 'data1'}) } ]
    ],
    modelFactory :new TestModelFactory()
};

describe('io', () => {
    let instance :IOTest = null;
    let authenticator :AuthTest = null;
    let executable :TestReadExecutable = null;
    let token :string;
    beforeEach(async () => {
        authenticator = new AuthTest(RegExIdentity.getInstance);
        token = (await authenticator.grant({test: 'read'}, 'testUser')).get();
        executable = new TestReadExecutable({
            storage :new TestStorage(testStorageConfig),
            accessObject: 'test',
            operation: 'read'
        });
        instance = new IOTest(executable, authenticator);
    });
    it('constructor produce instance with expected properties and methods', () => {
        expect(instance).to.have.property('handler').which.is.a('function');
        expect(instance).to.have.property('fail').which.is.a('function');
        expect(instance).to.have.property('success').which.is.a('function');
        expect(instance).to.have.property('authTokens').which.is.a('function');
        expect(instance).to.have.property('data').which.is.a('function');
    });
    it('#handler returns handleResult with success from executable', async () => {
        let success = await instance.handler({auth: token, key: 'id', data: {id: 'id'}});
        expect(success).to.have.property('get');
        let data = success.get();
        expect(testStorageConfig.modelFactory.data(data).get()).to.eql({id: 'id', data: 'data'})
    });
    it('#handler returns handleResult with failure from executable', async () => {
        let success = await instance.handler({auth: token, key: 'id', data: {idf: 'id'}});
        expect(success.isFailure).to.be.true;
        expect(success.errors[0]).to.haveOwnProperty('isRunError').eql(true);
        expect(success.errors[0]).to.haveOwnProperty('message').eql('not found');
        expect(success.errors[0]).to.haveOwnProperty('operation').eql('read from storage');
    });

});
