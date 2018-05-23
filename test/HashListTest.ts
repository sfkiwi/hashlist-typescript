import { expect } from 'chai';
import { HashList } from '../src/index'

class Foo {
  private val: number;
  constructor(val: number) {
    this.val = val;
  }

  get bar() {
    return this.val;
  }
}

describe('HashList Tests', () => {
  it('should create an empty list #1', () => {
    let values: number[] = [];

    // pass in the contents of an empty array
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
  });

  it('should create an empty list #2', () => {

    // call the constructor without any arguments
    let list = new HashList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
  });

  it('should create a HashList with a single value', () => {
    let list = new HashList<number>(4);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(4);
  });

  it('should create a HashList with mutiple initial values', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
  })

  it('should support iterable protocol', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    let index = 0;
    for (let item of list) {
      expect(item).to.equal(values[index++])
    }
    expect(index).to.equal(values.length)
  })

  it('should support spread opertor', () => {
    let values: number[] = [0, 1, 2]
    let list = new HashList<number>(...values);
    let count = 0;
    function spreadTest(...args: number[]) {
      for (let i in args) {
        count++;
        expect(args[i]).to.equal(values[i])
      }
    }
    spreadTest(...list);
    expect(count).to.equal(values.length);
  })

  it('should support deconstruction', () => {
    let values: number[] = [0, 1, 2]
    let list = new HashList<number>(...values);
    let count = 0;
    let [a, b, c] = list;
    expect(a).to.equal(values[0]);
    expect(b).to.equal(values[1]);
    expect(c).to.equal(values[2]);
  })

  it('should support iterator protocol', () => {
    let values: number[] = [0, 1, 2]
    let list = new HashList<number>(...values);
    let iterator = list.iterator();
    let iter = iterator.next();
    expect(iter.value).to.equal(0);
    expect(iter.done).to.be.false;
    iter = iterator.next();
    expect(iter.value).to.equal(1);
    expect(iter.done).to.be.false;
    iter = iterator.next();
    expect(iter.value).to.equal(2);
    expect(iter.done).to.be.false;
    iter = iterator.next();
    expect(iter.value).to.be.undefined;
    expect(iter.done).to.be.true;
  })


  it('should allow "any" type', () => {
    let values: any[] = [4, { hello: 'world' }, 'hello']
    let list = new HashList<any>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal('hello');
  });

  it('should allow custom types', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);

    let list = new HashList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(list.head.bar).to.equal(foo1.bar);
    expect(list.tail.bar).to.equal(foo4.bar);
  });

  it('should append a value to the end of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    list.append(7);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
  });

  it('should append a value to the end of an empty list', () => {
    let list = new HashList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    list.append(1);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(1);
    expect(list.tail).to.equal(1);
  });

  it('should prevent duplicates when appending primatives', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.append(5, true);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.be.null;
  });

  it('should prevent duplicates when appending custom types', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);

    let list = new HashList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    let result = list.append(foo2, true);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(result).to.be.null;
  });

  it('should prepend a value to the beginning of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    list.prepend(3);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(3);
    expect(list.tail).to.equal(6);
  });

  it('should prepend a value to the beginning of an emptylist', () => {
    let list = new HashList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    list.prepend(1);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(1);
    expect(list.tail).to.equal(1);
  });

  it('should prevent duplicates when prepending primatives', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.prepend(5, true);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.be.null;
  });

  it('should prevent duplicates when prepending custom types', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);

    let list = new HashList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    let result = list.prepend(foo2, true);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(result).to.be.null;
  });

  it('should remove the first value in the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.removeHead();
    expect(list.length).to.equal(2);
    expect(list.head).to.equal(5);
    expect(list.tail).to.equal(6);
    expect(val).to.equal(4);
  });

  it('should handle removing Head from an empty list', () => {
    let list = new HashList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let val = list.removeHead()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.be.undefined;
  });

  it('should handle removing Head from a list with single item', () => {
    let values: number[] = [4]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(4);
    let val = list.removeHead()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.equal(4);
  });

  it('should remove the last value in the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let val = list.removeTail();
    expect(list.length).to.equal(2);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(5);
    expect(val).to.equal(6);
  });

  it('should handle removing Tail from an empty list', () => {
    let list = new HashList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let val = list.removeTail()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.be.undefined;
  });

  it('should handle removing Tail from a list with single item', () => {
    let values: number[] = [4]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(1);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(4);
    let val = list.removeTail()
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.equal(4);
  });

  it('should remove a specified value from a primative list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let key = list.prepend(7)
    let val = list.remove(key);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(val).to.equal(7);
  });

  it('should remove a specified value from the end of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let key = list.append(7)
    let val = list.remove(key);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(val).to.equal(7);
  });

  it('should handle removing a value using an invalid key', () => {
    let list = new HashList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let val = list.remove('')
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    expect(val).to.be.undefined;
  });

  it('should remove a specified value from a custom type list', () => {
    let foo1 = new Foo(4);
    let foo2 = new Foo(5);
    let foo3 = new Foo(6);
    let foo4 = new Foo(7);

    let list = new HashList<Foo>(foo1, foo2, foo3, foo4);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    let foo5 = new Foo(8);
    let key = list.append(foo5);
    let val = list.remove(key);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(foo1);
    expect(list.tail).to.equal(foo4);
    expect(val).to.equal(foo5);
  });

  it('should insert a value after a specified key', () => {
    let values: number[] = [4, 5, 7]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
    let key1 = list.prepend(2);
    let key2 = list.insert(3, key1);
    expect(list.length).to.equal(5);
    expect(list.head).to.equal(2);
    expect(list.tail).to.equal(7);
    let val1 = list.remove(key1)
    let val2 = list.remove(key2);
    expect(val1).to.equal(2);
    expect(val2).to.equal(3);
  });

  it('should insert a value at the end of the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let key1 = list.append(7);
    let key2 = list.insert(8, key1);
    expect(list.length).to.equal(5);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(8);
    let val1 = list.remove(key1)
    let val2 = list.remove(key2);
    expect(val1).to.equal(7);
    expect(val2).to.equal(8);
  });

  it('should prevent duplicates when inserting into the list', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let key1 = list.append(7);
    let key2 = list.insert(7, key1, true);
    expect(list.length).to.equal(4);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(7);
    expect(key2).to.be.null;
  });

  it('should not insert when previous cannot be found', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let key = list.insert(8, '');
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(key).to.be.null;
  });

  it('should convert the list to an array', () => {
    let values: number[] = [4, 5, 6]
    let list = new HashList<number>(...values);
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    let result = list.toArray()
    expect(list.length).to.equal(3);
    expect(list.head).to.equal(4);
    expect(list.tail).to.equal(6);
    expect(result).to.deep.equal(values);
    expect(result.length).to.equal(values.length);
  });

  it('should convert an empty list to an empty array', () => {
    let list = new HashList<number>();
    expect(list.length).to.equal(0);
    expect(list.head).to.be.null;
    expect(list.tail).to.be.null;
    let result = list.toArray()
    expect(result.length).to.equal(0);
  });
});