const db = require('../db/connection.js');
const { reviewData, commentData } = require('../db/data/test-data');
const {
  createLookupTable,
  formatComments,
  validateOrder,
  validateSortBy,
  validateCategory
} = require('../utils');

afterAll(() => db.end());

const testLookupTable = {
  Agricola: 1,
  Jenga: 2,
  'Ultimate Werewolf': 3,
  'Dolor reprehenderit': 4,
  'Proident tempor et.': 5,
  'Occaecat consequat officia in quis commodo.': 6,
  'Mollit elit qui incididunt veniam occaecat cupidatat': 7,
  'One Night Ultimate Werewolf': 8,
  'A truly Quacking Game; Quacks of Quedlinburg': 9,
  'Build you own tour de Yorkshire': 10,
  "That's just what an evil person would say!": 11,
  "Scythe; you're gonna need a bigger table!": 12,
  "Settlers of Catan: Don't Settle For Less": 13
};

describe('#createLookupTable', () => {
  it('creates a lookup table', () => {
    const formattedReviewData = reviewData.map((item, index) => {
      return {
        review_id: index + 1,
        ...item
      };
    });
    const lookupTable = createLookupTable(formattedReviewData, 'title', 'review_id');
    expect(lookupTable).toEqual(testLookupTable);
  });

  it('rejects if any arguments are missing', () => {
    createLookupTable().catch((err) => {
      expect(err.msg).toBe('Unable to create lookup table');
    });
  });
});

describe('#formatComments', () => {
  it('returns formatted comments', () => {
    const result = formatComments(commentData, testLookupTable);
    expect(result[0].author).toBe('bainesface');
    expect(result[0].review_id).toBe(2);
    expect(result[1].author).toBe('mallionaire');
    expect(result[1].review_id).toBe(3);
  });

  it('rejects if any arguments are missing', () => {
    formatComments().catch((err) => {
      expect(err.msg).toBe('Unable to format comments');
    });
  });
});

describe('#validateOrder', () => {
  it('validates a correct sort order', () => {
    expect(validateOrder('asc')).toBe('asc');
    expect(validateOrder('desc')).toBe('desc');
  });
  it('rejects an incorrect sort order', () => {
    validateOrder('banana').catch((err) => {
      expect(err.msg).toBe('Invalid order query');
    })
  })
});

describe('#validateSortBy', () => {
  it('validates a correct column to sort by', () => {
    const result = validateSortBy('title', ['review_id', 'votes', 'title', 'body']);
    expect(result).toBe('title');
  });

  it('rejects an incorrect column to sort by', () => {
    validateSortBy('banana', ['review_id', 'votes', 'title', 'body']).catch(err => {
      expect(err.msg).toBe('Invalid sort by query');
    });
  });
});

describe('#validateCategory', () => {
  it('validates a correct category', () => {
    validateCategory('dexterity').then(result => {
      expect(result).toBe('dexterity');
    });
  });
  it('rejects an incorrect category', () => {
    validateCategory('banana').catch((err) => {
      expect(err.msg).toBe('Category not found');
    })
  })
});
