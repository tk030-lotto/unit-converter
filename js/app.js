/**
 * 単位変換ツール - アプリケーション統合制御 (app.js)
 * UIイベント制御、リアルタイム計算、スワップ、コピー、ショートカット
 */

import { CATEGORIES, POPULAR_SHORTCUTS } from './units-data.js';
import {
  convertLinear,
  convertTemperature,
  convertFuel,
  formatNumber,
  parseDecimalInput,
  formatRawForInput
} from './converter-engine.js';

// DOM要素の参照キャッシュ
const elements = {
  categorySelect: document.getElementById('categorySelect'),
  subgroupContainer: document.getElementById('subgroupContainer'),
  fromValue: document.getElementById('fromValue'),
  fromUnit: document.getElementById('fromUnit'),
  resultValue: document.getElementById('resultValue'),
  toUnit: document.getElementById('toUnit'),
  inputError: document.getElementById('inputError'),
  btnSwap: document.getElementById('btnSwap'),
  btnClear: document.getElementById('btnClear'),
  btnCopy: document.getElementById('btnCopy'),
  manualCopyPanel: document.getElementById('manualCopyPanel'),
  manualCopyInput: document.getElementById('manualCopyInput'),
  notePanel: document.getElementById('notePanel'),
  noteText: document.getElementById('noteText'),
  shortcutsContainer: document.getElementById('shortcutsContainer'),
  toast: document.getElementById('toast'),
  toastIcon: document.getElementById('toastIcon'),
  toastMessage: document.getElementById('toastMessage')
};

// アプリケーション状態
const state = {
  currentCategoryKey: 'length',
  currentSubgroupKey: null,
  rawResult: NaN
};

let toastTimerId = null;
let lastToastMessage = '';

/**
 * 初期化処理
 */
function init() {
  renderCategoryOptions();
  renderShortcuts();
  setupEventListeners();
  selectCategory('length');
}

/**
 * カテゴリセレクトボックスの初期化描画
 */
function renderCategoryOptions() {
  elements.categorySelect.innerHTML = Object.entries(CATEGORIES)
    .map(([key, cat]) => `<option value="${key}">${cat.icon} ${cat.name}</option>`)
    .join('');
}

/**
 * よく使う変換ショートカットの描画
 */
function renderShortcuts() {
  elements.shortcutsContainer.innerHTML = POPULAR_SHORTCUTS.map(s => {
    return `<button class="shortcut-chip" type="button" data-cat="${s.category}" data-from="${s.from}" data-to="${s.to}" data-val="${s.defaultVal}">${s.label}</button>`;
  }).join('');
}

/**
 * カテゴリ選択とUIの更新
 */
function selectCategory(catKey, subKey = null, fromUnitVal = null, toUnitVal = null) {
  state.currentCategoryKey = catKey;
  elements.categorySelect.value = catKey;
  const cat = CATEGORIES[catKey];

  // サブグループ（電気、日本の慣用単位など）の処理
  if (cat.isGrouped) {
    elements.subgroupContainer.hidden = false;
    state.currentSubgroupKey = subKey || cat.defaultGroup;
    renderSubgroupTabs(cat);
  } else {
    elements.subgroupContainer.hidden = true;
    state.currentSubgroupKey = null;
  }

  // 単位選択肢の描画
  renderUnitOptions(fromUnitVal, toUnitVal);

  // 注記パネルの更新
  updateNotePanel(cat);

  // 計算実行
  calculate();
}

/**
 * サブグループタブの描画
 */
function renderSubgroupTabs(cat) {
  elements.subgroupContainer.innerHTML = Object.entries(cat.groups).map(([gKey, gVal]) => {
    const isActive = gKey === state.currentSubgroupKey;
    return `<button class="subgroup-tab ${isActive ? 'active' : ''}" type="button" role="tab" aria-selected="${isActive}" data-group="${gKey}">${gVal.name}</button>`;
  }).join('');
}

/**
 * 単位ドロップダウンの描画
 */
function renderUnitOptions(preferredFrom = null, preferredTo = null) {
  const cat = CATEGORIES[state.currentCategoryKey];
  const group = cat.isGrouped ? cat.groups[state.currentSubgroupKey] : null;
  const units = group ? group.units : cat.units;

  const optionsHtml = units.map(u => `<option value="${u.id}">${u.name}</option>`).join('');
  elements.fromUnit.innerHTML = optionsHtml;
  elements.toUnit.innerHTML = optionsHtml;

  // デフォルトまたは指定された単位の適用
  const defaultFrom = preferredFrom || (group?.defaultFrom ?? cat.defaultFrom);
  const defaultTo = preferredTo || (group?.defaultTo ?? cat.defaultTo);

  if (units.some(u => u.id === defaultFrom)) elements.fromUnit.value = defaultFrom;
  if (units.some(u => u.id === defaultTo)) elements.toUnit.value = defaultTo;
}

/**
 * 定義注記パネルの更新
 */
function updateNotePanel(cat) {
  if (cat.note) {
    elements.noteText.textContent = cat.note;
    elements.notePanel.hidden = false;
  } else {
    elements.notePanel.hidden = true;
  }
}

/**
 * 入力エラー表示の更新（R1・R7）
 */
function setInputError(message = '') {
  if (message) {
    elements.inputError.textContent = message;
    elements.inputError.hidden = false;
    elements.fromValue.classList.add('is-invalid');
    elements.fromValue.setAttribute('aria-invalid', 'true');
  } else {
    elements.inputError.textContent = '';
    elements.inputError.hidden = true;
    elements.fromValue.classList.remove('is-invalid');
    elements.fromValue.removeAttribute('aria-invalid');
  }
}

/**
 * 変換計算の実行
 */
function calculate() {
  hideManualCopy();
  const parsed = parseDecimalInput(elements.fromValue.value);
  if (parsed.status === 'empty') {
    setInputError('');
    elements.resultValue.textContent = '—';
    state.rawResult = NaN;
    return;
  }
  if (parsed.status === 'invalid') {
    setInputError(parsed.message);
    elements.resultValue.textContent = '—';
    state.rawResult = NaN;
    return;
  }

  const value = parsed.value;
  const cat = CATEGORIES[state.currentCategoryKey];
  const fromId = elements.fromUnit.value;
  const toId = elements.toUnit.value;
  let result = 0;

  if (cat.isSpecial && cat.id === 'temperature') {
    result = convertTemperature(value, fromId, toId);
  } else if (cat.isSpecial && cat.id === 'fuel') {
    if (value <= 0) {
      setInputError('燃費の換算には 0 より大きい半角の数値を入力してください。');
      elements.resultValue.textContent = '—';
      state.rawResult = NaN;
      return;
    }
    result = convertFuel(value, fromId, toId);
  } else {
    // 線形換算
    const units = cat.isGrouped ? cat.groups[state.currentSubgroupKey].units : cat.units;
    const fromUnitObj = units.find(u => u.id === fromId);
    const toUnitObj = units.find(u => u.id === toId);

    if (fromUnitObj && toUnitObj) {
      result = convertLinear(value, fromUnitObj.factor, toUnitObj.factor);
    } else {
      result = NaN;
    }
  }

  if (!Number.isFinite(result)) {
    setInputError('計算結果が数値の上限を超えたため表示できません。入力値を小さくしてください。');
    state.rawResult = result;
    elements.resultValue.textContent = formatNumber(result);
    return;
  }

  setInputError('');
  state.rawResult = result;
  elements.resultValue.textContent = formatNumber(result);
}

/**
 * スワップ（⇅）処理
 */
function swapUnits() {
  const currentFrom = elements.fromUnit.value;
  const currentTo = elements.toUnit.value;

  elements.fromUnit.value = currentTo;
  elements.toUnit.value = currentFrom;

  // 計算後の有効な結果のみ入力欄に移す（不正入力・未入力時は元の入力を保持）
  if (Number.isFinite(state.rawResult)) {
    elements.fromValue.value = formatRawForInput(state.rawResult);
  }

  calculate();
}

/**
 * 手動コピー欄の表示と全選択（仕様 §8）
 */
function showManualCopy(text) {
  elements.manualCopyInput.value = text;
  elements.manualCopyPanel.hidden = false;
  elements.manualCopyInput.focus();
  elements.manualCopyInput.select();
  elements.manualCopyInput.setSelectionRange(0, text.length);
}

/**
 * 手動コピー欄の非表示
 */
function hideManualCopy() {
  if (elements.manualCopyPanel.hidden) return;
  elements.manualCopyPanel.hidden = true;
  elements.manualCopyInput.value = '';
}

/**
 * クリップボードへのコピー
 */
async function copyResult() {
  if (!Number.isFinite(state.rawResult)) {
    showToast('コピーできる変換結果がありません', true);
    return;
  }
  const resultText = elements.resultValue.textContent.trim();
  if (!resultText) {
    showToast('コピーできる変換結果がありません', true);
    return;
  }

  try {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
      throw new Error('Clipboard API unavailable');
    }
    await navigator.clipboard.writeText(resultText);
    hideManualCopy();
    showToast('コピーしました');
  } catch {
    showManualCopy(resultText);
    showToast('自動コピーに失敗しました。下の欄から手動でコピーしてください', true);
  }
}

/**
 * トースト表示
 */
function showToast(message = 'コピーしました', isError = false) {
  clearTimeout(toastTimerId);

  // 同一文言の連続時にもスクリーンリーダーで再通知されるよう末尾へ空白を付与
  const announcedMessage = message === lastToastMessage ? `${message}\u00A0` : message;
  lastToastMessage = message;

  elements.toastIcon.textContent = isError ? '!' : '✓';
  elements.toastMessage.textContent = announcedMessage;
  elements.toast.classList.toggle('toast-error', isError);
  elements.toast.classList.add('show');
  elements.btnCopy.classList.toggle('btn-copy-active', !isError);
  elements.btnCopy.classList.toggle('btn-copy-error', isError);

  toastTimerId = setTimeout(() => {
    elements.toast.classList.remove('show', 'toast-error');
    elements.btnCopy.classList.remove('btn-copy-active', 'btn-copy-error');
  }, isError ? 3500 : 1800);
}

/**
 * イベントリスナー設定
 */
function setupEventListeners() {
  // カテゴリ切り替え
  elements.categorySelect.addEventListener('change', (e) => {
    selectCategory(e.target.value);
  });

  // サブグループ切り替え
  elements.subgroupContainer.addEventListener('click', (e) => {
    const tab = e.target.closest('.subgroup-tab');
    if (!tab) return;
    const gKey = tab.dataset.group;
    state.currentSubgroupKey = gKey;
    renderSubgroupTabs(CATEGORIES[state.currentCategoryKey]);
    renderUnitOptions();
    calculate();
  });

  // 数値入力
  elements.fromValue.addEventListener('input', calculate);

  // 単位切り替え
  elements.fromUnit.addEventListener('change', calculate);
  elements.toUnit.addEventListener('change', calculate);

  // スワップ
  elements.btnSwap.addEventListener('click', swapUnits);

  // クリア
  elements.btnClear.addEventListener('click', () => {
    elements.fromValue.value = '';
    elements.fromValue.focus();
    calculate();
  });

  // コピー
  elements.btnCopy.addEventListener('click', copyResult);
  elements.resultValue.addEventListener('click', copyResult);
  elements.manualCopyInput.addEventListener('click', () => {
    elements.manualCopyInput.select();
    elements.manualCopyInput.setSelectionRange(0, elements.manualCopyInput.value.length);
  });

  // ショートカットチップ
  elements.shortcutsContainer.addEventListener('click', (e) => {
    const chip = e.target.closest('.shortcut-chip');
    if (!chip) return;
    const { cat, from, to, val } = chip.dataset;
    elements.fromValue.value = val;
    selectCategory(cat, null, from, to);
  });
}

// 起動
document.addEventListener('DOMContentLoaded', init);
