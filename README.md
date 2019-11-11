# RXJS: Reactive Extensions Library for JavaScript
RxJS is a library for reactive programming using Observables, to make it easier to compose asynchronous or callback-based code. This project is a rewrite of Reactive-Extensions/RxJS with better performance, better modularity, better debuggable call stacks, while staying mostly backwards compatible, with some breaking changes that reduce the API surface.

#### <a href="#observables-observer--subcription">Observables, Observer & Subcription</a>

#### <a href="#subjects-1">Subjects</a>
<ol>
  <li><a href="#1-subject">Subject</a></li>
  <li><a href="#2-behaviorsubject">BehaviorSubject</a></li>
  <li><a href="#3-asyncsubject">AsyncSubject</a></li>
  <li><a href="#4-replaysubject">ReplaySubject</a></li>
</ol>

#### Operators
<ol>
  <li><a href="javascript:;">of</a></li>
  <li><a href="javascript:;">from</a></li>
  <li><a href="javascript:;">Pipe</a></li>
  <li><a href="javascript:;">map</a></li>
  <li><a href="javascript:;">mapto</a></li>
  <li><a href="javascript:;">mergeMap</a></li>
  <li><a href="javascript:;">switchMap</a></li>
  <li><a href="javascript:;">flatMap</a></li>
  <li><a href="javascript:;">scan</a></li>
  <li><a href="javascript:;">reduce</a></li>
  <li><a href="javascript:;">pluck</a></li>
  <li><a href="javascript:;">Filter</a></li>
  <li><a href="javascript:;">zip</a></li>
  <li><a href="javascript:;">tap</a></li>
</ol>

### Observables, Observer & Subcription

**Observer**
- You usually won't interact with the Observer object directly, as you'll likely interact with a Subject instead (which we cover below), but it's important to know what it does.
- Observers allow you to "push" new data into an observable sequence. You can think of this as a "Write-only" way of modifying observable sequences (to go back to our analogy of assembly lines, observers can only add new cars onto an assembly line).

**Observable**
- An Observable is what we can use to listen, aka subscribe, to new changes that are emitted by an Observer. Think of this as a "Read-only" assembly line (you can only observe when new cars come off the assembly line).

**Operators**
- The purpose of Operators in RxJS are the same as most operators in other programming languages/libraries: they allow you to perform operations on your code.
- In RxJS, you can think of Operators as a way to manipulate the data coming from a Subject (or Observer) before it's sent to an Observable. This is the equivalent of instructing an assembly line to modify the car in a certain way (i.e. paint it black, shine it, etc) and then return it to the next assembly line.

The essential concepts in RxJS which solve async event management are:

- **Observable**: represents the idea of an invokable collection of future values or events.
- **Observer**: is a collection of callbacks that knows how to listen to values delivered by the Observable.
- **Subscription**: represents the execution of an Observable, is primarily useful for cancelling the execution.
- **Operators**: are pure functions that enable a functional programming style of dealing with collections with operations like map, filter, concat, reduce, etc.
- **Subject**: is the equivalent to an EventEmitter, and the only way of multicasting a value or event to multiple Observers.
- **Schedulers**: are centralized dispatchers to control concurrency, allowing us to coordinate when computation happens on e.g. setTimeout or requestAnimationFrame or others.

**Promise vs Observable**

##### Promise
- A Promise handles a single event when an async operation completes or fails.
- Note: There are Promise libraries out there that support cancellation, but ES6 Promise doesn't so far.
- Having one pipeline
- Usually only use with async data return

##### Observable
- An Observable is like a Stream (in many languages) and allows to pass zero or more events where the callback is called for each event.
- Often Observable is preferred over Promise because it provides the features of Promise and more. With Observable it doesn't matter if you want to handle 0, 1, or multiple events. You can utilize the same API in each case.
- Observable also has the advantage over Promise to be cancelable. If the result of an HTTP request to a server or some other expensive async operation isn't needed anymore, the Subscription of an Observable allows to cancel the subscription, while a Promise will eventually call the success or failed callback even when you don't need the notification or the result it provides anymore.
- Observable provides operators like map, forEach, reduce, ... similar to an array
- There are also powerful operators like retry(), or replay(), ... that are often quite handy.
- Are cancellable
- Are re-triable by nature such as retry and retryWhen.
- Stream data in multiple pipelines.
- Having array-like operations like map, filter etc.
- Can be created from other sources like events.
- They are functions, which could be subscribed later on.

Observable | Promise
------------ | -------------
It Emit multiple value over a period of time. | Emit only single value at a time
Lazy, Observable in not called until we subscribe to an observable. | Not Lazy, It call the service without .then and .catch
Can be cancelled using unsubscribe() method. | Not possible to cancelled.
Observable provides the map, forEach, Filter, reduce, retry, retryWhen Operators | It not Provide any Operators.


#### 1. Creating observable 
Here's an example that demonstrates the basic usage model by showing how an observable could be used to provide geolocation updates.
```javascript
// Create an Observable that will start listening to geolocation updates
// when a consumer subscribes.
const locations = new Observable((observer) => {
  // Get the next and error callbacks. These will be passed in when
  // the consumer subscribes.
  const {next, error} = observer;
  let watchId;

  // Simple geolocation API check provides values to publish
  if ('geolocation' in navigator) {
    watchId = navigator.geolocation.watchPosition(next, error);
  } else {
    error('Geolocation not available');
  }

  // When the consumer unsubscribes, clean up data ready for next subscription.
  return {unsubscribe() { navigator.geolocation.clearWatch(watchId); }};
});

// Call subscribe() to start listening for updates.
const locationsSubscription = locations.subscribe({
  next(position) { console.log('Current Position: ', position); },
  error(msg) { console.log('Error Getting Location: ', msg); }
});

// Stop listening for location after 10 seconds
setTimeout(() => { locationsSubscription.unsubscribe(); }, 10000);
```

#### 2. Defining observers
A handler for receiving observable notifications implements the Observer interface. It is an object that defines callback methods to handle the three types of notifications that an observable can send:

NOTIFICATION TYPE | DESCRIPTION
------------ | -------------
next | Required. A handler for each delivered value. Called zero or more times after execution starts.
error | Optional. A handler for an error notification. An error halts execution of the observable instance.
complete | Optional. A handler for the execution-complete notification. Delayed values can continue to be delivered to the next handler after execution is complete.

```javascript
const button = document.querySelector("button");
const observer = {
  next: function(value) {
    console.log(value);
  },
  error: function(err) {
    console.error(err);
  },
  complete: function() {
    console.log("Completed");
  }
};
// Create an Observable from event
const observable = Rx.Observable.fromEvent(button, "click");
// Subscribe to begin listening for async result
observable.subscribe(observer);
```
##### In Angular - observers
```javascript
// Create simple observable that emits three values
const myObservable = of(1, 2, 3);

// Create observer object
const myObserver = {
  next: x => console.log('Observer got a next value: ' + x),
  error: err => console.error('Observer got an error: ' + err),
  complete: () => console.log('Observer got a complete notification'),
};
// Execute with the observer object
myObservable.subscribe(myObserver);
// Logs:
// Observer got a next value: 1
// Observer got a next value: 2
// Observer got a next value: 3
// Observer got a complete notification
```

#### 3. Subscribe with positional arguments

```javascript
myObservable.subscribe(
  x => console.log('Observer got a next value: ' + x),
  err => console.error('Observer got an error: ' + err),
  () => console.log('Observer got a complete notification')
);
```

##### Example 1: Observable from array

```javascript
// RxJS v6+
import { from } from 'rxjs';

//emit array as a sequence of values
const arraySource = from([1, 2, 3, 4, 5]);
//output: 1,2,3,4,5
const subscribe = arraySource.subscribe(val => console.log(val));
```

##### Example 2:  Observable from Promise
```javascript
// RxJS v6+
import { from } from 'rxjs';

//emit result of promise
const promiseSource = from(new Promise(resolve => resolve('Hello World!')));
//output: 'Hello World'
const subscribe = promiseSource.subscribe(val => console.log(val));
```

### Subjects
Reference: https://rxjs-dev.firebaseapp.com/guide/subject
- A Subject is simply an Observer and Observable. You can push new values as well as subscribe to it. Think of this as a "Read & Write" assembly line (you can both add cars onto the assembly line and observe cars that come off the assembly line).
- What is a Subject? An RxJS Subject is a special type of Observable that allows values to be multicasted to many Observers. While plain Observables are unicast (each subscribed Observer owns an independent execution of the Observable), Subjects are multicast.
- Subject is the equivalent to an EventEmitter, and the only way of multicasting a value or event to multiple Observers.

**Types of subjects**
<ol>
  <li><a href="#1-subject">Subject</a></li>
  <li><a href="#2-behaviorsubject">BehaviorSubject</a></li>
  <li><a href="#3-asyncsubject">AsyncSubject</a></li>
  <li><a href="#4-replaysubject">ReplaySubject</a></li>
</ol>

#### 1. Subject

```javascript
import { Subject } from 'rxjs';
 
const subject = new Subject<number>();
 
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});
 
subject.next(1);
subject.next(2);
 
// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
```

Since a Subject is an Observer, this also means you may provide a Subject as the argument to the subscribe of any Observable, like the example below shows:

```javascript
import { Subject, from } from 'rxjs';
 
const subject = new Subject<number>();
 
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});
 
const observable = from([1, 2, 3]);
 
observable.subscribe(subject); // You can subscribe providing a Subject
 
// Logs:
// observerA: 1
// observerB: 1
// observerA: 2
// observerB: 2
// observerA: 3
// observerB: 3
```

#### 2. BehaviorSubject
- One of the variants of Subjects is the BehaviorSubject, which has a notion of "the current value". It stores the latest value emitted to its consumers, and whenever a new Observer subscribes, it will immediately receive the "current value" from the BehaviorSubject.
- BehaviorSubjects are useful for representing "values over time". For instance, an event stream of birthdays is a Subject, but the stream of a person's age would be a BehaviorSubject.

In the following example, the BehaviorSubject is initialized with the value 0 which the first Observer receives when it subscribes. The second Observer receives the value 2 even though it subscribed after the value 2 was sent.
```javascript
import { BehaviorSubject } from 'rxjs';
const subject = new BehaviorSubject(0); // 0 is the initial value
 
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
 
subject.next(1);
subject.next(2);
 
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});
 
subject.next(3);
 
// Logs
// observerA: 0
// observerA: 1
// observerA: 2
// observerB: 2
// observerA: 3
// observerB: 3
```

#### 3. AsyncSubject
The AsyncSubject is a variant where only the last value of the Observable execution is sent to its observers, and only when the execution completes.

```javascript
import { AsyncSubject } from 'rxjs';
const subject = new AsyncSubject();
 
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
 
subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);
 
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});
 
subject.next(5);
subject.complete();
 
// Logs:
// observerA: 5
// observerB: 5
```

**Note:** The AsyncSubject is similar to the last() operator, in that it waits for the complete notification in order to deliver a single value.

#### 4. ReplaySubject
- A ReplaySubject is similar to a BehaviorSubject in that it can send old values to new subscribers, but it can also record a part of the Observable execution.
- A ReplaySubject records multiple values from the Observable execution and replays them to new subscribers.

When creating a ReplaySubject, you can specify how many values to replay:

```javascript
import { ReplaySubject } from 'rxjs';
const subject = new ReplaySubject(3); // buffer 3 values for new subscribers
 
subject.subscribe({
  next: (v) => console.log(`observerA: ${v}`)
});
 
subject.next(1);
subject.next(2);
subject.next(3);
subject.next(4);
 
subject.subscribe({
  next: (v) => console.log(`observerB: ${v}`)
});
 
subject.next(5);
 
// Logs:
// observerA: 1
// observerA: 2
// observerA: 3
// observerA: 4
// observerB: 2
// observerB: 3
// observerB: 4
// observerA: 5
// observerB: 5
```

##### References
- https://rxjs-dev.firebaseapp.com/guide/overview
- https://www.learnrxjs.io
- https://www.youtube.com/watch?v=T9wOu11uU6U&list=PL55RiY5tL51pHpagYcrN9ubNLVXF8rGVi
- https://jsfiddle.net/suryansh54/6nz2bL1t/
- https://www.youtube.com/watch?v=Tux1nhBPl_w 
- https://angular.io/guide/observables
- https://ultimatecourses.com/blog/rxjs-observables-observers-operators 
