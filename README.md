# cnc-tskit

A bunch of TypeScript functions and constants as used by miscellaneous web applications developed and maintained by the Czech National Corpus.

The library does not use any external dependencies.

## How to use in a project

1) Install:

```
npm install cnc-tskit --save
```

2) Use in your code:

```ts
import { pipe, tuple, Dict, List } from 'cnc-tskit';

function uniqItems(...d:Array<string|Array<string>>):Array<string> {
    return pipe(
        d,
        List.filter(v => !!v),
        List.flatMap(v => typeof v === 'string' ? [v] : v),
        List.map(v => tuple(v, true)),
        Dict.fromEntries(),
        Dict.keys()
    );
}

```

## main scope

* `composeLeft<T, U1,...,UN>(op1:Fn<T, U1,...,UN>):Fn<T, UN>`;
* `id<T>(v:T):T`
* `pipe<T, U1,...,UN>(data:T, op1:Fn<T, U1,...,UN>):UN`
* `tuple<T1, ..., TN>(...data:[T1,...,TN]):typeof data`

## Client

  * `isMobileTouchDevice():boolean`

## Color

  * `type RGBA = [number, number, number, number]`
  * `color2str():(c:RGBA)=>string`
  * `hsl2Rgb(hsl:[number, number, number]):RGBA`
  * `importColor(opacity:number, color:string):RGBA`
  * `luminosity(value:number, color:RGBA):RGBA`
  * `rgb2Hex(rgb:RGBA):string`
  * `rgb2Hsl(rgb:RGBA):[number, number, number]`
  * `textColorFromBg(bgColor:RGBA):RGBA`

## Dict

  * `clone<V, K extends string>(data:DictType<V, K>):DictType<V, K>`
  * `clear<V, K extends string>(data:DictType<V, K>):DictType<V, K>`
  * `empty<V, K extends string>(data:DictType<V, K>):boolean`
  * `every<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):boolean`
  * `filter<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):DictType<V, K>`
    * `filter<V, U extends V, K extends string>(pred:(v:V, k:K)=>v is U, data:DictType<V, K>):DictType<U, K>`
  * `find<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):[K, V]|undefined`
  * `forEach<V, K extends string>(effect:(v:V, k:K)=>void, data:DictType<V, K>):DictType<V, K>`
  * `fromEntries<V, K extends string>(items:Array<[K, V]>):DictType<V, K>`
  * `get<V, K extends string>(k:KeyArgType, dflt:V|undefined, data:DictType<V, K>):V|undefined`
  * `hasKey<V, K extends string>(k:KeyArgType, data:DictType<V, K>):boolean`
  * `hasValue<V, K extends string>(v:V, data:DictType<V, K>):boolean`
  * `keys<V, K extends string>(data:DictType<V, K>):Array<K>`
  * `map<V, U, K extends string>(mapper:(v:V, k:K)=>U, data:DictType<V, K>):DictType<U, K>`
  * `mapEntries<V, U, K extends string>(mapper:(entry:[K, V])=>U, data:DictType<V, K>):Array<[K, U]>`
  * `mergeDict<V, K extends string>(merger:(oldVal:V, newVal:V, key:K) => V, incoming:DictType<V, K>, data:DictType<V, K>):DictType<V, K>`
  * `normalize<V, K extends string>(data:DictType<V, K>):DictType<V, K>`
  * `remove<V, K extends string>(k:KeyArgType, data:DictType<V, K>):DictType<V, K>`
  * `set<V, K extends string>(k:KeyArgType, v:V, data:DictType<V, K>):DictType<V, K>`
  * `size<V, K extends string>(data:DictType<V, K>):number`
  * `some<V, K extends string>(pred:(v:V, k:K)=>boolean, data:DictType<V, K>):boolean`
  * `toEntries<V, K extends string>(data:DictType<V, K>):Array<[K, V]>`
  * `values<V, K extends string>(data:DictType<V, K>):Array<V>`


## List

  * `addUnique<T>(v:T, data:Array<T>):Array<T>`
  * `concat<T>(incoming:Array<T>, data:Array<T>):Array<T>`
  * `concatr<T>(incoming:Array<T>, data:Array<T>):Array<T>`
  * `empty<T>(data:Array<T>):boolean`
  * `every<T>(pred:(v:T)=>boolean, data:Array<T>):boolean`
  * `filter<T>(pred:(v:T, i:number)=>boolean, data:Array<T>):Array<T>`
    * `filter<T, S extends T>(pred:(v:T, i:number)=>v is S, data:Array<T>):Array<S>`
  * `find<T>(pred:(v:T, i:number)=>boolean, data:Array<T>):T|undefined`
  * `findIndex<T>(pred:(v:T, i:number)=>boolean, data:Array<T>):number`
  * `findRange<T>(cmp:(v1:T, v2:T)=>number):(data:Array<T>)=>[T, T]`
  * `flatMap<T, U>(mapper:(v:T, i:number) => Array<U>, data:Array<T>):Array<U>`
  * `foldl<T, U>(reducer:(acc:U, v:T)=>U, initial:U, data:Array<T>):U`
  * `foldr<T, U>(reducer:(acc:U, v:T)=>U, initial:U, data:Array<T>):U`
  * `forEach<T>(effect:(v:T, i:number)=>void, data:Array<T>):Array<T>`
  * `get<T>(idx:number, data:Array<T>):T`
  * `groupBy<T>(mapper:(v:T, i:number)=>string, data:Array<T>):Array<[string, Array<T>]>`
  * `head<T>(data:Array<T>):T`
  * `init<T>(data:Array<T>):Array<T>`
  * `join<T>(joinItemFact:(i:number)=>T, data:Array<T>):Array<T>`
  * `last<T>(data:Array<T>):T`
  * `map<T, U>(fn:(v:T, i:number)=>U):(data:Array<T>)=>Array<U>`
  * `maxItem<T>(mapper:(v:T)=>number, data:Array<T>):T`
  * `push<T>(v:T, data:Array<T>):Array<T>`
  * `range(from:number, to:number, step:number = 1):Array<number>`
  * `reduce<T, U>(reducer:(acc:U, V:T, i:number)=>U, initial:U, data:Array<T>):U`
  * `removeAt<T>(idx:number, data:Array<T>):Array<T>`
  * `removeValue<T>(v:T, data:Array<T>):Array<T>`
  * `repeat<T>(fn:(idx?:number)=>T, size:number):Array<T>`
  * `reverse<T>(data:Array<T>):Array<T>`
  * `reversed<T>(data:Array<T>):Array<T>`
  * `shift<T>(data:Array<T>):Array<T>`
  * `size<T>(data:Array<T>):number`
  * `slice<T>(start:number, end:number, data:Array<T>):Array<T>`
  * `some<T>(pred:(v:T)=>boolean, data:Array<T>):boolean`
  * `sortAlphaBy<T>(map:(v:T) => string, data:Array<T>):Array<T>`
  * `sortBy<T>(map:(v:T) => number, data:Array<T>):Array<T>`
  * `sorted<T>(cmp:(v1:T, v2:T) => number, data:Array<T>):Array<T>`
  * `sortedAlphaBy<T>(map:(v:T) => string, data:Array<T>):Array<T>`
  * `sortedBy<T>(map:(v:T) => number, data:Array<T>):Array<T>`
  * `tail<T>(data:Array<T>):Array<T>`
  * `toDict<T>(data:Array<T>):{[key:string]:T}`
  * `unique<T>(keyFn:(v:T)=>string|number|boolean, data:Array<T>):Array<T>`
  * `unshift<T>(v:T, data:Array<T>):Array<T>;`
  * `zip<T, U>(incoming:Array<U>, data:Array<T>):Array<[T, U]>`
  * `zipAll<T, U>(incoming:Array<U>, data:Array<T>):Array<[T|undefined, U|undefined]>`
  * `zipByMappedKey<T, U>(map:(v:T)=>string, dfltFact:()=>U, importer:(dest:U, incom:T, datasetIdx:number)=>U, data:Array<Array<T>>):Array<U>`

## HTTP

 * `enum Method`
 * `enum Status`

## Keyboard

  * `enum Code` (deprecated)
  * `isArrowKey(value:string):boolean`
  * `enum Value`

## Ident

  * `puid():string`
  * `hashCode(s:string):string`

## Maths

  * `enum AlphaLevel`
  * `calcPercentRatios<T, U>(get:(v:T)=>number, trans:(v:T, ratio:number)=>U, values:Array<T>):Array<U>`
  * `roundToPos(v:number, numPos:number):number`
  * `wilsonConfInterval(v:number, base:number, alphaId:AlphaLevel):[number, number]`

## Strings

  * `escapeRegexp(s:string):string`
  * `shortenText(text:string, maxLength:number, suff:string='\u2026'):string`
  * `function substitute(template:string, ...values:Array<string|number|boolean|((i:number)=>string|number|boolean)>):string`
  * `function overwriteStringFromLeft(orig:string, overwrite:string):string`
  * `function overwriteStringFromRight(orig:string, overwrite:string):string`

## Time

  * `secs2hms():(s:number)=>string`

## URL

  * `join(...path:string[]):string`
  * `valueToPairs<T>(obj:T):Array<[string, string]>`
