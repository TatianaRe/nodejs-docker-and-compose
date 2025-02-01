export const PostgresErrorCode = {
  CaseNotFound: '20000',
  UniqueViolation: '23505', //  нарушения уникальности
  NotNullViolation: '23502', //  нарушения ограничения NOT NULL
  ForeignKeyViolation: '23503', // нарушения внешнего ключа
  UndefinedParameter: '42P02', // неизвестный параметр
};
export const PostgresErrorCode2 = {
  '20000': {
    error_name: 'CaseNotFound',
    error_text: 'Данные не найдены: ',
  },
  '23505': {
    error_name: 'UniqueViolation',
    error_text: 'Ошибка уникальности: ',
  },
  '23502': {
    error_name: 'NotNullViolation',
    error_text: 'Ошибка ограничения NOT NULL: ',
  },
  '23503': {
    error_name: 'ForeignKeyViolation',
    error_text: 'Ошибка внешнего ключа: ',
  },
  '42P02': {
    error_name: 'UndefinedParameter',
    error_text: 'неизвестный параметр: ',
  },
  '-1': {
    error_name: 'Default',
    error_text: 'Ошибка: ',
  },
};
