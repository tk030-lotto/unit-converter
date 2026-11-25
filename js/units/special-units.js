/**
 * 単位定義データ - 特殊・物理単位 (special-units.js)
 * 圧力、エネルギー、仕事率、周波数、角度、電気、燃費、日本の慣用単位、ショートカット
 */

export const SPECIAL_CATEGORIES = {
  pressure: {
    id: 'pressure',
    name: '圧力',
    icon: '🧭',
    baseUnit: 'Pa',
    units: [
      { id: 'Pa', name: 'パスカル (Pa)', factor: 1.0 },
      { id: 'kPa', name: 'キロパスカル (kPa)', factor: 1000.0 },
      { id: 'MPa', name: 'メガパスカル (MPa)', factor: 1000000.0 },
      { id: 'bar', name: 'バール (bar)', factor: 100000.0 },
      { id: 'atm', name: '標準気圧 (atm)', factor: 101325.0 },
      { id: 'mmHg', name: '水銀柱ミリメートル (mmHg)', factor: 133.322387415 },
      { id: 'psi', name: '重量ポンド毎平方インチ (psi)', factor: 6894.757293168 }
    ],
    defaultFrom: 'kPa',
    defaultTo: 'bar'
  },
  energy: {
    id: 'energy',
    name: 'エネルギー',
    icon: '⚡',
    baseUnit: 'J',
    units: [
      { id: 'J', name: 'ジュール (J)', factor: 1.0 },
      { id: 'kJ', name: 'キロジュール (kJ)', factor: 1000.0 },
      { id: 'cal', name: 'カロリー (cal)', factor: 4.184 },
      { id: 'kcal', name: 'キロカロリー (kcal)', factor: 4184.0 },
      { id: 'Wh', name: 'ワット時 (Wh)', factor: 3600.0 },
      { id: 'kWh', name: 'キロワット時 (kWh)', factor: 3600000.0 }
    ],
    defaultFrom: 'kcal',
    defaultTo: 'kJ'
  },
  power: {
    id: 'power',
    name: '仕事率',
    icon: '💡',
    baseUnit: 'W',
    note: 'hpは英馬力（機械馬力: 1 hp = 745.699872 W）を採用。',
    units: [
      { id: 'W', name: 'ワット (W)', factor: 1.0 },
      { id: 'kW', name: 'キロワット (kW)', factor: 1000.0 },
      { id: 'MW', name: 'メガワット (MW)', factor: 1000000.0 },
      { id: 'hp', name: '馬力 (hp, 英馬力)', factor: 745.69987158227022 }
    ],
    defaultFrom: 'kW',
    defaultTo: 'hp'
  },
  frequency: {
    id: 'frequency',
    name: '周波数',
    icon: '📻',
    baseUnit: 'Hz',
    units: [
      { id: 'Hz', name: 'ヘルツ (Hz)', factor: 1.0 },
      { id: 'kHz', name: 'キロヘルツ (kHz)', factor: 1000.0 },
      { id: 'MHz', name: 'メガヘルツ (MHz)', factor: 1000000.0 },
      { id: 'GHz', name: 'ギガヘルツ (GHz)', factor: 1000000000.0 }
    ],
    defaultFrom: 'MHz',
    defaultTo: 'kHz'
  },
  angle: {
    id: 'angle',
    name: '角度',
    icon: '📐',
    baseUnit: 'deg',
    units: [
      { id: 'deg', name: '度 (°)', factor: 1.0 },
      { id: 'rad', name: 'ラジアン (rad)', factor: 180 / Math.PI },
      { id: 'grad', name: 'グラード (grad)', factor: 0.9 }
    ],
    defaultFrom: 'deg',
    defaultTo: 'rad'
  },
  electricity: {
    id: 'electricity',
    name: '電気',
    icon: '🔋',
    isGrouped: true,
    note: '電圧・電流・抵抗は異なる物理量のため同一グループ内でのみ相互変換可能です。',
    groups: {
      voltage: {
        name: '電圧',
        baseUnit: 'V',
        defaultFrom: 'V',
        defaultTo: 'mV',
        units: [
          { id: 'mV', name: 'ミリボルト (mV)', factor: 0.001 },
          { id: 'V', name: 'ボルト (V)', factor: 1.0 },
          { id: 'kV', name: 'キロボルト (kV)', factor: 1000.0 }
        ]
      },
      current: {
        name: '電流',
        baseUnit: 'A',
        defaultFrom: 'A',
        defaultTo: 'mA',
        units: [
          { id: 'mA', name: 'ミリアンペア (mA)', factor: 0.001 },
          { id: 'A', name: 'アンペア (A)', factor: 1.0 }
        ]
      },
      resistance: {
        name: '抵抗',
        baseUnit: 'ohm',
        defaultFrom: 'kohm',
        defaultTo: 'ohm',
        units: [
          { id: 'ohm', name: 'オーム (Ω)', factor: 1.0 },
          { id: 'kohm', name: 'キロオーム (kΩ)', factor: 1000.0 },
          { id: 'Mohm', name: 'メガオーム (MΩ)', factor: 1000000.0 }
        ]
      }
    },
    defaultGroup: 'voltage',
    defaultFrom: 'V',
    defaultTo: 'mV'
  },
  fuel: {
    id: 'fuel',
    name: '燃費',
    icon: '⛽',
    isSpecial: true,
    note: 'mpgは米ガロン基準（US mpg）を採用。L/100kmは逆数関係の変換となります。',
    units: [
      { id: 'kmL', name: 'キロメートル毎リットル (km/L)' },
      { id: 'L100km', name: 'リットル毎100キロ (L/100km)' },
      { id: 'mpg_us', name: 'マイル毎ガロン (mpg, US)' }
    ],
    defaultFrom: 'kmL',
    defaultTo: 'mpg_us'
  },
  japanese: {
    id: 'japanese',
    name: '日本の慣用単位',
    icon: '🏯',
    isGrouped: true,
    note: '尺貫法による法定換算率および畳（江戸間: 1.5488 m²）の定義を採用しています。',
    groups: {
      length: {
        name: '長さ（尺貫）',
        baseUnit: 'm_jp',
        defaultFrom: 'shaku',
        defaultTo: 'm_jp',
        units: [
          { id: 'shaku', name: '尺 (しゃく)', factor: 10 / 33 },
          { id: 'sun', name: '寸 (すん)', factor: 1 / 33 },
          { id: 'ken', name: '間 (けん)', factor: 60 / 33 },
          { id: 'cho_len', name: '町 (ちょう, 長さ)', factor: 3600 / 33 },
          { id: 'm_jp', name: 'メートル (m)', factor: 1.0 }
        ]
      },
      area: {
        name: '面積（尺貫）',
        baseUnit: 'm2_jp',
        defaultFrom: 'tsubo_jp',
        defaultTo: 'm2_jp',
        units: [
          { id: 'tsubo_jp', name: '坪 (歩)', factor: 400 / 121 },
          { id: 'tatami_jp', name: '畳 (江戸間)', factor: 1.5488 },
          { id: 'se', name: '畝 (せ)', factor: 12000 / 121 },
          { id: 'tan', name: '反 (たん)', factor: 120000 / 121 },
          { id: 'cho_area', name: '町 (町歩)', factor: 1200000 / 121 },
          { id: 'm2_jp', name: '平方メートル (m²)', factor: 1.0 }
        ]
      },
      volume: {
        name: '体積（枡貫）',
        baseUnit: 'L_jp',
        defaultFrom: 'sho',
        defaultTo: 'L_jp',
        units: [
          { id: 'shaku_vol', name: '勺 (しゃく)', factor: 2401 / 133100 },
          { id: 'go', name: '合 (ごう)', factor: 2401 / 13310 },
          { id: 'sho', name: '升 (しょう)', factor: 2401 / 1331 },
          { id: 'to', name: '斗 (と)', factor: 24010 / 1331 },
          { id: 'koku', name: '石 (こく)', factor: 240100 / 1331 },
          { id: 'L_jp', name: 'リットル (L)', factor: 1.0 }
        ]
      }
    },
    defaultGroup: 'length',
    defaultFrom: 'shaku',
    defaultTo: 'm_jp'
  }
};

export const POPULAR_SHORTCUTS = [
  { label: 'm² ⇄ 坪', category: 'area', from: 'm2', to: 'tsubo', defaultVal: 100 },
  { label: 'm² ⇄ 畳', category: 'area', from: 'm2', to: 'tatami', defaultVal: 20 },
  { label: 'km ⇄ mile', category: 'length', from: 'km', to: 'mi', defaultVal: 10 },
  { label: 'kg ⇄ lb', category: 'mass', from: 'kg', to: 'lb', defaultVal: 60 },
  { label: '℃ ⇄ ℉', category: 'temperature', from: 'C', to: 'F', defaultVal: 25 },
  { label: 'km/L ⇄ mpg', category: 'fuel', from: 'kmL', to: 'mpg_us', defaultVal: 15 }
];
