import test from 'ava';
import { spy } from 'sinon';
import * as most from 'most';

const __ = 'Fill in the blank';

test.cb('streams are compatible with ES Observable spec draft', t => {
  const observer = {
    next: spy(),
    error: spy(),
    complete: spy(),
  };

  most.from([1, 2, 3]).subscribe(observer);

  setImmediate(() => {
    t.deepEqual(observer.next.args, [[1], [2], [3]]);
    t.is(__, observer.error.called);
    t.is(__, observer.complete.called);
    t.end();
  });
});

test('streams are reducible to promise for the ultimate result', async t => {
  const result = await most.from([1, 3, 5])
    .reduce((acc, num) => acc + num, 0);

  t.is(__, result);
});

test('use drain if you dont give a fuck about the events', async t => {
  const results = [];

  await most.from([1, 2, 3])
    .tap(x => { results.push(x); })
    .drain();

  t.deepEqual(__, results);
});

test('things can break', async t => {
  const willReject = Promise.reject('fucked up');
  try {
    await most.fromPromise(willReject).drain();
  } catch (err) {
    t.is(__, err);
  }
});
