import { GetNamePersonPipe } from './get-name-person.pipe';

describe('GetNamePersonPipe', () => {
  it('create an instance', () => {
    const pipe = new GetNamePersonPipe();
    expect(pipe).toBeTruthy();
  });
});
