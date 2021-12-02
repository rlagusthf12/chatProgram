import * as df from 'date-fns'


/**
 * String을 Date로 변환. 
 * 입력 포멧은 'yyyy-mm-dd' 또는 'yyyyMMdd'
 */
function parse(dateString: string | null) : Date | null {
  if (dateString === null || dateString === undefined || dateString.length === 0)
    return null
  const fs = dateString.length === 8 ? 'yyyyMMdd' : 'yyyy-MM-dd'
  return df.parse(dateString, fs, date())
}

/**
 * Date를 화면 표시용 'yyyy-MM-dd'로 포멧팅
 * @param d 
 * @param f 
 */
function format(d: Date | null | undefined, f: string = 'yyyy-MM-dd') {
  if (!d) {
    return null
  } else if ( typeof d === 'string') {
    return d
  } else {
    return df.format(d, f)
  }
}

/**
 * 시분초가 0인 일자를 Date type으로 생성한다.
 * 
 * @param day 생성할 일자 optional
 * @param month 생성할 월(1 ~ 12) optional
 * @param year 생성할 년도 optional
 */
function date(day?: number, month?: number, year?: number) {
  const now = new Date()
  now.setHours(0)
  now.setMinutes(0)
  now.setSeconds(0)

  if (day !== undefined) {
    now.setDate(day)
  }

  if (month !== undefined) {
    now.setMonth(month - 1)
  }
  if (year !== undefined) {
    now.setFullYear(year)
  }

  return now
}

/**
 * 일자를 string type의 yyyy-MM-dd 형식 문자열로 생성한다.
 * @param day 생성할 일자 optional
 * @param month 생성할 월(1 ~ 12) optional
 * @param year 생성할 년도 optional
 */
function dateString(day?: number, month?: number, year?: number) : string | null {
  // return formatAsValue(getDate(day, month, year))
  return format(date(day, month, year))
}
/**
 * 년도를 string type의 yyyy 형식 문자열로 생성한다.
 * @param year 생성할 년도 optional
 */
function year(year?: number) : string | null {
  return format(date(undefined, undefined, year), 'yyyy')
}

/**
 * 년도-월을 string type의 yyyyMM 형식 문자열로 생성한다.
 * @param month 생성할 월(1 ~ 12) optional
 * @param year 생성할 년도 optional
 */
function yearMonth(month?: number, year?: number) : string | null {
  return format(date(undefined, month, year), 'yyyyMM')
}

function addDate(d: Date | null, days: string | number = 0) {
  if ( !d ) return d
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + (typeof days === "string" ? parseInt(days) : days))
}

function addDateString(d: string | null, days: string | number = 0) {
  if ( !d ) return d
  let dateStrArr = []
  if (d.length === 8) {
    dateStrArr[0] = d.substr(0, 4)
    dateStrArr[1] = d.substr(0, 4)
    dateStrArr[2] = d.substr(0, 4)
  } else {
    dateStrArr = d.split('-')
  }
  return format(new Date(parseInt(dateStrArr[0]), parseInt(dateStrArr[1]), parseInt(dateStrArr[2]) + (typeof days === "string" ? parseInt(days) : days)))
}

/**
 * 월의 마지막 일자를 Date 객체로 생성한다.
 */
function lastDate(d?: number | Date) {
  return df.lastDayOfMonth(d || date())
}

/**
 * 월의 마지막 일자를 string type의 yyyy-MM-dd 형식 문자열로 생성한다.
 */
function lastDateString(d?: number | Date) {
  return format(df.lastDayOfMonth(d || date()))
}

export const dateUtil = {
  format,
  parse,
  date,
  dateString,
  year,
  yearMonth,
  addDate,
  addDateString,
  lastDate,
  lastDateString
}