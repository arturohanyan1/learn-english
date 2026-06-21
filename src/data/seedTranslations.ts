/**
 * Translation/definition seed from the design's sample data. Our Oxford 5000
 * dataset has no ru/hy/def fields, so we enrich any matching word with these.
 * Keyed by lowercased English word.
 */
export interface Seed {
  ru: string
  hy: string
  def: string
}

export const SEED_TRANSLATIONS: Record<string, Seed> = {
  hello: { ru: 'Привет', hy: 'Բարև', def: 'A greeting used when meeting someone.' },
  water: { ru: 'Вода', hy: 'Ջուր', def: 'The clear liquid that we drink.' },
  friend: { ru: 'Друг', hy: 'Ընկեր', def: 'A person you know well and like.' },
  happy: { ru: 'Счастливый', hy: 'Ուրախ', def: 'Feeling or showing pleasure.' },
  house: { ru: 'Дом', hy: 'Տուն', def: 'A building where people live.' },
  eat: { ru: 'Есть', hy: 'Ուտել', def: 'To put food in your mouth and swallow it.' },
  bright: { ru: 'Яркий', hy: 'Պայծառ', def: 'Giving out or filled with much light.' },
  travel: { ru: 'Путешествовать', hy: 'Ճանապարհորդել', def: 'To go from one place to another.' },
  weather: { ru: 'Погода', hy: 'Եղանակ', def: 'The state of the air, like rain or sun.' },
  gentle: { ru: 'Нежный', hy: 'Մեղմ', def: 'Mild and kind in manner.' },
  market: { ru: 'Рынок', hy: 'Շուկա', def: 'A place where people buy and sell.' },
  calm: { ru: 'Спокойный', hy: 'Հանգիստ', def: 'Peaceful; free from nervousness.' },
  brave: { ru: 'Храбрый', hy: 'Քաջ', def: 'Ready to face danger; courageous.' },
  journey: { ru: 'Путешествие', hy: 'Ճանապարհորդություն', def: 'An act of travelling from one place to another.' },
  curious: { ru: 'Любопытный', hy: 'Հետաքրքրասեր', def: 'Eager to know or learn something.' },
  dream: { ru: 'Мечта', hy: 'Երազանք', def: 'A cherished hope or ambition.' },
  grateful: { ru: 'Благодарный', hy: 'Երախտապարտ', def: 'Feeling or showing thanks.' },
  wander: { ru: 'Бродить', hy: 'Թափառել', def: 'To walk around with no fixed purpose.' },
  whisper: { ru: 'Шептать', hy: 'Շշնջալ', def: 'To speak very softly and quietly.' },
  glow: { ru: 'Сияние', hy: 'Փայլ', def: 'A steady, warm light.' },
  reluctant: { ru: 'Неохотный', hy: 'Դժկամ', def: 'Unwilling and hesitant.' },
  vivid: { ru: 'Живой', hy: 'Վառ', def: 'Producing strong, clear images in the mind.' },
  resilient: { ru: 'Стойкий', hy: 'Դիմացկուն', def: 'Able to recover quickly from difficulty.' },
  glimpse: { ru: 'Проблеск', hy: 'Հպանցիկ հայացք', def: 'A brief or partial view.' },
  eloquent: { ru: 'Красноречивый', hy: 'Պերճախոս', def: 'Fluent and persuasive in speech.' },
  profound: { ru: 'Глубокий', hy: 'Խորը', def: 'Very great or intense; deep.' },
  meticulous: { ru: 'Дотошный', hy: 'Բծախնդիր', def: 'Showing great attention to detail.' },
  nuance: { ru: 'Нюанс', hy: 'Նրբերանգ', def: 'A subtle difference in meaning.' },
  inevitable: { ru: 'Неизбежный', hy: 'Անխուսափելի', def: 'Certain to happen; unavoidable.' },
  candid: { ru: 'Откровенный', hy: 'Անկեղծ', def: 'Truthful and straightforward; frank.' },
  ephemeral: { ru: 'Эфемерный', hy: 'Անցողիկ', def: 'Lasting for a very short time.' },
  ubiquitous: { ru: 'Вездесущий', hy: 'Ամենուր տարածված', def: 'Present or found everywhere.' },
  quintessential: { ru: 'Типичный', hy: 'Տիպական', def: 'Representing the most perfect example.' },
  surreptitious: { ru: 'Тайный', hy: 'Գաղտնի', def: 'Done secretly to avoid notice.' },
  perfunctory: { ru: 'Поверхностный', hy: 'Մակերեսային', def: 'Done with little effort or care.' },
  sagacious: { ru: 'Проницательный', hy: 'Իմաստուն', def: 'Having keen judgment; wise.' },
}
