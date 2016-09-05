/* eslint-env mocha */
/* eslint max-statements: [1, 20] */

import chai, {expect} from 'chai';
import {spy} from 'sinon';
import sinonChai from 'sinon-chai';

import Listener from '.';

chai.use(sinonChai);

describe('custom event listener', () => {
  it('should subscribe to window', () => {
    const window = {
      addEventListener: spy(),
      removeEventListener: spy(),
    };
    const listener = new Listener('test', window);
    expect(window.addEventListener).to.not.have.been.called;
    expect(window.removeEventListener).to.not.have.been.called;
    const [cb1, cb2] = [spy(), spy()];
    const unsubscribes = [cb1, cb2].map(cb => listener.subscribe(cb));
    expect(window.addEventListener).to.have.been.calledWith('test');
    expect(window.removeEventListener).to.not.have.been.called;
    unsubscribes[1]();
    expect(window.addEventListener).to.have.been.calledOnce;
    expect(window.removeEventListener).to.not.have.been.called;
    unsubscribes[0]();
    expect(window.addEventListener).to.have.been.calledOnce;
    expect(window.removeEventListener).to.have.been.calledOnce;
    expect(cb1).to.not.have.been.called;
    expect(cb2).to.not.have.been.called;
  });

  it.skip('should call function callbacks', () => {
    //
  });
});
