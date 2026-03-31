export const steps = ['Offer Type', 'Products', 'Timing', 'Customers']

export const step1Fields = [
  'ReservePrice',
  'MinimumVolumePerOrder',
  'MaximumVolumePerOrder',
  'VolumeIncrement',
  'TotalVolume',
]

export const step2Fields = [
  'VisibilityWindowStartDate',
  'VisibilityWindowEndDate',
  'PickupWindowStartDate',
  'PickupWindowEndDate',
  'VisibilityWindowStartTime',
  'VisibilityWindowEndTime',
  'PickupWindowStartTime',
  'PickupWindowEndTime',
  'InviteTriggerDate',
  'InviteTriggerTime',
]

export const volumeInputList = [
  {
    title: 'Min Volume Per Order',
    description: 'Minimum volume per individual order',
    name: 'MinimumVolumePerOrder',
    validator: (_field: any, value: number, form: any) => {
      if (!value || value <= 0) {
        return Promise.reject('Min Volume is required')
      }
      const maxVolume = form.getFieldValue('MaximumVolumePerOrder')
      if (maxVolume && value > maxVolume) {
        return Promise.reject('Min volume cannot be greater than max')
      }
      return Promise.resolve()
    },
  },
  {
    title: 'Max Volume Per Order',
    description: 'Maximum volume per individual order',
    name: 'MaximumVolumePerOrder',
    validator: (_field: any, value: number, form: any) => {
      if (!value || value <= 0) {
        return Promise.reject('Max Volume is required')
      }
      const minVolume = form.getFieldValue('MinimumVolumePerOrder')
      if (minVolume && value < minVolume) {
        return Promise.reject('Max volume cannot be less than min')
      }
      return Promise.resolve()
    },
  },
  {
    title: 'Volume Increment',
    description: 'Volume increment for orders',
    name: 'VolumeIncrement',
    validator: (_field: any, value: number) => {
      if (!value || value <= 0) {
        return Promise.reject('Volume Increment is required')
      }
      return Promise.resolve()
    },
  },
]

export const ReservePriceInfo = {
  title: 'Set Reserve Price',
  description: 'Set your minimum acceptable price for this auction',
  name: 'ReservePrice',
  formLabel: 'Reserve Price (per gallon)',
  extra: "Minimum price you'll accept for this auction",
}
export const FixedPriceInfo = {
  title: 'Set Fixed Price',
  description: 'Set your offer price for selected customers',
  name: 'ReservePrice',
  formLabel: 'Offer Price (per gallon)',
  extra: '',
}
