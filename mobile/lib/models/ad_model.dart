// Matches: models/ad.go → Ad struct JSON output + controllers/ad.go responses

class AdModel {
  const AdModel({
    required this.id,
    required this.ownerId,
    required this.title,
    required this.location,
    required this.matchDate,
    required this.status,
    required this.viewCount,
    required this.createdAt,
    this.category,
    this.requiredLevel,
    this.ownerSummary,
  });

  final String id;
  final String ownerId;
  final String title;
  final String location;
  final DateTime matchDate;
  final String status;        // "open" | "closed"
  final int viewCount;
  final DateTime createdAt;
  final String? category;     // Singles | Doubles | Training | Tournament
  final String? requiredLevel;
  final OwnerSummary? ownerSummary; // Only present on GET /ads/:adId detail

  factory AdModel.fromJson(Map<String, dynamic> json) {
    final matchDate = _parseDateTime(json['matchDate']) ??
        DateTime.fromMillisecondsSinceEpoch(0, isUtc: true);
    return AdModel(
      id:            _uuidString(json['id']),
      ownerId:       _uuidString(json['ownerId']),
      title:         _stringField(json['title'], fallback: ''),
      location:      _stringField(json['location'], fallback: ''),
      matchDate:     matchDate,
      status:        _stringField(json['status'], fallback: 'open'),
      viewCount:     _intField(json['viewCount']),
      createdAt:     _parseDateTime(json['createdAt']) ??
          _parseDateTime(json['updatedAt']) ??
          matchDate,
      category:      _nullableString(json['category']),
      requiredLevel: _nullableString(json['requiredLevel']),
      ownerSummary: json['ownerProfileSummary'] != null
          ? OwnerSummary.fromJson(
              json['ownerProfileSummary'] as Map<String, dynamic>,
            )
          : null,
    );
  }

  bool get isOpen => status == 'open';

  /// Backend UUIDs are strings; tolerate other JSON encodings.
  static String _uuidString(dynamic v) {
    if (v is String) return v;
    if (v == null) {
      throw const FormatException('Missing id or ownerId on ad JSON');
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

  static int _intField(dynamic v) {
    if (v is int) return v;
    if (v is num) return v.round();
    return int.tryParse(v?.toString() ?? '') ?? 0;
  }

  /// GET /ads/:id historically omitted [createdAt]; list endpoints include it.
  static DateTime? _parseDateTime(dynamic v) {
    if (v == null) return null;
    if (v is String) return DateTime.tryParse(v);
    return null;
  }
}

class OwnerSummary {
  const OwnerSummary({required this.fullName, this.level});

  final String fullName;
  final String? level;

  factory OwnerSummary.fromJson(Map<String, dynamic> json) => OwnerSummary(
        fullName: AdModel._stringField(json['fullName'], fallback: 'Player'),
        level:    AdModel._nullableString(json['level']),
      );
}
