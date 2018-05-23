import { v1 as uuid } from 'uuid';
 
export class HashList<T> {
  
  private _hashTable: {[key: string]: LinkedListItem<T>}
  private _head: LinkedListItem<T>;
  private _tail: LinkedListItem<T>;
  private _length: number;

  constructor(...values: T[]) {

    this._hashTable = {};
    this._head = this._tail = null;
    this._length = 0;

    if (values.length > 0) {
      values.forEach((value) => {
        this.append(value);
      });
    }
  }

  *iterator(): IterableIterator<T> {
    let currentItem = this._head;

    while (currentItem) {
      yield currentItem.value
      currentItem = currentItem.next
    }
  }

  [Symbol.iterator]() {
    return this.iterator();
  }

  get head(): T {
    return this._head ? this._head.value : null;
  }

  get tail(): T {
    return this._tail ? this._tail.value : null;
  }

  get length(): number {
    return this._length;
  }

  // Adds the element at a specific position inside the linked list
  insert(val: T, previousKey: string, checkDuplicates: boolean = false): string {

    if (checkDuplicates && this.isDuplicate(val)) {
      return null;
    }

    let key = uuid();
    let newItem: LinkedListItem<T> = new LinkedListItem<T>(key, val);
    let currentItem: LinkedListItem<T> = this._head;

    this._hashTable[key] = newItem;

    let previousItem = this._hashTable[previousKey];

    if (!previousItem) {
      return null;
    } else {
      newItem.prev = previousItem;
      newItem.next = previousItem.next;

      if (!previousItem.next) {
        this._tail = newItem;
      } else {
        previousItem.next.prev = newItem;
      }

      previousItem.next = newItem
      this._length++;
      return key;
    }
  }

  // Adds the element at the end of the linked list
  append(val: T, checkDuplicates: boolean = false): string {

    if (checkDuplicates && this.isDuplicate(val)) {
      return null;
    }

    let key = uuid();
    let newItem = new LinkedListItem<T>(key, val);
    this._hashTable[key] = newItem;

    if (!this._tail) {
      this._head = this._tail = newItem;
    } else {
      newItem.prev = this._tail;
      this._tail.next = newItem;
      this._tail = newItem;
    }
    this._length++;
    return key;
  }

  // Add the element at the beginning of the linked list
  prepend(val: T, checkDuplicates: boolean = false): string {

    if (checkDuplicates && this.isDuplicate(val)) {
      return null;
    }

    let key = uuid()
    let newItem = new LinkedListItem<T>(key, val);
    this._hashTable[key] = newItem;

    if (!this._head) {
      this._head = this._tail = newItem;
    } else {
      newItem.next = this._head;
      this._head.prev = newItem;
      this._head = newItem;
    }

    this._length++;
    return key;
  }

  remove(key: string): T {

    let currentItem = this._hashTable[key]

    if (!currentItem) {
      return;
    }

    if (currentItem === this._head) {
      this._head = currentItem.next;
    } else if (currentItem === this._tail) {
      this._tail = currentItem.prev;
    } else {
      currentItem.prev.next = currentItem.next;
      currentItem.next.prev = currentItem.prev;
    }

    currentItem.next = null;
    currentItem.prev = null;
    delete this._hashTable[key];
    this._length--;
    return currentItem.value;
  }

  removeHead(): T {

    let currentItem = this._head;

    // empty list
    if (!currentItem) {
      return;
    }

    // single item list
    if (!this._head.next) {
      this._head = null;
      this._tail = null;

      // full list
    } else {
      this._head.next.prev = null;
      this._head = this._head.next;
    }

    currentItem.next = currentItem.prev = null;
    delete this._hashTable[currentItem.key];
    this._length--;
    return currentItem.value;
  }

  removeTail(): T {
    let currentItem = this._tail;

    // empty list
    if (!currentItem) {
      return;
    }

    // single item list
    if (!this._tail.prev) {
      this._head = null;
      this._tail = null;

      // full list
    } else {
      this._tail.prev.next = null;
      this._tail = this._tail.prev;
    }

    currentItem.next = currentItem.prev = null;
    delete this._hashTable[currentItem.key]
    this._length--;
    return currentItem.value;
  }

  toArray(): T[] {
    return [...this];
  }

  private isDuplicate(val: T): boolean {
    let set = new Set(this.toArray());
    return set.has(val);
  }
}


export class LinkedListItem<T> {
  value: T;
  key: string;
  next: LinkedListItem<T>;
  prev: LinkedListItem<T>;

  constructor(key: string, val: T) {
    this.key = key;
    this.value = val;
    this.next = null;
    this.prev = null;
  }
}