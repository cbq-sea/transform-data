export default class TransformData {
  constructor(rows: any[], config: object, chartConfig?: object)

  getXAxis(
    rows: any[],
    config: object,
    chartConfig?: object
  ): { type: string; name: string; [property: string]: any }

  getYAxis(rows: any[], config: object, chartConfig?: object): object

  getDoubleYAxis(rows: any[], config: object, chartConfig?: object): any[] | object

  getSeries(rows: any[], config: object): any[]

  getXiazuanFromform(rows: any[], config: object): any[]

  getTable(rows: any[], config: object): Array<{ columns: object[]; list: object[] }>

  getList(rows: any[], config: object): object[]

  getProgress(rows: any[], config: object): object

  getStaticImg(rows: any[], config: object): { src: string; [property: string]: any }

  getCustomData(rows: any[], config: object): any[] | object

  getOption(rows: any[], config: object, chartConfig?: object): any[] | object

  getOptionXuchang(rows: Object, config: object, chartConfig?: object): any[] | object

  formatXcData(x: any[], y: any[], values: any[]): object

  formatXcData2(x: any[], values: any[]): object

  formatXCTreeData(rows: object[]): object[]

  getOptionCube(rows: any[], config: object): any[] | object
}
