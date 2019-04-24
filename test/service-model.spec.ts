// const sinon = require('sinon');
import "mocha";
import {expect, use}  from "chai";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromised from "chai-as-promised"
use(chaiAsPromised);
use(sinonChai);

import {ServiceModel} from "../src/index";
import {TestService} from "./service";
import {TestModel} from "./model";


describe('serviceModel', () => {
    describe('properties', () => {
        let serviceModel = null;
        let service = new TestService();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, TestModel);
        });

        it('*modelConstructor (read only)', () => {
            expect(serviceModel).to.have.property('modelConstructor');
            let modelConstructor = serviceModel.modelConstructor;
            expect(modelConstructor).to.equal(TestModel);
        });

        it('*service (read only)', () => {
            expect(serviceModel).to.have.property('service');
            let service = serviceModel.service;
            expect(service).to.instanceof(TestService);
        });

    });

    describe('#create(data :Object) :Promise<any>', () => {
        let serviceModel :ServiceModel = null;
        let service = new TestService();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, TestModel);
        });

        it('implemented', () => {
            expect(serviceModel).to.have.property('create').which.is.a('function');
        });

        it('returns Promise resolves to TestModel or undefined', async () => {
            let result = await serviceModel.create({id: 'id'}, {data: 'data'});
            expect(result).to.be.instanceof(TestModel);
            expect(result.data).to.eql({id: 'id', data: 'data'});
        });
    });

    describe('#query(options :IQueryOptions) ::Promise<Array<IModel>>', () => {
        let serviceModel :ServiceModel = null;
        let service = new TestService();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, TestModel);
        });

        it('implemented', () => {
            expect(serviceModel).to.have.property('query').which.is.a('function');
        });

        it('returns undefined', async () => {
            let result = await serviceModel.query({id: 'id'});
            expect(result).to.have.property('items').which.is.an('array');
            let model = result.items[0];
            expect(model).to.be.instanceof(TestModel);
            expect(model.data).to.eql({id: 'id', data: 'data'});
        });
    });

    describe('#read(id :any) :Promise<any>', () => {
        let serviceModel :ServiceModel = null;
        let service = new TestService();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, TestModel);
        });

        it('implemented', () => {
            expect(serviceModel).to.have.property('load').which.is.a('function');
        });

        it('returns undefined', async () => {
            let result = await serviceModel.load({id: 'id'});
            expect(result).to.be.instanceof(TestModel);
            expect(result.data).to.eql({id: 'id', data: 'data'});
        });
    });

    describe('#update(id :any, data:Object) :Promise<any>', () => {
        let serviceModel :ServiceModel = null;
        let service = new TestService();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, TestModel);
        });

        it('implemented', () => {
            expect(serviceModel).to.have.property('save').which.is.a('function');
        });

        it('returns undefined', async () => {
            let model = new TestModel({id: 'id'}, {data: 'data'});
            let result = await serviceModel.save(model);
            expect(result).to.be.instanceof(TestModel);
            expect(result.data).to.eql({id: 'id', data: 'data'});
        });
    });

    describe('#delete(id :any) :Promise<any>', () => {
        let serviceModel :ServiceModel = null;
        let service = new TestService();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, TestModel);
        });

        it('implemented', () => {
            expect(serviceModel).to.have.property('delete').which.is.a('function');
        });

        it('returns undefined', async () => {
            let result = await serviceModel.delete({id: 'id'});
            expect(result).to.equal(true);
        });
    });

});