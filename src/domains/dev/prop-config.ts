export enum PropType {
  number = 'number',
  string = 'string',
  boolean = 'boolean',
  object = 'object',
}

export enum DisplayMode {
  flat = 'flat',
  nest = 'nest',
}

export interface PropConfig {
  type: PropType
  component: string
  placeholder: string
  tip: string
  alias: string
  hidden: boolean
  displayMode: DisplayMode
  showCol: string
  defaultValue: any
}

export const createPropConfig = () => {

}
