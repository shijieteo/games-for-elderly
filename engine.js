/* The game rules are independent of the page so they can be checked with Node. */
(function (root) {
  'use strict';

  const themes = {
    food: {
      title: 'Local favourites', caption: 'FOOD & DRINKS',
      items: [
        ['kopi', '☕', 'Kopi', '咖啡'], ['laksa', '🍜', 'Laksa', '叻沙'],
        ['fried-rice', '🍛', 'Fried Rice', '炒饭'], ['satay', '🍢', 'Satay', '沙爹'],
        ['teh-tarik', '🫖', 'Teh Tarik', '拉茶'], ['chilli-crab', '🦀', 'Chilli Crab', '辣椒螃蟹'],
        ['roti-prata', '🫓', 'Roti Prata', '印度煎饼'], ['pineapple-tarts', '🥮', 'Pineapple Tarts', '黄梨挞'],
        ['ice-kachang', '🍧', 'Ice Kachang', '红豆冰'], ['curry-puff', '🥟', 'Curry Puff', '咖喱角'],
        ['kueh', '🍰', 'Kueh Lapis', '九层糕'], ['kaya-toast', '🍞', 'Kaya Toast', '咖椰吐司']
      ]
    },
    places: {
      title: 'Around the island', caption: 'SINGAPORE LANDMARKS',
      items: [
        ['merlion', '🦁', 'Merlion', '鱼尾狮'], ['lau-pa-sat', '🍽️', 'Lau Pa Sat', '老巴刹'],
        ['esplanade', '🎭', 'Esplanade', '滨海艺术中心'], ['national-museum', '🏛️', 'National Museum', '国家博物馆'],
        ['botanic-gardens', '🌳', 'Botanic Gardens', '植物园'], ['sultan-mosque', '🕌', 'Sultan Mosque', '苏丹回教堂'],
        ['buddha-tooth-temple', '🛕', 'Buddha Tooth Relic Temple', '佛牙寺'], ['sentosa', '🏝️', 'Sentosa', '圣淘沙'],
        ['marina-bay-sands', '🏙️', 'Marina Bay Sands', '滨海湾金沙'], ['changi-airport', '✈️', 'Changi Airport', '樟宜机场'],
        ['chinatown', '🏮', 'Chinatown', '牛车水'], ['gardens-by-the-bay', '🌺', 'Gardens by the Bay', '滨海湾花园']
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
