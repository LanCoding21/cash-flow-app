export const rupiahFormat = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    style: 'currency',
  }).format(num);
};

export const numberFormat = (num: number) => {
  return new Intl.NumberFormat().format(num);
};

export const parseLocaleNumber = (
  strNumber: string,
  locale: string = 'id-ID',
) => {
  if (!strNumber) {
    return 0;
  }
  const thousandSeparator = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
  })
    .formatToParts(1111)
    .filter((part) => part.type === 'group')[0].value;
  const decimalSeparator = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
  })
    .formatToParts(1.1)
    .filter((part) => part.type === 'decimal')[0].value;

  return parseFloat(
    strNumber
      .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
      .replace(new RegExp('\\' + decimalSeparator), '.'),
  );
};
