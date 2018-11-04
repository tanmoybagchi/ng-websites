/** Resource that represents a spreadsheet. */
export class GoogleSpreadsheet {
  /** The ID of the spreadsheet. This field is read-only. */
  spreadsheetId = '';
  /** Overall properties of a spreadsheet. */
  properties: GoogleSpreadsheet.SpreadsheetProperties;
  /** The sheets that are part of a spreadsheet. */
  sheets: GoogleSpreadsheet.Sheet[];
  /** The url of the spreadsheet. This field is read-only. */
  spreadsheetUrl: string;

  static Create(title: string) {
    const sheet = new GoogleSpreadsheet();

    sheet.properties = GoogleSpreadsheet.SpreadsheetProperties.Create(title);

    return sheet;
  }
}

export namespace GoogleSpreadsheet {
  /** Properties of a spreadsheet. */
  export class SpreadsheetProperties {
    /** The title of the spreadsheet. */
    title = '';
    /**
     * The locale of the spreadsheet in one of the following formats:
     * * an ISO 639-1 language code such as en
     * * an ISO 639-2 language code such as fil, if no 639-1 code exists
     * * a combination of the ISO language code and country code, such as en_US
     *
     * NOTE: when updating this field, not all locales/languages are supported.
     */
    locale = '';
    /** The time zone of the spreadsheet, in CLDR format such as **America/New_York**.
     * If the time zone isn't recognized, this may be a custom time zone such as **GMT-07:00**. */
    timeZone = '';

    static Create(title: string) {
      const properties = new SpreadsheetProperties();

      properties.title = title;

      return properties;
    }
  }

  /** A sheet in a spreadsheet. */
  export class Sheet {
    /** The properties of the sheet. */
    properties: SheetProperties;
    /** Data in the grid, if this is a grid sheet.
     * The number of GridData objects returned is dependent on the number of ranges requested on this sheet.
     * For example, if this is representing Sheet1, and the spreadsheet was requested with ranges Sheet1!A1:C10
     * and Sheet1!D15:E20, then the first GridData will have a startRow/startColumn of 0, while the second one
     * will have startRow 14 (zero-based row 15), and startColumn 3 (zero-based column D).
     */
    data: GridData[];

    static Create(title: string, inp: GridData[]) {
      const sheet = new Sheet();

      sheet.properties = SheetProperties.Create(title);
      sheet.data = inp;

      return sheet;
    }
  }

  /** Properties of a sheet. */
  export class SheetProperties {
    /** The ID of the sheet. Must be non-negative. This field cannot be changed once set. */
    sheetId: number;
    /** The name of the sheet. */
    title: string;
    /** The index of the sheet within the spreadsheet.
     * When adding or updating sheet properties; if this field is excluded then the sheet is added or moved to the end of the sheet list.
     * When updating sheet indices or inserting sheets; movement is considered in before the move indexes.
     * For example; if there were 3 sheets (S1; S2; S3) in order to move S1 ahead of S2 the index would have to be set to 2.
     * A sheet index update request is ignored if the requested index is identical to the sheets current index
     * or if the requested new index is equal to the current sheet index + 1. */
    index: number;
    /** The type of sheet. Defaults to GRID. This field cannot be changed once set. */
    sheetType = SheetType.GRID;
    /** Additional properties of the sheet if this sheet is a grid.
     * (If the sheet is an object sheet; containing a chart or image; then this field will be absent.)
     * When writing it is an error to set any grid properties on non-grid sheets. */
    gridProperties: GridProperties;
    hidden = false;
    /** True if the sheet is an RTL sheet instead of an LTR sheet. */
    rightToLeft = false;

    static Create(title: string) {
      const sheetProperties = new SheetProperties();

      sheetProperties.title = title;

      return sheetProperties;
    }
  }

  /** The kind of sheet. */
  export enum SheetType {
    /** Default value; do not use. */
    SHEET_TYPE_UNSPECIFIED,
    /** The sheet is a grid. */
    GRID,
    /** The sheet has no grid and instead has an object like a chart or image. */
    OBJECT
  }

  /** Properties of a grid. */
  export class GridProperties {
    /** The number of rows in the grid. */
    rowCount = 0;
    /** The number of columns in the grid. */
    columnCount = 0;
    /** The number of rows that are frozen in the grid. */
    frozenRowCount = 0;
    /** The number of columns that are frozen in the grid. */
    frozenColumnCount = 0;
    /** True if the grid isn't showing gridlines in the UI. */
    hideGridlines = false;
    /** True if the row grouping control toggle is shown after the group. */
    rowGroupControlAfter = false;
    /** True if the column grouping control toggle is shown after the group. */
    columnGroupControlAfter = false;
  }

  /** Data in the grid; as well as metadata about the dimensions. */
  export class GridData {
    /** The first row this GridData refers to; zero-based. */
    startRow = 0;
    /** The first column this GridData refers to; zero-based. */
    startColumn = 0;
    rowData: RowData[];

    static Create(inp: RowData[]) {
      const grid = new GridData();
      grid.rowData = inp;
      return grid;
    }
  }

  /** Data about each cell in a row. */
  export class RowData {
    /** The values in the row, one per column. */
    values: CellData[];

    static Create(inp: CellData[]) {
      const row = new RowData();
      row.values = inp;
      return row;
    }
  }

  /** Data about a specific cell. */
  export class CellData {
    /** The value the user entered in the cell. e.g, 1234, 'Hello', or =NOW() */
    userEnteredValue: ExtendedValue;
    /** The effective value of the cell. For cells with formulas, this is the calculated value.
     * For cells with literals, this is the same as the userEnteredValue. This field is read-only. */
    effectiveValue: ExtendedValue;
    /** The formatted value of the cell. This is the value as it's shown to the user. This field is read-only. */
    formattedValue = '';
    /** The format the user entered for the cell.
     *  When writing, the new format will be merged with the existing format. */
    userEnteredFormat: CellFormat;
    /** Any note on the cell. */
    note = '';

    static Create(inp: any) {
      const cell = new CellData();

      cell.userEnteredValue = ExtendedValue.Create(inp);

      if (inp instanceof Date) {
        cell.userEnteredFormat = new CellFormat();
        cell.userEnteredFormat.numberFormat = new NumberFormat();
        cell.userEnteredFormat.numberFormat.type = NumberFormatType.DATE_TIME;
      }

      return cell;
    }
  }

  /** The kinds of value that a cell in a spreadsheet can have. Union field value can be only one of the following. */
  export class ExtendedValue {
    /** Represents a double value. Note: Dates, Times and DateTimes are represented as doubles in "serial number" format.
     *
     * SERIAL_NUMBER: Instructs date, time, datetime, and duration fields to be output as doubles in "serial number" format,
     * as popularized by Lotus 1-2-3.The whole number portion of the value (left of the decimal) counts the days since
     * December 30th 1899. The fractional portion (right of the decimal) counts the time as a fraction of the day. For example,
     * January 1st 1900 at noon would be 2.5, 2 because it's 2 days after December 30st 1899, and .5 because noon is half a day.
     * February 1st 1900 at 3pm would be 33.625. This correctly treats the year 1900 as not a leap year.
    */
    numberValue: number;
    /** Represents a string value. Leading single quotes are not included.
     * For example, if the user typed '123 into the UI, this would be represented as a stringValue of "123". */
    stringValue: string;
    /** Represents a boolean value. */
    boolValue: boolean;
    /** Represents a formula. */
    formulaValue: string;
    /** Represents an error. This field is read-only. */
    errorValue: ErrorValue;

    static Create(inp: any) {
      const ev = new ExtendedValue();

      switch (typeof inp) {
        case 'string':
          ev.stringValue = inp;
          break;

        case 'boolean':
          ev.boolValue = inp;
          break;

        case 'number':
          ev.numberValue = inp;
          break;

        case 'object':
          if (inp instanceof Date) {
            // ev.formulaValue = `=Date(${inp.getFullYear()}, ${inp.getMonth() + 1}, ${inp.getDate()})`;
            ev.formulaValue = `=DATEVALUE("${inp.toLocaleDateString()}") + TIMEVALUE("${inp.toLocaleTimeString()}")`;
            // ev.stringValue = `${inp.toLocaleString().replace(',', '')}`;
          } else {
            ev.stringValue = JSON.stringify(inp);
          }
          break;
      }

      return ev;
    }
  }

  /** An error in a cell. */
  export class ErrorValue {
    /** The type of error. */
    type = ErrorType.ERROR_TYPE_UNSPECIFIED;
    /** A message with more information about the error (in the spreadsheet's locale). */
    message = '';
  }

  /** The type of error. */
  export enum ErrorType {
    /** The default error type, do not use this. */
    ERROR_TYPE_UNSPECIFIED,
    /** Corresponds to the #ERROR! error. */
    ERROR,
    /** Corresponds to the #NULL! error. */
    NULL_VALUE,
    /** Corresponds to the #DIV/0 error. */
    DIVIDE_BY_ZERO,
    /** Corresponds to the #VALUE! error. */
    VALUE,
    /** Corresponds to the #REF! error. */
    REF,
    /** Corresponds to the #NAME? error. */
    NAME,
    /** Corresponds to the #NUM! error. */
    NUM,
    /** Corresponds to the #N/A error. */
    N_A,
    /** Corresponds to the Loading... state. */
    LOADING
  }

  /** The format of a cell. */
  export class CellFormat {
    /** A format describing how number values should be represented to the user. */
    numberFormat: NumberFormat;

    static Create(format: NumberFormatType) {
      const result = new CellFormat();

      result.numberFormat = new NumberFormat();
      result.numberFormat.type = format;

      return result;
    }
  }

  /** The number format of a cell. */
  export class NumberFormat {
    /** The type of the number format. When writing, this field must be set. */
    type: NumberFormatType;
    /** Pattern string used for formatting.
     * If not set, a default pattern based on the user's locale will be used if necessary for the given type.
     * See the [Date and Number Formats guide](https://developers.google.com/sheets/api/guides/formats)
     * for more information about the supported patterns. */
    pattern: string;
  }

  /** The number format of the cell.
   * In this documentation the locale is assumed to be en_US, but the actual format depends on the locale of the spreadsheet. */
  export enum NumberFormatType {
    /** The number format is not specified and is based on the contents of the cell. Do not explicitly use this. */
    NUMBER_FORMAT_TYPE_UNSPECIFIED,
    /** Text formatting, e.g 1000.12 */
    TEXT,
    /** Number formatting, e.g, 1,000.12 */
    NUMBER,
    /** Percent formatting, e.g 10.12% */
    PERCENT,
    /** Currency formatting, e.g $1,000.12 */
    CURRENCY,
    /** Date formatting, e.g 9/26/2008 */
    DATE,
    /** Time formatting, e.g 3:59:00 PM */
    TIME,
    /** Date+Time formatting, e.g 9/26/08 15:59:00 */
    DATE_TIME,
    /** Scientific number formatting, e.g 1.01E+03 */
    SCIENTIFIC
  }

  /** A single kind of update to apply to a spreadsheet.
   * Union field kind can be only one of the following: */
  export class BatchUpdateRequest {
    appendCells: AppendCellsRequest;
    updateCells: UpdateCellsRequest;

    static Create(request: AppendCellsRequest | UpdateCellsRequest) {
      const result = new BatchUpdateRequest();

      if (request instanceof AppendCellsRequest) {
        result.appendCells = request;
      }

      if (request instanceof UpdateCellsRequest) {
        result.updateCells = request;
      }

      return result;
    }
  }

  export class AppendCellsRequest {
    /** The sheet ID to append the data to. */
    sheetId: number;
    /** The data to append. */
    rows: RowData[];
    /** The fields of CellData that should be updated.
     * At least one field must be specified. The root is the CellData; 'row.values.' should not be specified.
     * A single "*" can be used as short-hand for listing every field. */
    fields: string;

    static Create(sheetId: number, rows: RowData[]) {
      const result = new AppendCellsRequest();

      result.sheetId = sheetId;
      result.rows = rows;
      result.fields = '*';

      return result;
    }
  }

  /** Updates all cells in a range with new data. */
  export class UpdateCellsRequest {
    rows: RowData[];
    /** The fields of CellData that should be updated. At least one field must be specified.
     * The root is the CellData; 'row.values.' should not be specified.
     * A single "*" can be used as short-hand for listing every field. */
    fields: string;
    /** The range to write data to.
     * If the data in rows does not cover the entire requested range, the fields matching those set in fields will be cleared. */
    range: GridRange;

    static Create(rows: RowData[]) {
      const result = new UpdateCellsRequest();

      result.rows = rows;
      result.fields = '*';

      return result;
    }
  }

  /** A range on a sheet. All indexes are zero-based.
   * Indexes are half open, e.g the start index is inclusive and the end index is exclusive -- [startIndex, endIndex).
   * Missing indexes indicate the range is unbounded on that side.*/
  export class GridRange {
    /** The sheet this range is on. */
    sheetId: number;
    /** The start row (inclusive) of the range, or not set if unbounded. */
    startRowIndex: number;
    /** The end row (exclusive) of the range, or not set if unbounded. */
    endRowIndex: number;
    /** The start column (inclusive) of the range, or not set if unbounded. */
    startColumnIndex: number;
    /** The end column (exclusive) of the range, or not set if unbounded. */
    endColumnIndex: number;

    static Create(sheetId: number) {
      const result = new GridRange();

      result.sheetId = sheetId;

      return result;
    }
  }
}
