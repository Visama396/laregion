import en from '../locale/en.json'
import es from '../locale/es.json'
import de from '../locale/de.json'
import ja from '../locale/ja.json'
import ko from '../locale/ko.json'
import uk from '../locale/uk.json'


type TranslationKey = keyof typeof en

export const translate = (key: TranslationKey, locale: string) => {
  if (locale === 'en') {
    return en[key]
  } else if (locale === 'es') {
    return es[key]
  } else if (locale === 'de') {
    return de[key]
  } else if (locale === 'ja') {
    return ja[key]
  } else if (locale === 'ko') {
    return ko[key]
  } else if (locale === 'uk') {
    return uk[key]
  }
}
