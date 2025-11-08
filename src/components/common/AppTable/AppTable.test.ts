import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'

import type { AppTableColumn } from './AppTable.props'
import AppTable from './AppTable.vue'

describe('AppTable', () => {
  const columns: AppTableColumn[] = [
    { key: 'name', label: 'Name' },
    { key: 'age', label: 'Age' },
  ]

  const data = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ]

  it('should render table with columns and data', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data,
      },
    })

    expect(wrapper.find('table').exists()).toBe(true)
    expect(wrapper.find('thead').exists()).toBe(true)
    expect(wrapper.find('tbody').exists()).toBe(true)
  })

  it('should render column headers', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data,
      },
    })

    const headers = wrapper.findAll('th')
    expect(headers).toHaveLength(2)
    expect(headers[0]?.text()).toBe('Name')
    expect(headers[1]?.text()).toBe('Age')
  })

  it('should render table rows', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data,
      },
    })

    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
  })

  it('should render cell data', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data,
      },
    })

    const cells = wrapper.findAll('tbody td')
    expect(cells[0]?.text()).toBe('John')
    expect(cells[1]?.text()).toBe('30')
    expect(cells[2]?.text()).toBe('Jane')
    expect(cells[3]?.text()).toBe('25')
  })

  it('should apply sticky header when stickyHeader is true', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data,
        stickyHeader: true,
      },
    })

    expect(wrapper.find('thead').classes()).toContain('app-table__header--sticky')
  })

  it('should not apply sticky header when stickyHeader is false', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data,
        stickyHeader: false,
      },
    })

    expect(wrapper.find('thead').classes()).not.toContain('app-table__header--sticky')
  })

  it('should render custom cell content via slot', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data,
      },
      slots: {
        'cell-name': '<template #cell-name="{ value }">{{ value.toUpperCase() }}</template>',
      },
    })

    const cells = wrapper.findAll('tbody td')
    expect(cells[0]?.text()).toBe('JOHN')
  })

  it('should render empty table when data is empty', () => {
    const wrapper = mount(AppTable, {
      props: {
        columns,
        data: [],
      },
    })

    expect(wrapper.find('tbody tr').exists()).toBe(false)
  })
})
