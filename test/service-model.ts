// const sinon = require('sinon');
import "mocha";
import {expect, use}  from "chai";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromised from "chai-as-promised"
use(chaiAsPromised);
use(sinonChai);

import {ServiceModel} from "../src/index";
import {Service} from "../src/service";
import {Model} from "../src/model";


describe('serviceModel', () => {
    describe('properties', () => {
        let serviceModel = null;
        let service = new Service();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, Model);
        });

        it('*modelConstructor (read only)', () => {
            expect(serviceModel).to.have.property('modelConstructor');
            let modelConstructor = serviceModel.modelConstructor;
            expect(modelConstructor).to.equal(Model);
        });

        it('*service (read only)', () => {
            expect(serviceModel).to.have.property('service');
            let service = serviceModel.service;
            expect(service).to.instanceof(Service);
        });

    });

    describe('#create(data :Object) :Promise<any>', () => {
        let serviceModel :ServiceModel = null;
        let service = new Service();

        beforeEach(() => {
            serviceModel = new ServiceModel(service, Model);
        });

        it('implemented', () => {
            expect(serviceModel).to.have.property('create').which.is.a('function');
        });

        it('returns Promise resolves to Model or undefined', () => {
            let result = serviceModel.create({id: 'id'}, {data: 'data'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#read(id :any) :Promise<any>', () => {
        let service :Service = null;
        beforeEach(() => {
            service = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(service).to.have.property('read').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = service.read({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#update(id :any, data:Object) :Promise<any>', () => {
        let service :Service = null;
        beforeEach(() => {
            service = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(service).to.have.property('update').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = service.update({id: 'id'}, {data: 'data'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#delete(id :any) :Promise<any>', () => {
        let service :Service = null;
        beforeEach(() => {
            service = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(service).to.have.property('delete').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = service.delete({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

});