// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {TestModel} from "./model";
// use(sinonChai);

describe('model', () => {
    describe('scenario1', () => {
        let model :TestModel = null;
        beforeEach(() => {
            model = new TestModel({id: 'id'}, {data: 'data'});
        });
        it('#getKey (read only, immutable)', () => {
            expect(model).to.have.property('getKey').which.is.a('function');
            let key = model.getKey();
            expect(key).to.eql({id: 'id'});
            key.id = 'id2';
            expect(model.getKey()).to.eql({id: 'id'});
            // try {
            //     model.getKey() = key;
            // } catch (e) {
            //     expect(e).to.be.instanceof(TypeError);
            // }
            expect(model.getKey()).to.eql({id: 'id'});
        });
        it('#getProperties/#setProperties (mutable)', () => {
            expect(model).to.have.property('getProperties');
            let properties = model.getProperties();
            expect(properties).to.eql({data: 'data'});
            properties.data1 = 'data1';
            expect(model.getProperties()).to.eql({data: 'data', data1: 'data1'});
            model.setProperties({data1: 'data1'});
            expect(model.getProperties()).to.eql({data1: 'data1'});
            model.getProperties().data = 'x';
            expect(model.getProperties()).to.eql({data: 'x', data1: 'data1'});
        });
        it('*data (read only, immutable)', () => {
            expect(model).to.have.property('getData').which.is.a('function');
            let data = model.getData();
            expect(data).to.eql({id: 'id', data: 'data'});
            data.data = 'data1';
            expect(model.getData()).to.eql({id: 'id', data: 'data'});

            // try {
            //     model.getData() = data;
            // } catch (e) {
            //     expect(e).to.be.instanceof(TypeError);
            // }

            model.getProperties().data1 = 'data1';
            expect(data).to.eql({id: 'id', data: 'data1'});
            expect(model.getData()).to.eql({id: 'id', data: 'data', data1: 'data1'});
        });


        it('#update(properties :IModelProperties) :IModel', () => {
            expect(model).to.have.property('update').which.is.a('function');
            model.update({data1: 'data1'});
            expect(model.getProperties()).to.eql({data: 'data', data1: 'data1'});
            model.update({data: undefined});
            expect(model.getProperties()).to.eql({data1: 'data1'});
        });
    });
});
