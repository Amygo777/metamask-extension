import React from 'react'
import assert from 'assert'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import SendToRow from '../send-to-row.component.js'

import SendRowWrapper from '../../send-row-wrapper/send-row-wrapper.component'
import EnsInput from '../../../../ens-input'

const propsMethodSpies = {
  closeToDropdown: sinon.spy(),
  openToDropdown: sinon.spy(),
  updateSendTo: sinon.spy(),
  updateSendToError: sinon.spy(),
}

const MOCK_EVENT = { preventDefault: () => {} }

sinon.spy(SendToRow.prototype, 'handleToChange')

describe('SendToRow Component', function () {
  let wrapper
  let instance

  beforeEach(() => {
    wrapper = shallow(<SendToRow
      closeToDropdown={propsMethodSpies.closeToDropdown}
      inError={false}
      network={'mockNetwork'}
      openToDropdown={propsMethodSpies.openToDropdown}
      to={'mockTo'}
      toAccounts={['mockAccount']}
      toDropdownOpen={false}
      updateSendTo={propsMethodSpies.updateSendTo}
      updateSendToError={propsMethodSpies.updateSendToError}
    />, { context: { t: str => str + '_t' } })
    instance = wrapper.instance()
  })

  afterEach(() => {
    propsMethodSpies.closeToDropdown.resetHistory()
    propsMethodSpies.openToDropdown.resetHistory()
    propsMethodSpies.updateSendTo.resetHistory()
    propsMethodSpies.updateSendToError.resetHistory()
    SendToRow.prototype.handleToChange.resetHistory()
  })

  describe('handleToChange', () => {

    it('should call updateSendTo', () => {
      assert.equal(propsMethodSpies.updateSendTo.callCount, 0)
      instance.handleToChange('mockTo2', 'mockNickname')
      assert.equal(propsMethodSpies.updateSendTo.callCount, 1)
      assert.deepEqual(
        propsMethodSpies.updateSendTo.getCall(0).args,
        ['mockTo2', 'mockNickname']
      )
    })

    it('should call updateSendToError', () => {
      assert.equal(propsMethodSpies.updateSendToError.callCount, 0)
      instance.handleToChange('mockTo2')
      assert.equal(propsMethodSpies.updateSendToError.callCount, 1)
      assert.deepEqual(
        propsMethodSpies.updateSendToError.getCall(0).args,
        ['mockTo2']
      )
    })

  })

  describe('render', () => {
    it('should render a SendRowWrapper component', () => {
      assert.equal(wrapper.find(SendRowWrapper).length, 1)
    })

    it('should pass the correct props to SendRowWrapper', () => {
      const {
        errorType,
        label,
        showError,
      } = wrapper.find(SendRowWrapper).props()

      assert.equal(errorType, 'to')

      assert.equal(label, 'to_t:')

      assert.equal(showError, false)
    })

    it('should render an EnsInput as a child of the SendRowWrapper', () => {
      assert(wrapper.find(SendRowWrapper).childAt(0).is(EnsInput))
    })

    it('should render the EnsInput with the correct props', () => {
      const {
        accounts,
        closeDropdown,
        dropdownOpen,
        inError,
        name,
        network,
        onChange,
        openDropdown,
        placeholder,
        to,
      } = wrapper.find(SendRowWrapper).childAt(0).props()
      assert.deepEqual(accounts, ['mockAccount'])
      assert.equal(dropdownOpen, false)
      assert.equal(inError, false)
      assert.equal(name, 'address')
      assert.equal(network, 'mockNetwork')
      assert.equal(placeholder, 'recipientAddress_t')
      assert.equal(to, 'mockTo')
      assert.equal(propsMethodSpies.closeToDropdown.callCount, 0)
      closeDropdown()
      assert.equal(propsMethodSpies.closeToDropdown.callCount, 1)
      assert.equal(propsMethodSpies.openToDropdown.callCount, 0)
      openDropdown()
      assert.equal(propsMethodSpies.openToDropdown.callCount, 1)
      assert.equal(SendToRow.prototype.handleToChange.callCount, 0)
      onChange('mockNewTo', 'mockNewNickname')
      assert.equal(SendToRow.prototype.handleToChange.callCount, 1)
      assert.deepEqual(
        SendToRow.prototype.handleToChange.getCall(0).args,
        ['mockNewTo', 'mockNewNickname']
      )
    })
  })
})
