/// Single source of truth for all magic strings and app-wide constants.
/// Never reference raw strings for keys or endpoints outside this file.
abstract final class AppConstants {
  // ── API ───────────────────────────────────────────────────────
  /// Switch between local and production via env config — never hardcode prod URL.
  static const apiBaseUrl = 'http://10.0.2.2:8000/v1'; // Android emulator localhost
  static const apiBaseUrlIos = 'http://localhost:8000/v1';
  static const apiTimeout = Duration(seconds: 15);
  static const apiConnectTimeout = Duration(seconds: 10);

  // ── Secure Storage Keys ───────────────────────────────────────
  static const keyAuthToken = 'auth_token';
  static const keyUserId    = 'user_id';

  // ── Pagination ────────────────────────────────────────────────
  static const defaultPageLimit  = 10;
  static const defaultPageOffset = 0;

  // ── Exam ──────────────────────────────────────────────────────
  static const examQuestionCount = 5;

  // ── Ad categories (must match backend enum) ───────────────────
  static const adCategories = ['Singles', 'Doubles', 'Training', 'Tournament'];

  // ── Sort options ──────────────────────────────────────────────
  static const sortOptions = {
    'newest':     'Newest First',
    'oldest':     'Oldest First',
    'level_asc':  'Level ↑',
    'level_desc': 'Level ↓',
  };

  // ── ITN Level display map ─────────────────────────────────────
  static const levelLabels = {
    'Beginner (ITN 10)':           'Beginner',
    'Intermediate (ITN 7)':        'Intermediate',
    'Upper-Intermediate (ITN 5)':  'Upper-Inter',
    'Advanced (ITN 3)':            'Advanced',
  };

  // ── Date format ───────────────────────────────────────────────
  static const matchDateFormat = 'dd MMM yyyy · HH:mm';
  static const memberSinceFormat = 'MMMM yyyy';
}
