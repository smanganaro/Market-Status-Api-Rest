import { expect, test } from '@jest/globals';
import { checkIfPossibleAndCalculate, validateCurrentPriceLimit, __RewireAPI__ as processEffectivePriceAPI } from '../data.processing/processEffectivePrice.js';
import { amountFixtureA, amountFixtureB } from './fixtures/amount.fixture.js';
import { RANDOM_NEGATIVE_INT, RANDOM_POSITIVE_INT, ZERO } from './fixtures/constants.fixture.js';
import { currentDeltasFixtureA, currentDeltasFixtureB } from './fixtures/currentDeltas.fixture.js';
import { effectivePriceFixtureA, effectivePriceFixtureB } from './fixtures/effectivePrice.fixture.js';
import { maximumOrderSizeFixtureA, maximumOrderSizeFixtureB } from './fixtures/maximumOrderSize.fixture.js';
import { priceLimitFixtureA, priceLimitFixtureB } from './fixtures/priceLimit.fixture.js';

describe('processEffectivePrice unit tests', () => {
  describe('validateCurrentPriceLimit', () => {
    describe.each([
      {
        describe: 'priceLimit defined',
        priceLimit: RANDOM_POSITIVE_INT
      },
      {
        describe: 'priceLimit undefined',
        priceLimit: -1
      }
    ])('$describe', ({priceLimit}) => {
      test.each([
        {
          test: `Should return ${priceLimit == -1? true : true} if value ${RANDOM_POSITIVE_INT}`,
          value: RANDOM_POSITIVE_INT,
          expected: priceLimit == -1? true : true,
        },
        {
          test: `Should return ${priceLimit == -1? true : false} if value ${RANDOM_NEGATIVE_INT}`,
          value: RANDOM_NEGATIVE_INT,
          expected: priceLimit == -1? true : false
        },
        {
          test: `Should return ${priceLimit == -1? true : false} if value ${ZERO}`,
          value: ZERO,
          expected: priceLimit == -1? true : false
        },
      ]
      )('$test', ({value, expected}) => {
        //Given
        processEffectivePriceAPI.__Rewire__('priceLimit', priceLimit)
        //When
        const result = validateCurrentPriceLimit(value)
        //Then
        expect(result).toEqual(expected)
        processEffectivePriceAPI.__ResetDependency__('priceLimit');
      })
    })
  })

  describe('checkIfPossibleAndCalculate', () => {
    describe.each([
      {
        describe: 'priceLimit defined',
        priceLimit: RANDOM_POSITIVE_INT
      },
      {
        describe: 'priceLimit undefined',
        priceLimit: -1
      }
    ])('$describe', ({priceLimit}) => {
      test.each([
        {
          test: `Should return ${priceLimit == -1? "effectivePrice" : "maximumOrderSize"} = ${priceLimit == -1?  effectivePriceFixtureA : maximumOrderSizeFixtureA }`,
          currentDeltas: currentDeltasFixtureA,
          expected: priceLimit == -1? {"effectivePrice" : effectivePriceFixtureA } : {"maximumOrderSize" : maximumOrderSizeFixtureA },
          amount: amountFixtureA,
          priceLimitVal: priceLimitFixtureA
        },
        {
          test: `Should return ${priceLimit == -1? "effectivePrice" : "maximumOrderSize"} = ${priceLimit == -1?  effectivePriceFixtureB : maximumOrderSizeFixtureB }`,
          currentDeltas: currentDeltasFixtureB,
          expected: priceLimit == -1? {"effectivePrice" : effectivePriceFixtureB } : {"maximumOrderSize" : maximumOrderSizeFixtureB },
          amount: amountFixtureB,
          priceLimitVal: priceLimitFixtureB
        },
      ])('$test', ({currentDeltas, amount, expected, priceLimitVal}) => {
        //Given
        processEffectivePriceAPI.__Rewire__('priceLimit', priceLimit == -1? priceLimit : priceLimitVal)
        processEffectivePriceAPI.__Rewire__('amount', amount)
        //When
        const result = checkIfPossibleAndCalculate(currentDeltas)
        //Then
        expect(result).toEqual(expected)
        processEffectivePriceAPI.__ResetDependency__('priceLimit');
        processEffectivePriceAPI.__ResetDependency__('amount');
      })
    })
  })
})