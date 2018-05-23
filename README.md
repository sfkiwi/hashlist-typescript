# hashlist-typescript 
[![Build Status][travis-badge]][travis] [![Coverage Status][coveralls-badge]][coveralls]

Simple Typescript Linked List with hash table indexing. Supports generics type templating 
iterator and iterable protocols.

See Also:
 - [linked-list-typescript][list]
 - [stack-typescript][stack]
 - [queue-typescript][queue]

## Installation

[npm][]:

```bash
npm install --save hashlist-typescript
```

[yarn][]:

```bash
yarn add hashlist-typescript
```

## Building from source

install dev dependencies. There are no production dependencies.

```bash
yarn
npm install
```

build using the options in `tsconfig.json`

```bash
yarn|npm run build
```

run all package tests

```bash
yarn|npm run test
```

see the test coverage report

```bash
yarn|npm run coverage
yarn|npm run coverage:report
```

## Usage

Importing:

```typescript
import { HashList } from 'hashlist-typescript';
const { HashList } = require('hashlist-typescript')
```

## API

### HashList<T>(...values: T[])

#### HashList<T>()

Create an empty linked list by omitting any arguments during instantiation.

```typescript
let list = new HashList<number>()
```

#### HashList<T>(...values: T[])

Create a new list and initialize it with values. Values will be appended from left
to right. i.e. the first argument will be at the head and the last argument will 
be at the tail.

Specify the type using the typescript templating to enable type-checking of all
values going into and out of the list.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
```

```typescript
let items: string[] = ['one', 'two', 'three', 'four'];
let list = new HashList<string>(...items);
```

Typescript will check if the values match the type given to the template
when initializing the new list.

```typescript
let items: = ['one', 'two', 'three', 4];
let list = new HashList<string>(...items); // arguments are not all strings
```

#### HashList<Foo>(...values: Foo[])

Create a new list using custom types or classes. All values are retained as references
and not copies so removed values can be compared using strict comparison.

```typescript
class Foo {
  private val:number;
  constructor(val: number) {
    this.val = val;
  }
  get bar(): number { return this.val }
}

let foo1 = new Foo(1);
let foo2 = new Foo(2);
let foo3 = new Foo(3);

let fooList = new HashList<Foo>(foo1, foo2, foo3)

fooList.head.bar // => 1
fooList.tail.bar // => 3
let val = list.removeHead()
val // => foo1
```



#### HashList<any>(...values: any[])

Specify `any` to allow the list to take values of any type.

```typescript
let list = new HashList<any>(4, 'hello' { hello: 'world' })
list.length // => 3
list.head // => 4
list.tail // => { hello: 'world' }
```

#### HashList#[Symbol.iterator]

The list supports both iterator and iterable protocols allowing it to be used
with the `for...of` and `...spread` operators and with deconstruction.

`for...of`:

```typescript
let items: number[] = [4, 5, 6];
let list = new HashList<number>(...items);

for (let item of list) {
  console.log(item)
}
//4
//5
//6
```

`...spread`:

```typescript
let items: number[] = [4, 5, 6];
let list = new HashList<number>(...items);

function manyArgs(...args) {
  for (let i in args) {
    console.log(args[i])
  }
}
manyArgs(...list);
//4
//5
//6
```

`deconstruction`:

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);

let [a, b, c] = list;
//a => 4
//b => 5
//c => 6
```

#### HashList<T>#head :T

Peek at the value at the head of the list. This will not remove the value
from the list.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.head // => 4
```

#### HashList<T>#tail :T

Peek at the value at the tail of the list. This will not remove the value
from the list.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.tail // => 7
```

#### HashList<T>#length :number

Query the length of the list. An empty list will return 0.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
```

#### HashList<T>#append(val: T, checkDuplicates: boolean = false): string

Append an item to the end of the list. The method returns a `key` that can be used
to retrieve the value at a later time. The new item will replace the previous tail item
and subsequent calls to [HashList<T>#head](#hashlistthead-t) will now recall the new item.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
list.append(8)
list.length // => 5
list.tail // => 8
```

The optional argument `checkDuplicates` is `false` by default. If set to `true`, it will
check if the new value is already contained in the list. If the value is found to be a
duplicate it will not be added and the method will return `false`.

Values are checked using strict `===` comparison. Checking for duplicates inserts the list
into a [`Set`][set] and then checks if the value is contained in the set.

Note that by default, duplicates will be added to the list. No collision handling is done as 
the duplicates are stored in separate nodes of the underlying linked list.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
let key = list.append(5, true)
list.length // => 4
list.tail // => 7
key // => uuid key for accessing the value.
```

#### HashList<T>#prepend(val: T, checkDuplicates: boolean = false): boolean

Prepend an item to the beginning of the list. The method returns a `key` that can be used
to retrieve the value at a later time. The new item will replace the previous head item
and subsequent calls to `HashList<T>#head` will now recall the new item.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
list.prepend(3)
list.length // => 5
list.head // => 3
```

The optional argument `checkDuplicates` is `false` by default. If set to `true`, it will
check if the new value is already contained in the list. If the value is found to be a 
duplicate it will not be added and the method will return `false`.

Values are checked using strict `===` comparison. Checking for duplicates inserts the list
into a [`Set`][set] and then checks if the value is contained in the set. 

Note that by default, duplicates will be added to the list. No collision handling is done as 
the duplicates are stored in separate nodes of the underlying linked list.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
let key = list.prepend(4, true)
list.length // => 4
list.head // => 4
key // => uuid key for accessing the value.
```

#### HashList<T>#removeHead(): T

Removes the item at the head of the list and returns the item.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
let val = list.removeHead()
list.length // => 3
list.head // => 5
val // => 4
```

#### HashList<T>#removeTail(): T

Removes the item at the tail of the list and returns the item.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
let val = list.removeTail()
list.length // => 3
list.tail // => 6
val // => 7
```

#### HashList<T>#remove(key: string): T

Removes the item, using the provided key, from the list and returns the item. If the 
item can not be located in the list the method will return undefined and the list will
not be altered.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
let key = list.append(8)
let val = list.remove(key)
list.length // => 4
list.tail // => 7
val // => 8
```

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
list.length // => 4
let val = list.remove('')
list.length // => 4
list.tail // => 7
val // => undefined
```

#### HashList<T>#toArray(): T[]

This method simply returns `[...this]`.

Converts the list into an array and returns the array representation. This method does
not mutate the list in any way.

Objects are not copied, so all non-primitive items in the array are still referencing
the list items.

```typescript
let items: number[] = [4, 5, 6, 7];
let list = new HashList<number>(...items);
let result = list.toArray()
result // => [4, 5, 6, 7]
```

## License

[MIT][license] © [Michael Sutherland][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/sfkiwi/hashlist-typescript.svg

[travis]: https://travis-ci.org/sfkiwi/hashlist-typescript

[coveralls-badge]: https://img.shields.io/coveralls/github/sfkiwi/hashlist-typescript.svg

[coveralls]: https://coveralls.io/github/sfkiwi/hashlist-typescript

[npm]: https://docs.npmjs.com/cli/install

[yarn]: https://yarnpkg.com/lang/en/docs/install/

[license]: LICENSE.md

[author]: http://github.com/sfkiwi

[wiki]: https://en.wikipedia.org/wiki/HashList_(abstract_data_type)

[list]: https://www.npmjs.com/package/linked-list-typescript

[stack]: https://www.npmjs.com/package/stack-typescript

[queue]: https://www.npmjs.com/package/queue-typescript

[hashlist]: https://www.npmjs.com/package/hashlist-typescript