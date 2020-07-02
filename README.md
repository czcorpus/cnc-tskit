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

* composeLeft
* pipe
* tuple

## Client

  * isMobileTouchDevice

## Color

  * RGBA
  * color2str
  * hsl2Rgb
  * importColor
  * luminosity
  * rgb2Hsl
  * textColorFromBg

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
  * foldl
  * foldr
  * forEach
  * get
  * groupBy
  * head
  * last
  * map
  * maxItem
  * range
  * reduce
  * removeValue
  * repeat
  * reverse
  * shift
  * slice
  * some
  * sort
  * sortBy
  * sorted
  * sortedBy
  * tail
  * toDict
  * unique
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
