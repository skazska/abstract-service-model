import "mocha";
import {expect, use}  from 'chai';
import * as sinonChai from "sinon-chai";
import {AuthTest} from "./auth";
use(sinonChai);

describe('auth', () => {
    let instance :AuthTest = null;
    beforeEach(() => {
        instance = new AuthTest();
    });
    it('constructor produce instance with expected properties and methods', () => {
        expect(instance).to.have.property('identify').which.is.a('function');
    });
    it('#identify returns result with instance of IAuthIdentity', async () => {
        let identityResult = await instance.identify({key: 'x'});
        expect(identityResult.get()).to.have.property('access').which.is.a('function');
        identityResult = await instance.identify({key: ''});
        expect(identityResult.isFailure).to.be.true;
    });
    it('result of identify has method access which returns access for realm and operation', async () => {
        let identityResult = await instance.identify({key: 'x'});
        let accessResult = await identityResult.get().access('a', 'read');
        expect(accessResult.get()).to.be.true;
        accessResult = await identityResult.get().access('', 'read');
        expect(accessResult.get()).to.be.false;
    })

});
