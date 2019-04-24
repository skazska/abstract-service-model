// const sinon = require('sinon');
import "mocha";
import {expect, use}  from "chai";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromised from "chai-as-promised"
use(chaiAsPromised);
use(sinonChai);

import {Service} from "../src/service";

describe('service', () => {
    describe('#create(data :Object) :Promise<any>', () => {
        let service :Service = null;
        before(() => {
            service = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(service).to.have.property('create').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = service.create({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#read(id :any) :Promise<any>', () => {
        let service :Service = null;
        before(() => {
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

    describe('#list(options :IServiceListOptions) :Promise<any>', () => {
        let service :Service = null;
        before(() => {
            service = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(service).to.have.property('list').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = service.list({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#update(id :any, data:Object) :Promise<any>', () => {
        let service :Service = null;
        before(() => {
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