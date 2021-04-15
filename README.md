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
* id
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
  * rgb2Hex
  * rgb2Hsl
  * textColorFromBg

## Dict

  * empty
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
  * remove
  * set
  * size
  * some
  * toEntries


## List

  * addUnique
  * concat
  * empty
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
  * init
  * join
  * last
  * map
  * maxItem
  * push
  * range
  * reduce
  * removeAt
  * removeValue
  * repeat
  * reverse
  * reversed
  * shift
  * size
  * slice
  * some
  * sort
  * sortAlphaBy
  * sortBy
  * sorted
  * sortedAlphaBy
  * sortedBy
  * tail
  * toDict
  * unique
  * unshift
  * zip
  * zipAll
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

## Time

  * time2Hms

## URL

  * join
