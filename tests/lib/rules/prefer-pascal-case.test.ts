/**
 * @fileoverview Prefer pascal case
 * @author Yann Braga
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import { AST_NODE_TYPES } from '@typescript-eslint/types'
import dedent from 'ts-dedent'

import rule from '../../../lib/rules/prefer-pascal-case'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

ruleTester.run('prefer-pascal-case', rule, {
  valid: [
    'export const Primary = {}',
    'export const Primary: Story = {}',
    `
      export default {
        title: 'MyComponent',
        component: MyComponent,
        includeStories: ['SimpleStory', 'ComplexStory'],
        excludeStories: /.*Data$/,
      };

      export const simpleData = { foo: 1, bar: 'baz' };
      export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

      export const SimpleStory = () => <MyComponent data={simpleData} />;
      export const ComplexStory = () => <MyComponent data={complexData} />;
    `,
  ],

  invalid: [
    {
      code: dedent`
        export const primary = {}
        primary.foo = 'bar'
      `,
      errors: [
        {
          messageId: 'usePascalCase',
          data: {
            name: 'primary',
          },
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'convertToPascalCase',
              output: dedent`
                export const Primary = {}
                Primary.foo = 'bar'
              `,
            },
          ],
        },
      ],
    },
    {
      code: dedent`
        export const primary: Story = {}
        primary.foo = 'bar'
      `,
      errors: [
        {
          messageId: 'usePascalCase',
          data: {
            name: 'primary',
          },
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'convertToPascalCase',
              output: dedent`
                export const Primary: Story = {}
                Primary.foo = 'bar'
              `,
            },
          ],
        },
      ],
    },
    {
      code: dedent`
        export default {
          title: 'MyComponent',
          component: MyComponent,
          includeStories: /.*Story$/,
          excludeStories: /.*Data$/,
        };

        export const simpleData = { foo: 1, bar: 'baz' };
        export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

        export const simpleStory = () => <MyComponent data={simpleData} />;
        simpleStory.args = {};
      `,
      errors: [
        {
          messageId: 'usePascalCase',
          data: {
            name: 'simpleStory',
          },
          type: AST_NODE_TYPES.Identifier,
          suggestions: [
            {
              messageId: 'convertToPascalCase',
              output: dedent`
                export default {
                  title: 'MyComponent',
                  component: MyComponent,
                  includeStories: /.*Story$/,
                  excludeStories: /.*Data$/,
                };

                export const simpleData = { foo: 1, bar: 'baz' };
                export const complexData = { foo: 1, foobar: { bar: 'baz', baz: someData } };

                export const SimpleStory = () => <MyComponent data={simpleData} />;
                SimpleStory.args = {};
              `,
            },
          ],
        },
      ],
    },
  ],
})
