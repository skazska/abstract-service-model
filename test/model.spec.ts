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
        it('*key (read only, immutable)', () => {
            expect(model).to.have.property('key');
            let key = model.key;
            expect(key).to.eql({id: 'id'});
            key.id = 'id2';
            expect(model.key).to.eql({id: 'id'});
            // try {
            //     model.key = key;
            // } catch (e) {
            //     expect(e).to.be.instanceof(TypeError);
            // }
            expect(model.key).to.eql({id: 'id'});
        });
        it('*properties (read/write, mutable)', () => {
            expect(model).to.have.property('properties');
            let properties = model.properties;
            expect(properties).to.eql({data: 'data'});
            properties.data1 = 'data1';
            expect(model.properties).to.eql({data: 'data', data1: 'data1'});
            model.properties = {data1: 'data1'};
            expect(model.properties).to.eql({data1: 'data1'});
            model.properties.data = 'x';
            expect(model.properties).to.eql({data: 'x', data1: 'data1'});
        });
        it('*data (read only, immutable)', () => {
            expect(model).to.have.property('data');
            let data = model.data;
            expect(data).to.eql({id: 'id', data: 'data'});
            data.data = 'data1';
            expect(model.data).to.eql({id: 'id', data: 'data'});

            // try {
            //     model.data = data;
            // } catch (e) {
            //     expect(e).to.be.instanceof(TypeError);
            // }

            model.properties.data1 = 'data1';
            expect(data).to.eql({id: 'id', data: 'data1'});
            expect(model.data).to.eql({id: 'id', data: 'data', data1: 'data1'});
        });


        it('#update(properties :IModelProperties) :IModel', () => {
            expect(model).to.have.property('update').which.is.a('function');
            model.update({data1: 'data1'});
            expect(model.properties).to.eql({data: 'data', data1: 'data1'});
            model.update({data: undefined});
            expect(model.properties).to.eql({data1: 'data1'});
        });
    });
});
