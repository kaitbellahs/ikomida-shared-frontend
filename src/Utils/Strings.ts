import { Finances } from '@ikomida/shared-logics'
const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro'
]
const articles = [
  'o',
  'os',
  'a',
  'as',
  'um',
  'uns',
  'uma',
  'umas',
  'a',
  'ao',
  'aos',
  'à',
  'às',
  'de',
  'do',
  'dos',
  'da',
  'das',
  'dum',
  'duns',
  'duma',
  'dumas',
  'em',
  'no',
  'nos',
  'na',
  'nas',
  'num',
  'nuns',
  'numa',
  'numas',
  'por',
  'per',
  'pelo',
  'pelos',
  'pela',
  'pelas',
  'pra',
  'para'
]
export const dayMiliseconds = 24 * 60 * 60 * 1000
export function currency(value?: number | string) {
  let newValue = Number(`${value}`.match(/\d/gi)?.join('') ?? 0) * 0.01
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
  return formatter.format(newValue)
}
export function percent(value?: number | string) {
  return currency(value).replace('R$ ', '% ')
}
export function formatNumber(value?: number) {
  const formatter = new Intl.NumberFormat('pt-BR')
  return formatter.format(value ?? 0)
}

export function timestampToString(timestamp?: number | Date) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp ?? 0)
  return `${Finances.pad(date.getDate(), 2)}/${Finances.pad(
    date.getMonth() + 1,
    2
  )}/${date.getFullYear()} ${Finances.pad(date.getHours(), 2)}:${Finances.pad(date.getMinutes(), 2)}:${Finances.pad(
    date.getSeconds(),
    2
  )}`
}

export function dateToString(dateTime?: string | Date, showSeconds = false) {
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime ?? '')
  const nowDate = new Date()
  let dateString = `${Finances.pad(date.getDate(), 2)} de ${months[date.getMonth()].substring(
    0,
    3
  )} de ${date.getFullYear()}`
  if (date.getFullYear() === nowDate.getFullYear() && date.getMonth() === nowDate.getMonth()) {
    if (date.getDate() === nowDate.getDate()) {
      dateString = 'Hoje'
    } else {
      nowDate.setDate(nowDate.getDate() + 1)
      if (date.getDate() === nowDate.getDate()) {
        dateString = 'Amanhã'
      } else {
        nowDate.setDate(nowDate.getDate() - 2)
        if (date.getDate() === nowDate.getDate()) {
          dateString = 'Ontem'
        }
      }
    }
  }
  let seconds = ''
  if (showSeconds) {
    seconds = `:${Finances.pad(date.getSeconds(), 2)}`
  }
  if (date.getTime() > nowDate.getTime() - 2 * dayMiliseconds) {
    dateString += ` às ${Finances.pad(date.getHours(), 2)}:${Finances.pad(date.getMinutes(), 2)}${seconds}`
  }
  return dateString
}

export function timeToString(input?: number) {
  let string = ''
  if (input && input >= 60) {
    let minutes = input % 60 > 0 ? Math.round(input / 60) : input / 60
    const seconds = input - minutes * 60
    const secondsString = seconds > 0 ? ` e ${seconds} segundos` : ''
    string = `${minutes} minutos${secondsString}`
    if (minutes >= 60) {
      const hours = minutes % 60 > 0 ? Math.round(minutes / 60) : minutes / 60
      minutes = minutes - hours * 60
      const minutesString = minutes > 0 ? ` e ${minutes} minutos` : ''
      string = `${hours} horas${minutesString}${secondsString}`
    }
  }
  return string
}

export function dateToDateString(dateTime?: string | Date, showTime = false) {
  if (!dateTime) {
    return '-'
  }
  const date = dateTime instanceof Date ? dateTime : new Date(dateTime)
  let time = ``
  if (showTime) {
    time = `às ${Finances.pad(date.getHours(), 2)}h e ${Finances.pad(date.getMinutes(), 2)}m e ${Finances.pad(
      date.getSeconds(),
      2
    )}s`
  }
  return date.getDate() + ' de ' + months[date.getMonth()] + ' de ' + date.getFullYear() + time
}

export function formatString(filter: RegExp, mask?: string | null, maskKey?: string | null, value?: string | null) {
  if (value === undefined) {
    value = ''
  }
  const _value =
    mask != null ? Array.from(`${value}`).filter((char, index) => char != mask[index]) : Array.from(`${value}`)
  if (filter && !filter.test(_value.join(''))) {
    return String(_value)
  } else {
    if (mask != null) {
      let index = 0
      value = ''
      Array.from(mask).forEach(char => {
        if (index < _value.length && char == maskKey) {
          value += _value[index]
          index++
        } else {
          value += char
        }
      })
    }
    return String(value ?? '')
  }
}

export function formatAsCNPJ(value?: string | number) {
  const filter = /^-?\d*$/
  const mask = '__.___.___/____-__'
  return String(value ? formatString(filter, mask, '_', String(value)) : mask)
}

export function formatAsCPF(value?: string | number) {
  const filter = /^-?\d*$/
  const mask = '___.___.___-__'
  return String(value ? formatString(filter, mask, '_', String(value)) : mask)
}

export function formatAsPhone(value?: string | number) {
  const filter = /^-?\d*$/
  const mask = '(__) _____-____'
  return String(value ? formatString(filter, mask, '_', String(value)) : mask)
}
export function formatAsName(value?: string | undefined | null) {
  if (!value) {
    return ''
  }
  const valueArray = value.split(' ')
  value = ''
  for (let chunk of valueArray) {
    chunk = chunk?.toLowerCase()
    chunk = String(!articles.includes(chunk) && chunk ? capitalizeFirstLeter(chunk) : chunk ?? '')
    value += value ? ` ${chunk ?? ''}` : `${chunk ?? ''}`
  }
  return String(value)
}

export function capitalizeFirstLeter(value?: string | undefined) {
  if (!value) {
    return ''
  }
  const length = value?.length ?? 0
  return String(
    length > 1 ? `${value[0].toUpperCase()}${value.slice(1, length)}` : length > 0 ? `${value?.toUpperCase()}` : value
  )
}
