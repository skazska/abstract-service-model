import "mocha";
import {expect, use}  from 'chai';
// import sinonChai = require("sinon-chai");
import {AuthTest} from "./auth";
import {IAuthIdentity, RegExIdentity} from "../src";
// use(sinonChai);

describe('auth', () => {
    let instance :AuthTest = null;
    let token :string;
    let identity :IAuthIdentity;
    before(() => {
        instance = new AuthTest(RegExIdentity.getInstance, {secretSource: 'secret'});
    });

    it('constructor produce instance with expected properties and methods', () => {
        expect(instance).to.have.property('identify').which.is.a('function');
        expect(instance).to.have.property('grant').which.is.a('function');
    });

    it('#grant returns success with token', async () => {
        let tokenResult = await instance.grant({read: 'ok', write: 'demo'}, 'subject');
        token = tokenResult.get();
        expect(token).to.be.a('string');
    });

    it('#identify returns success instance of RegExIdentity', async () => {
        let identityResult = await instance.identify('right', 'r1');
        identity = identityResult.get();
        expect(identity).to.have.property('access').which.is.a('function');
        expect(identity.subject).equal('subject');
    });

    it('realmless identity.access returns operation result from auth details by op only', async () => {
        expect(identity.access('read', 'ok').get()).to.be.true;
        expect(identity.access('write', 'demo').get()).to.be.true;
        expect(identity.access('write', 'more').get()).to.be.false;
    });

});
