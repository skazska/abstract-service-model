// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {TestModel, TestModelDataAdapter} from "./model";
// use(sinonChai);

describe('model', () => {
    describe('GenericModel descendant scenario1', () => {
        let model :TestModel = null;
        beforeEach(() => {
            model = new TestModel({id: 'id'}, {data: 'data'}, {option1: 'hi'});
        });
        it('#getKey (read only, immutable)', () => {
            expect(model).to.have.property('getKey').which.is.a('function');
            let key = model.getKey();
            expect(key).to.eql({id: 'id'});
            key.id = 'id2';
            expect(model.getKey()).to.eql({id: 'id'});
            expect(model.id).to.eql('id');
        });
        it('#getProperties/#setProperties (mutable)', () => {
            expect(model).to.have.property('getProperties');
            let properties = model.getProperties();
            expect(properties).to.eql({data: 'data'});
            expect(model.data).to.eql('data');

            properties.data1 = 'data1';
            expect(model.getProperties()).to.eql({data: 'data', data1: 'data1'});
            expect(model.data1).to.eql('data1');
            model.setProperties({data1: 'data1'});
            expect(model.getProperties()).to.eql({data1: 'data1'});
            model.getProperties().data = 'x';
            expect(model.getProperties()).to.eql({data: 'x', data1: 'data1'});
        });

        it('#update(properties :IModelProperties) :IModel', () => {
            expect(model).to.have.property('update').which.is.a('function');
            model.update({data1: 'data1'});
            expect(model.getProperties()).to.eql({data: 'data', data1: 'data1'});
            model.update({data: undefined});
            expect(model.getProperties()).to.eql({data1: 'data1'});
        });
    });
    describe('simple model adapter', function() {
        let adapter = new TestModelDataAdapter(['id'], ['data1', 'data2']);
        let data = {
            id: 'id',
            data: 'data',
            data1: 'data1',
            data2: 'data2'
        };

        // let model = new TestModel({id: 'id'}, {data: 'data'});

        it('#getKey returns object with id property', () => {
            expect(adapter.getKey(data).get()).eql({id: 'id'});
        });

        it('#getProperties returns object with properties data1 and data2', () => {
            expect(adapter.getProperties(data).get()).eql({data1: 'data1', data2: 'data2'});
        });

        it('#getData returns data with properties of keys and properties combined', () => {
            expect(adapter.getData({id: 'id'}, {data: 'data', data1: 'data1', data2: 'data2'}).get())
                .eql({id: 'id', data1: 'data1', data2: 'data2'});
        });

    });
});

