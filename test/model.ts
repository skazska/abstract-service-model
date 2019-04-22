// const sinon = require('sinon');
import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
use(sinonChai);

import {Model} from "../src/model";

describe('model', () => {
    describe('scenario1', () => {
        let model :Model = null;
        beforeEach(() => {
            model = new Model({id: 'id'}, {data: 'data'});
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
            data.id = 'id2';
            expect(model.data).to.eql({id: 'id', data: 'data'});
            // try {
            //     model.data = data;
            // } catch (e) {
            //     expect(e).to.be.instanceof(TypeError);
            // }
            model.properties.data1 = 'data1';
            expect(data).to.eql({id: 'id2', data: 'data'});
            expect(model.data).to.eql({id: 'id', data: 'data', data1: 'data1'});
        });


        it('#update(properties :ModelPropertiesInterface) :ModelInterface', () => {
            expect(model).to.have.property('update').which.is.a('function');
            model.update({data1: 'data1'});
            expect(model.properties).to.eql({data: 'data', data1: 'data1'});
            model.update({data: undefined});
            expect(model.properties).to.eql({data1: 'data1'});
        });
    });
});