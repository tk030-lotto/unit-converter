/**
 * 単位定義データ - 一般単位 (general-units.js)
 * 長さ、面積、重さ、体積、温度、速度、時間、データ容量
 */

export const GENERAL_CATEGORIES = {
  length: {
    id: 'length',
    name: '長さ',
    icon: '📏',
    baseUnit: 'm',
    units: [
      { id: 'mm', name: 'ミリメートル (mm)', factor: 0.001 },
      { id: 'cm', name: 'センチメートル (cm)', factor: 0.01 },
      { id: 'm', name: 'メートル (m)', factor: 1.0 },
      { id: 'km', name: 'キロメートル (km)', factor: 1000.0 },
      { id: 'in', name: 'インチ (in)', factor: 0.0254 },
      { id: 'ft', name: 'フィート (ft)', factor: 0.3048 },
      { id: 'yd', name: 'ヤード (yd)', factor: 0.9144 },
      { id: 'mi', name: 'マイル (mi)', factor: 1609.344 },
      { id: 'nmi', name: '海里 (nmi)', factor: 1852.0 }
    ],
    defaultFrom: 'm',
    defaultTo: 'cm'
  },
  area: {
    id: 'area',
    name: '面積',
    icon: '⬛',
    baseUnit: 'm2',
    note: '畳は江戸間 (1.5488 m²)、坪は 400/121 m²（約3.305785 m²）を採用。',
    units: [
      { id: 'mm2', name: '平方ミリメートル (mm²)', factor: 0.000001 },
      { id: 'cm2', name: '平方センチメートル (cm²)', factor: 0.0001 },
      { id: 'm2', name: '平方メートル (m²)', factor: 1.0 },
      { id: 'km2', name: '平方キロメートル (km²)', factor: 1000000.0 },
      { id: 'tsubo', name: '坪 (ツボ)', factor: 400 / 121 },
      { id: 'tatami', name: '畳 (江戸間)', factor: 1.5488 },
      { id: 'a', name: 'アール (a)', factor: 100.0 },
      { id: 'ha', name: 'ヘクタール (ha)', factor: 10000.0 },
      { id: 'acre', name: 'エーカー (acre)', factor: 4046.8564224 }
    ],
    defaultFrom: 'm2',
    defaultTo: 'tsubo'
  },
  mass: {
    id: 'mass',
    name: '重さ・質量',
    icon: '⚖️',
    baseUnit: 'kg',
    units: [
      { id: 'mg', name: 'ミリグラム (mg)', factor: 0.000001 },
      { id: 'g', name: 'グラム (g)', factor: 0.001 },
      { id: 'kg', name: 'キログラム (kg)', factor: 1.0 },
      { id: 't', name: 'トン (t)', factor: 1000.0 },
      { id: 'oz', name: 'オンス (oz)', factor: 0.028349523125 },
      { id: 'lb', name: 'ポンド (lb)', factor: 0.45359237 }
    ],
    defaultFrom: 'kg',
    defaultTo: 'lb'
  },
  volume: {
    id: 'volume',
    name: '体積',
    icon: '🧪',
    baseUnit: 'L',
    note: 'fl oz / pint / quart / gallon は米国液量 (US fluid) 定義を採用。',
    units: [
      { id: 'mL', name: 'ミリリットル (mL / cc)', factor: 0.001 },
      { id: 'L', name: 'リットル (L)', factor: 1.0 },
      { id: 'cm3', name: '立方センチメートル (cm³)', factor: 0.001 },
      { id: 'm3', name: '立方メートル (m³)', factor: 1000.0 },
      { id: 'floz_us', name: '液量オンス (fl oz, 米国)', factor: 0.0295735295625 },
      { id: 'pt_us', name: 'パイント (pt, 米国液量)', factor: 0.473176473 },
      { id: 'qt_us', name: 'クォート (qt, 米国液量)', factor: 0.946352946 },
      { id: 'gal_us', name: 'ガロン (gal, 米国液量)', factor: 3.785411784 }
    ],
    defaultFrom: 'L',
    defaultTo: 'gal_us'
  },
  temperature: {
    id: 'temperature',
    name: '温度',
    icon: '🌡️',
    isSpecial: true,
    units: [
      { id: 'C', name: '摂氏 (℃)' },
      { id: 'F', name: '華氏 (℉)' },
      { id: 'K', name: 'ケルビン (K)' }
    ],
    defaultFrom: 'C',
    defaultTo: 'F'
  },
  speed: {
    id: 'speed',
    name: '速度',
    icon: '🚀',
    baseUnit: 'mps',
    units: [
      { id: 'mps', name: 'メートル毎秒 (m/s)', factor: 1.0 },
      { id: 'kmh', name: 'キロメートル毎時 (km/h)', factor: 1 / 3.6 },
      { id: 'mph', name: 'マイル毎時 (mph)', factor: 0.44704 },
      { id: 'knot', name: 'ノット (kt / kn)', factor: 1852 / 3600 }
    ],
    defaultFrom: 'kmh',
    defaultTo: 'mph'
  },
  time: {
    id: 'time',
    name: '時間',
    icon: '⏱️',
    baseUnit: 's',
    note: '1月=30日、1年=365日（固定換算）として計算します。',
    units: [
      { id: 'ms', name: 'ミリ秒 (ms)', factor: 0.001 },
      { id: 's', name: '秒 (s)', factor: 1.0 },
      { id: 'min', name: '分 (min)', factor: 60.0 },
      { id: 'h', name: '時間 (h)', factor: 3600.0 },
      { id: 'd', name: '日 (day)', factor: 86400.0 },
      { id: 'wk', name: '週 (week)', factor: 604800.0 },
      { id: 'mo', name: '月 (month / 30日)', factor: 2592000.0 },
      { id: 'yr', name: '年 (year / 365日)', factor: 31536000.0 }
    ],
    defaultFrom: 'h',
    defaultTo: 'min'
  },
  data: {
    id: 'data',
    name: 'データ容量',
    icon: '💾',
    baseUnit: 'B',
    note: '十進接頭辞（1 KB = 1000 Byte）を採用しています。',
    units: [
      { id: 'b', name: 'ビット (bit)', factor: 0.125 },
      { id: 'B', name: 'バイト (Byte)', factor: 1.0 },
      { id: 'KB', name: 'キロバイト (KB)', factor: 1e3 },
      { id: 'MB', name: 'メガバイト (MB)', factor: 1e6 },
      { id: 'GB', name: 'ギガバイト (GB)', factor: 1e9 },
      { id: 'TB', name: 'テラバイト (TB)', factor: 1e12 },
      { id: 'PB', name: 'ペタバイト (PB)', factor: 1e15 }
    ],
    defaultFrom: 'GB',
    defaultTo: 'MB'
  }
};
