type Duration = {
  years?: number
  months?: number
  days?: number
  hours?: number
  minutes?: number
  seconds?: number
  milliseconds?: number
}

export function add(date: Date, duration: Duration): Date {
  const result = new Date(date)

  if (duration.years) {
    result.setFullYear(result.getFullYear() + duration.years)
  }
  if (duration.months) {
    result.setMonth(result.getMonth() + duration.months)
  }
  if (duration.days) {
    result.setDate(result.getDate() + duration.days)
  }
  if (duration.hours) {
    result.setHours(result.getHours() + duration.hours)
  }
  if (duration.minutes) {
    result.setMinutes(result.getMinutes() + duration.minutes)
  }
  if (duration.seconds) {
    result.setSeconds(result.getSeconds() + duration.seconds)
  }
  if (duration.milliseconds) {
    result.setMilliseconds(result.getMilliseconds() + duration.milliseconds)
  }

  return result
}

export function minutesFromNow(minutes: number = 45): Date {
  const now = new Date()

  return add(now, { minutes })
}
