import { useState } from 'react'
import { CheckCard, CheckCardGroup, Texto, Vertical } from '@gravitate-js/excalibrr'
import { Input, Select, Switch, DatePicker, Checkbox, InputNumber, Radio } from 'antd'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function FormControlsShowcase() {
  const [checkCardValue, setCheckCardValue] = useState<string[]>([])
  const [switchVal, setSwitchVal] = useState(true)

  return (
    <ShowcaseShell
      title="Form Controls"
      subtitle="CheckCard, CheckCardGroup, AntD Input/Select/Switch/DatePicker/Checkbox"
      accentColor="#faad14"
      gridMode="2col"
    >
      <SectionDivider title="CheckCard" />
      <SpecimenCard label="CheckCard (single)" props='title="Option A" checked'>
        <CheckCard title="Option A" description="First option" checked onChange={() => {}} />
      </SpecimenCard>

      <SectionDivider title="CheckCardGroup" />
      <SpecimenCard label="CheckCardGroup" props='value={selected} onChange={setSelected}' wide>
        <CheckCardGroup value={checkCardValue} onChange={(values: string[]) => setCheckCardValue(values)}>
          <CheckCard title="Monthly" description="Billed monthly" value="monthly" />
          <CheckCard title="Quarterly" description="Billed quarterly" value="quarterly" />
          <CheckCard title="Annual" description="Billed annually" value="annual" />
        </CheckCardGroup>
      </SpecimenCard>

      <SectionDivider title="AntD — Text Inputs" />
      <SpecimenCard label="Input" props="placeholder='Enter value...'">
        <Input placeholder="Enter value..." style={{ width: '100%' }} />
      </SpecimenCard>
      <SpecimenCard label="Input.TextArea" props="rows={3}">
        <Input.TextArea rows={3} placeholder="Enter description..." style={{ width: '100%' }} />
      </SpecimenCard>
      <SpecimenCard label="InputNumber" props="min={0} max={100}">
        <InputNumber min={0} max={100} defaultValue={42} style={{ width: '100%' }} />
      </SpecimenCard>
      <SpecimenCard label="Input.Password" props="placeholder='Password'">
        <Input.Password placeholder="Password" style={{ width: '100%' }} />
      </SpecimenCard>

      <SectionDivider title="AntD — Selection" />
      <SpecimenCard label="Select" props="options=[...] placeholder='Choose...'">
        <Select
          placeholder="Choose a product..."
          style={{ width: '100%' }}
          options={[
            { value: 'diesel', label: 'Diesel' },
            { value: 'gasoline', label: 'Gasoline' },
            { value: 'propane', label: 'Propane' },
            { value: 'ethanol', label: 'Ethanol' },
          ]}
        />
      </SpecimenCard>
      <SpecimenCard label="Select — Multi" props="mode='multiple'">
        <Select
          mode="multiple"
          placeholder="Select regions..."
          style={{ width: '100%' }}
          options={[
            { value: 'northeast', label: 'Northeast' },
            { value: 'southeast', label: 'Southeast' },
            { value: 'midwest', label: 'Midwest' },
            { value: 'west', label: 'West' },
          ]}
        />
      </SpecimenCard>
      <SpecimenCard label="Radio.Group" props="options=[...]">
        <Radio.Group
          defaultValue="fixed"
          options={[
            { value: 'fixed', label: 'Fixed' },
            { value: 'index', label: 'Index' },
            { value: 'formula', label: 'Formula' },
          ]}
        />
      </SpecimenCard>

      <SectionDivider title="AntD — Toggle & Check" />
      <SpecimenCard label="Switch" props="checked={value} onChange={setValue}">
        <Switch checked={switchVal} onChange={setSwitchVal} />
      </SpecimenCard>
      <SpecimenCard label="Checkbox" props="defaultChecked">
        <Checkbox defaultChecked>Enable notifications</Checkbox>
      </SpecimenCard>

      <SectionDivider title="AntD — Date" />
      <SpecimenCard label="DatePicker" props="placeholder='Select date'">
        <DatePicker placeholder="Select date" style={{ width: '100%' }} />
      </SpecimenCard>
      <SpecimenCard label="DatePicker.RangePicker" props="(date range)">
        <DatePicker.RangePicker style={{ width: '100%' }} />
      </SpecimenCard>
    </ShowcaseShell>
  )
}
