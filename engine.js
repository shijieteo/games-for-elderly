/* The game rules are independent of the page so they can be checked with Node. */
(function (root) {
  'use strict';

  const themes = {
    food: {
      title: 'Local favourites', caption: 'FOOD & DRINKS',
      items: [
        ['kopi', '☕', 'Kopi', '咖啡'], ['noodles', '🍜', 'Noodles', '面'],
        ['rice', '🍚', 'Rice', '米饭'], ['satay', '🍢', 'Satay', '沙爹'],
        ['tea', '🍵', 'Tea', '茶'], ['prawn', '🦐', 'Prawn', '虾'],
        ['fish', '🐟', 'Fish', '鱼'], ['pineapple', '🍍', 'Pineapple', '黄梨'],
        ['watermelon', '🍉', 'Watermelon', '西瓜'], ['banana', '🍌', 'Banana', '香蕉'],
        ['peanut', '🥜', 'Peanuts', '花生'], ['bread', '🍞', 'Bread', '面包']
      ]
    },
    places: {
      title: 'Around the island', caption: 'FAMILIAR PLACES',
      items: [
        ['home', '🏠', 'Home', '家'], ['hawker', '🍽️', 'Hawker centre', '小贩中心'],
        ['hospital', '🏥', 'Hospital', '医院'], ['school', '🏫', 'School', '学校'],
        ['park', '🌳', 'Park', '公园'], ['mosque', '🕌', 'Mosque', '清真寺'],
        ['temple', '🛕', 'Temple', '庙'], ['beach', '🏖️', 'Beach', '海滩'],
        ['mrt', '🚉', 'MRT station', '地铁站'], ['airport', '✈️', 'Airport', '机场'],
        ['market', '🛒', 'Market', '巴刹'], ['garden', '🌷', 'Garden', '花园']
      ]
    },
    everyday: {
      title: 'Everyday treasures', caption: 'THINGS WE KNOW',
      items: [
        ['umbrella', '☂️', 'Umbrella', '雨伞'], ['basket', '🧺', 'Basket', '篮子'],
        ['slippers', '🩴', 'Slippers', '拖鞋'], ['glasses', '👓', 'Glasses', '眼镜'],
        ['key', '🔑', 'Key', '钥匙'], ['clock', '⏰', 'Clock', '时钟'],
        ['phone', '☎️', 'Telephone', '电话'], ['bicycle', '🚲', 'Bicycle', '脚踏车'],
        ['bus', '🚌', 'Bus', '巴士'], ['radio', '📻', 'Radio', '收音机'],
        ['newspaper', '📰', 'Newspaper', '报纸'], ['teapot', '🫖', 'Teapot', '茶壶']
      ]
    }
  };

  function shuffle(items, random = Math.random) {
    const result = items.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  function createGame(theme, size, random = Math.random) {
    if (!Object.hasOwn(themes, theme) || ![8, 12, 16, 24].includes(size)) {
      throw new Error('Choose a valid theme and tile count.');
    }
    const selected = shuffle(themes[theme].items, random).slice(0, size / 2);
    const cards = shuffle(selected.flatMap(item => [0, 1].map(copy => ({
      id: `${item[0]}-${copy}`, key: item[0], emoji: item[1], name: item[2], local: item[3], matched: false
    }))), random);
    return { theme, cards, selected: [], turns: 0, pairs: 0, locked: false, complete: false };
  }

  function selectCard(game, index) {
    const card = game.cards[index];
    if (!card || game.locked || game.complete || card.matched || game.selected.includes(index)) return 'ignored';
    game.selected.push(index);
    if (game.selected.length === 1) return 'first';
    game.turns++;
    const [first, second] = game.selected.map(i => game.cards[i]);
    if (first.key === second.key) {
      first.matched = second.matched = true;
      game.pairs++;
      game.selected = [];
      game.complete = game.pairs === game.cards.length / 2;
      return game.complete ? 'complete' : 'match';
    }
    game.locked = true;
    return 'mismatch';
  }

  function resolveMismatch(game) {
    if (!game.locked) return;
    game.selected = [];
    game.locked = false;
  }

  const api = { themes, shuffle, createGame, selectCard, resolveMismatch };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.KakiGame = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
