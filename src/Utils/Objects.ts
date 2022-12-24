import { DateTime } from '@ikomida/shared-logics'
import type { Classes } from '@ikomida/shared-types'
import { Stores } from '..'
import TextEdit from '../components/TextEdit.svelte'

export function validateFields(object: any) {
  if (!object) {
    return false
  }
  for (const item of Object.entries(object)) {
    if (
      (typeof item?.[1] !== 'object' && typeof item?.[1] !== 'boolean') ||
      (typeof item?.[1] === 'object' && !validateFields(item?.[1])) ||
      !item?.[1]
    ) {
      return false
    }
  }
  return true
}

export function updateInputs(inputs: any, object: any) {
  for (const key of Object.keys(inputs)) {
    if (typeof object[key] === 'object' && typeof inputs === 'object' && key in inputs) {
      updateInputs(inputs?.[key], object[key])
    } else if (
      ['bigint', 'boolean', 'number', 'string', 'symbol', 'undefined'].includes(typeof object[key]) &&
      typeof inputs === 'object' &&
      key in inputs &&
      inputs?.[key] instanceof TextEdit
    ) {
      inputs?.[key]?.updateValue(object[key])
    }
  }
  return true
}

export function isTrue(object: any) {
  return ![undefined, null, false].includes(object)
}

export function validateBusinessTime(business: Classes.CBusinessTime[]) {
  if (!business || (business?.length ?? 0) < 1) {
    Stores.MessageAlert.instance.show('Precisa escolher pelo menos um dia de funcionamento!')
    Stores.Loading.instance.stop()
    return false
  }
  for (const businessDay of business ?? []) {
    for (const businessHour of businessDay.hours ?? []) {
      if (!DateTime.validateTime(businessHour?.start)) {
        Stores.MessageAlert.instance.show(
          'O horário de abertura é inválido, o formato deve ser HH:mm e entre 00:00 e 23:59!'
        )
        Stores.Loading.instance.stop()
        return false
      } else if (!DateTime.validateTime(businessHour?.end)) {
        Stores.MessageAlert.instance.show(
          'O horário de fechamento é inválido, o formato deve ser HH:mm e entre 00:00 e 23:59!'
        )
        Stores.Loading.instance.stop()
        return false
      } else if (Number(businessHour.start) > Number(businessHour.end)) {
        Stores.MessageAlert.instance.show(
          'O horário de abertura deve ser menor que o horário de fechamento, exemplo de abertura: 09:00 e fechamento: 18:00!'
        )
        Stores.Loading.instance.stop()
        return false
      }
    }
  }
  return true
}

export function animateCSS(node: HTMLDivElement, animation: string, prefix: string = '') {
  return new Promise((resolve, reject) => {
    node.classList.add(`${prefix}${animation}`)

    function handleAnimationEnd(event: Event) {
      event.stopPropagation()
      node.classList.remove(`${prefix}${animation}`)
      resolve('Animation ended')
    }

    node.addEventListener('animationend', handleAnimationEnd, { once: true })
  })
}
