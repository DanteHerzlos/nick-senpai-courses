export interface IColorMap {
  [key: string]: {color: string}
}

export interface IBkgdColorMap {
  [key: string]: {backgroundColor: string}
}

export const colorMap: IColorMap = {
  '#f3901d': { color: '#f3901d' },
  '#ed5c57': { color: '#ed5c57' },
  '#00b050': { color: '#00b050' },
  '#52a7f9': { color: '#52a7f9' },
  '#b36ae2': { color: '#b36ae2' },
  '#fefd32': { color: '#fefd32' },

  '#de6a19': { color: '#de6a19' },
  '#c82613': { color: '#c82613' },
  '#0d882a': { color: '#0d882a' },
  '#0c64c0': { color: '#0c64c0' },
  '#763e9b': { color: '#763e9b' },
  '#ffd966': { color: '#ffd966' },

  '#be5b17': { color: '#be5b17' },
  '#861106': { color: '#861106' },
  '#0e5c1b': { color: '#0e5c1b' },
  '#174f86': { color: '#174f86' },
  '#5e317c': { color: '#5e317c' },
  '#f1c232': { color: '#f1c232' },

  '#005ff9': { color: '#005ff9' },
  '#333333': { color: '#333333' },
  '#747070': { color: '#747070' },
  '#d9d9d9': { color: '#d9d9d9' },
  '#f2f2f2': { color: '#f2f2f2' },
  '#ffffff': { color: '#ffffff' },
}

export const bkgdColorMap: IBkgdColorMap= {
  'bkgdtransparent': { backgroundColor: 'transparent' },
  'bkgd#00ff00': { backgroundColor: '#00ff00' },
  'bkgd#00ffff': { backgroundColor: '#00ffff' },
  'bkgd#ff00ff': { backgroundColor: '#ff00ff' },
  'bkgd#005ff9': { backgroundColor: '#005ff9' },
  'bkgd#ff0000': { backgroundColor: '#ff0000' },

  'bkgd#ffff00': { backgroundColor: '#ffff00' },
  'bkgd#000080': { backgroundColor: '#000080' },
  'bkgd#008080': { backgroundColor: '#008080' },
  'bkgd#008000': { backgroundColor: '#008000' },
  'bkgd#800080': { backgroundColor: '#800080' },
  'bkgd#800000': { backgroundColor: '#800000' },

  'bkgd#ff9e00': { backgroundColor: '#ff9e00' },
  'bkgd#8dff00': { backgroundColor: '#8dff00' },
  'bkgd#000000': { backgroundColor: '#000000' },
  'bkgd#808080': { backgroundColor: '#808080' },
  'bkgd#d9d9d9': { backgroundColor: '#d9d9d9' },
  'bkgd#f2f2f2': { backgroundColor: '#f2f2f2' },
}
