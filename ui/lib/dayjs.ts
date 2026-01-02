import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import relativeTime from 'dayjs/plugin/relativeTime'
import timezone from 'dayjs/plugin/timezone'

dayjs.extend(relativeTime)
dayjs.extend(timezone)
dayjs.extend(relativeTime)

dayjs.locale('pt-br')
dayjs.tz.setDefault('America/Sao_Paulo')

export { dayjs }
