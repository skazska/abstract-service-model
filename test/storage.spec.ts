// const sinon = require('sinon');
import "mocha";
import {expect, use}  from "chai";
import * as sinonChai from "sinon-chai";
import * as chaiAsPromised from "chai-as-promised"
use(chaiAsPromised);
use(sinonChai);

import {Service} from "../src/storage";

describe('storage', () => {
    describe('#create(data :Object) :Promise<any>', () => {
        let storage :Service = null;
        before(() => {
            storage = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(storage).to.have.property('create').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = storage.create({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#read(id :any) :Promise<any>', () => {
        let storage :Service = null;
        before(() => {
            storage = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(storage).to.have.property('read').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = storage.read({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#query(options :IQueryOptions) :Promise<any>', () => {
        let storage :Service = null;
        before(() => {
            storage = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(storage).to.have.property('query').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = storage.query({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#update(id :any, data:Object) :Promise<any>', () => {
        let storage :Service = null;
        before(() => {
            storage = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(storage).to.have.property('update').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = storage.update({id: 'id'}, {data: 'data'});
            expect(result).to.eventually.become(undefined);
        });
    });

    describe('#erase(id :any) :Promise<any>', () => {
        let storage :Service = null;
        beforeEach(() => {
            storage = new Service({option: 'option'});
        });

        it('implemented', () => {
            expect(storage).to.have.property('delete').which.is.a('function');
        });

        it('returns undefined', () => {
            let result = storage.delete({id: 'id'});
            expect(result).to.eventually.become(undefined);
        });
    });

});