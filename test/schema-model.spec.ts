// const sinon = require('sinon');
import "mocha";
import {expect, use} from 'chai';
// import sinonChai = require("sinon-chai");
import {TestSchemaModel, TestSchemaModelAdapter} from "./model";
import {JsTypes, JSTypeSchemaValidator, ModelSchema, RequiredSchemaValidator, SchemaField} from "../src/model/schema";
// use(sinonChai);

describe('model', () => {
    let schema :ModelSchema = null;
    describe('ModelSchema', () => {
        it('create', () => {
            schema = new ModelSchema(
                [
                    new SchemaField('id', 'string', [
                        new RequiredSchemaValidator(),
                        new JSTypeSchemaValidator(JsTypes.string)
                    ])
                ],
                [
                    new SchemaField('data', 'string', [
                        new RequiredSchemaValidator(),
                        new JSTypeSchemaValidator(JsTypes.string)
                    ]),
                    new SchemaField('data1', 'string', [
                        new JSTypeSchemaValidator(JsTypes.string)
                    ])
                ]
            );
        })
    });
    describe('GenericModel scenario1', () => {
        let model :TestSchemaModel = null;
        it('#expected data - valid schema', () => {
            model = new TestSchemaModel({id: 'id'}, {data: 'data'}, {schema: schema});
            expect(schema.isValid()).to.be.true;
        });
        it('#wrong data', () => {
            model = new TestSchemaModel({id: 'id'}, {data1: 'wewe'}, {schema: schema});
            expect(schema.isValid()).to.be.false;
            expect(schema.errors()[0]).to.have.property('message', 'missing field');
            expect(schema.errors()[0]).to.have.property('field', 'data');
        });
    });
    describe('schema model adapter', function() {
        let adapter :TestSchemaModelAdapter;
        let data = {
            di: 'id',
            atad: 'data',
            data1: 'data1'
        };

        beforeEach(() => {
            adapter = new TestSchemaModelAdapter(schema, {id: 'di', data: 'atad', data1: 'data1'});
        });

        it('#getKey returns object with id property', () => {
            expect(adapter.getKey(data).get()).eql({id: 'id'});
        });

        it('#getProperties returns object with properties data1 and data2', () => {
            expect(adapter.getProperties(data).get()).eql({data: 'data', data1: 'data1'});
        });

        it('#getData returns data with properties of keys and properties combined', () => {
            expect(adapter.getData({id: 'id'}, {data: 'data', data1: 'data1', data2: 'data2'}).get())
                .eql({di: 'id', atad: 'data', data1: 'data1'});
        });

    });

});

