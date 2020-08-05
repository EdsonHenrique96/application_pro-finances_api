/**
 *
 * Postgress returns a numeric type with a string, to get around this we use
 * a transformer, which will parse the data
 */

export default class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }

  from(data: string): number {
    return parseFloat(data);
  }
}
