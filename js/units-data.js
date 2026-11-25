/**
 * 単位変換ツール - 単位定義エントリポイント (units-data.js)
 * general-units.js および special-units.js を統合して再エクスポート
 */

import { GENERAL_CATEGORIES } from './units/general-units.js';
import { SPECIAL_CATEGORIES, POPULAR_SHORTCUTS } from './units/special-units.js';

export const CATEGORIES = {
  ...GENERAL_CATEGORIES,
  ...SPECIAL_CATEGORIES
};

export { POPULAR_SHORTCUTS };
