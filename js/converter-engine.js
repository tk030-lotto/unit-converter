/**
 * 単位変換ツール - 変換エンジン (converter-engine.js)
 * 線形換算、温度換算、燃費換算、および高精度フォーマット処理
 */

/**
 * 線形換算の実行
 * @param {number} value - 入力数値
 * @param {number} fromFactor - 基準単位への変換係数 (1 単位 = fromFactor 基準単位)
 * @param {number} toFactor - 基準単位への変換係数 (1 単位 = toFactor 基準単位)
 * @returns {number} 換算結果
 */
export function convertLinear(value, fromFactor, toFactor) {
  if (typeof value !== 'number' || isNaN(value)) return NaN;
  if (toFactor === 0) return NaN;
  // 基準単位に換算してから変換先単位に除算
  const baseValue = value * fromFactor;
  return baseValue / toFactor;
}

/**
 * 温度の換算 (摂氏 C, 華氏 F, ケルビン K)
 * @param {number} value - 入力温度
 * @param {string} fromUnit - 'C' | 'F' | 'K'
 * @param {string} toUnit - 'C' | 'F' | 'K'
 * @returns {number} 換算結果
 */
export function convertTemperature(value, fromUnit, toUnit) {
  if (typeof value !== 'number' || isNaN(value)) return NaN;
  if (fromUnit === toUnit) return value;

  // 1. 摂氏 (℃) に一旦正規化
  let celsius = 0;
  switch (fromUnit) {
    case 'C':
      celsius = value;
      break;
    case 'F':
      celsius = (value - 32) * 5 / 9;
      break;
    case 'K':
      celsius = value - 273.15;
      break;
    default:
      return NaN;
  }

  // 2. 摂氏から目標単位に変換
  switch (toUnit) {
    case 'C':
      return celsius;
    case 'F':
      return celsius * 9 / 5 + 32;
    case 'K':
      return celsius + 273.15;
    default:
      return NaN;
  }
}

/**
 * 燃費の換算 (km/L, L/100km, mpg_us)
 * @param {number} value - 入力燃費値
 * @param {string} fromUnit - 'kmL' | 'L100km' | 'mpg_us'
 * @param {string} toUnit - 'kmL' | 'L100km' | 'mpg_us'
 * @returns {number} 換算結果
 */
export function convertFuel(value, fromUnit, toUnit) {
  if (typeof value !== 'number' || isNaN(value) || value <= 0) return NaN;
  if (fromUnit === toUnit) return value;

  // 1. km/L に正規化
  let kmL = 0;
  switch (fromUnit) {
    case 'kmL':
      kmL = value;
      break;
    case 'L100km':
      kmL = 100 / value;
      break;
    case 'mpg_us':
      // 1 mpg (US) ≈ 1.609344 km / 3.785411784 L ≈ 0.425143707 km/L
      kmL = value * (1.609344 / 3.785411784);
      break;
    default:
      return NaN;
  }

  // 2. km/L から目標単位に変換
  switch (toUnit) {
    case 'kmL':
      return kmL;
    case 'L100km':
      return 100 / kmL;
    case 'mpg_us':
      return kmL / (1.609344 / 3.785411784);
    default:
      return NaN;
  }
}

export const DEFAULT_PRECISION = 8;
export const SWAP_INPUT_PRECISION = 12;

const DECIMAL_INPUT_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/;

/**
 * 入力文字列を厳密な十進数値として検証・パースする
 * @param {string} raw - 入力値文字列
 * @returns {{ status: 'ok' | 'empty' | 'invalid', value: number, message: string }}
 */
export function parseDecimalInput(raw) {
  if (typeof raw !== 'string') {
    return { status: 'invalid', value: NaN, message: '半角の数字を入力してください。' };
  }
  const normalized = raw.trim().replace(/,/g, '');
  if (normalized === '') {
    return { status: 'empty', value: NaN, message: '' };
  }
  if (!DECIMAL_INPUT_PATTERN.test(normalized)) {
    return {
      status: 'invalid',
      value: NaN,
      message: '半角の数字で入力してください（例: 100, -12.5）。全角数字や文字は変換できません。'
    };
  }
  const value = Number(normalized);
  if (!Number.isFinite(value)) {
    return {
      status: 'invalid',
      value: NaN,
      message: '入力値が大きすぎるため計算できません。桁数を減らして入力してください。'
    };
  }
  return { status: 'ok', value, message: '' };
}

/**
 * スワップ時に入力欄へ戻す数値を浮動小数点末尾誤差を除いて文字列化する
 * @param {number} num - 変換結果の数値
 * @returns {string}
 */
export function formatRawForInput(num) {
  if (typeof num !== 'number' || !Number.isFinite(num)) return '';
  if (num === 0) return '0';
  return Number(num.toPrecision(SWAP_INPUT_PRECISION)).toString();
}

/**
 * 数値のクリーンなフォーマット表示
 * - 浮動小数点誤差の抑制
 * - 不要な末尾ゼロの除去
 * - 桁区切り (カンマ) の付加
 * - 極端に大きな数・小さな数は指数表記
 * @param {number} num - 表示する数値
 * @param {number} precision - 最大有効桁数 (デフォルト: DEFAULT_PRECISION)
 * @returns {string} フォーマット済み文字列
 */
export function formatNumber(num, precision = DEFAULT_PRECISION) {
  if (typeof num !== 'number' || isNaN(num)) return '';
  if (!isFinite(num)) {
    return 'オーバーフロー (値が大きすぎます)';
  }
  if (num === 0) return '0';

  const abs = Math.abs(num);

  // 極小・極大値の場合は指数表記
  if ((abs < 1e-6 && abs > 0) || abs >= 1e12) {
    return num.toExponential(4);
  }

  // 精度に応じて丸める (浮動小数点誤差 0.0000000000000002 などの除去)
  const rounded = parseFloat(num.toPrecision(precision));
  
  // 整数部と小数部に分割してカンマ区切りを適用
  const parts = rounded.toString().split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
}
