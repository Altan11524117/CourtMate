// Matches: models/user.go → User struct JSON output.
// GET /users/:id/profile returns the full User for self; a reduced object for others (no email).

class UserModel {
  const UserModel({
    required this.id,
    required this.fullName,
    required this.email,
    required this.isActive,
    this.level,
    this.preferredHand,
    this.bio,
    this.createdAt,
    this.updatedAt,
  });

  final String id;
  final String fullName;
  /// Empty when viewing another user (API omits email for privacy).
  final String email;
  final bool isActive;
  final String? level; // null = no exam taken yet
  final String? preferredHand;
  final String? bio;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id:            _uuidString(json['id']),
        fullName:      _stringField(json['fullName'], fallback: 'Unknown'),
        email:         _nullableString(json['email']) ?? '',
        isActive:      _boolField(json['isActive'], defaultValue: true),
        level:         _nullableString(json['level']),
        preferredHand: _nullableString(json['preferredHand']),
        bio:           _nullableString(json['bio']),
        createdAt:     _parseDateTime(json['createdAt']),
        updatedAt:     _parseDateTime(json['updatedAt']),
      );

  UserModel copyWith({
    String? fullName,
    String? level,
    String? preferredHand,
    String? bio,
  }) =>
      UserModel(
        id:            id,
        fullName:      fullName ?? this.fullName,
        email:         email,
        isActive:      isActive,
        level:         level ?? this.level,
        preferredHand: preferredHand ?? this.preferredHand,
        bio:           bio ?? this.bio,
        createdAt:     createdAt,
        updatedAt:     updatedAt,
      );

  /// Whether the user has completed the placement exam.
  bool get hasLevel => level != null && level!.isNotEmpty;

  static String _uuidString(dynamic v) {
    if (v is String) return v;
    if (v == null) {
      throw const FormatException('Missing user id in profile JSON');
    }
    return v.toString();
  }

  static String _stringField(dynamic v, {required String fallback}) {
    if (v is String && v.isNotEmpty) return v;
    if (v == null) return fallback;
    final s = v.toString();
    return s.isEmpty ? fallback : s;
  }

  static String? _nullableString(dynamic v) {
    if (v == null) return null;
    if (v is String) return v.isEmpty ? null : v;
    final s = v.toString();
    return s.isEmpty ? null : s;
  }

  static bool _boolField(dynamic v, {required bool defaultValue}) {
    if (v is bool) return v;
    return defaultValue;
  }

  static DateTime? _parseDateTime(dynamic v) {
    if (v == null) return null;
    if (v is String) return DateTime.tryParse(v);
    return null;
  }
}
