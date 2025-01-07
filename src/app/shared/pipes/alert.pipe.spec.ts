import { DynamicMessagePipe } from "./alert.pipe";

describe('AlertPipe', () => {
  it('create an instance', () => {
    const pipe = new DynamicMessagePipe();
    expect(pipe).toBeTruthy();
  });
});
