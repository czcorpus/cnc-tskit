# cnc-tskit

A bunch of TypeScript functions and constants as used by miscellaneous web applications developed and maintained by the Czech National Corpus.

## How to use in a project

1) Install:

```
npm install cnc-tskit --save
```

2) Use in your code:

```ts
import { pipe, Dict, List } from 'cnc-tskit';

const total = pipe(
    mydata,
    Dict.filter((v, k) => v.result > 50),
    Dict.toEntries(),
    List.reduce((acc, [,v]) => acc + v, 0)
);

```

## main scope

* pipe
* composeLeft

## Color

  * RGBA
  * textColorFromBg
  * importColor

## Dict

  * every
  * filter
  * find
  * forEach
  * fromEntries
  * get
  * hasKey
  * hasValue
  * keys
  * map
  * mapEntries
  * mergeDict
  * size
  * toEntries


## List

  * addUnique
  * concat
  * every
  * filter
  * find
  * findIndex
  * findRange
  * flatMap
  * forEach
  * get
  * groupBy
  * map
  * maxItem
  * range
  * reduce
  * removeValue
  * repeat
  * shift
  * slice
  * some
  * sort
  * sortBy
  * toDict
  * zip
  * zipByMappedKey

## HTTP

 * Method
 * Status

## Keyboard

  * Code
  * isArrowKey

## Ident

  * puid
  * hashCode

## Maths

  * calcPercentRatios
  * roundToPos
  * wilsonConfInterval
  
## Strings
  
  * shortenText
