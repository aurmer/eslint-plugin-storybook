/**
 * @fileoverview Interactions should be awaited
 * @author Yann Braga
 */

import dedent from 'ts-dedent'
//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

import rule from '../../../lib/rules/await-interactions'
import ruleTester from '../../utils/rule-tester'

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------
ruleTester.run('await-interactions', rule, {
  valid: [
    dedent`
      Basic.play = async () => {
        await userEvent.click(button)
      }
    `,
    dedent`
      WithModalOpen.play = async ({ canvasElement }) => {
        const MyButton = await canvas.findByRole('button')
      }
    `,
    dedent`
      WithModalOpen.play = async ({ canvasElement }) => {
        const element: HTMLButtonElement = await within(canvasElement).findByText(/Hello/i)
        await userEvent.click(element, undefined, { clickCount: 2 })
        await userEvent.click(await within(canvasElement).findByText(/Hello/i), undefined, {
          clickCount: 2,
        })
      }
    `,
  ],
  invalid: [
    {
      code: dedent`
        WithModalOpen.play = async ({ canvasElement }) => {
          const canvas = within(canvasElement)

          const foodItem = canvas.findByText(/Cheeseburger/i)
          userEvent.click(foodItem)

          const modalButton = canvas.findByLabelText('increase quantity by one')
          userEvent.click(modalButton)
        }
      `,
      output: dedent`
        WithModalOpen.play = async ({ canvasElement }) => {
          const canvas = within(canvasElement)

          const foodItem = await canvas.findByText(/Cheeseburger/i)
          await userEvent.click(foodItem)

          const modalButton = await canvas.findByLabelText('increase quantity by one')
          await userEvent.click(modalButton)
        }
      `,
      errors: [
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'findByText' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'userEvent' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'findByLabelText' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'userEvent' },
        },
      ],
    },
    {
      code: dedent`
          WithModalOpen.play = async ({ canvasElement }) => {
            const element: HTMLButtonElement = within(canvasElement).findByText(/Hello/i)
            userEvent.click(element, undefined, { clickCount: 2 })
            userEvent.click(within(canvasElement).findByText(/Hello/i), undefined, {
              clickCount: 2,
            })
          }
        `,
      output: dedent`
        WithModalOpen.play = async ({ canvasElement }) => {
          const element: HTMLButtonElement = await within(canvasElement).findByText(/Hello/i)
          await userEvent.click(element, undefined, { clickCount: 2 })
          await userEvent.click(await within(canvasElement).findByText(/Hello/i), undefined, {
            clickCount: 2,
          })
        }
      `,
      errors: [
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'findByText' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'userEvent' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'userEvent' },
        },
        {
          messageId: 'interactionShouldBeAwaited',
          data: { method: 'findByText' },
        },
      ],
    },
  ],
})
