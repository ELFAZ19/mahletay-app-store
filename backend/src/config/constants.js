/**
 * Application Constants
 */

module.exports = {
  ROLES: {
    ADMIN: 'admin',
    MODERATOR: 'moderator'
  },
  
  FEEDBACK_TYPES: {
    BUG: 'bug',
    SUGGESTION: 'suggestion',
    BLESSING: 'blessing'
  },
  
  FEEDBACK_STATUS: {
    PENDING: 'pending',
    REVIEWED: 'reviewed',
    RESOLVED: 'resolved'
  },
  
  RATING: {
    MIN: 1,
    MAX: 5
  },
  
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100
  }
};
