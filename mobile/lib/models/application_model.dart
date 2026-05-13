// Matches: controllers/application.go → application list / patch responses

class ApplicationModel {
  const ApplicationModel({
    required this.id,
    required this.adId,
    required this.applicantId,
    required this.status,
    required this.createdAt,
    this.applicantName,
    this.applicantLevel,
  });

  final String id;
  final String adId;
  final String applicantId;
  final String status; // "pending" | "approved" | "rejected"
  final DateTime createdAt;
  final String? applicantName;
  final String? applicantLevel;

  factory ApplicationModel.fromJson(
    Map<String, dynamic> json, {
    String? fallbackAdId,
  }) {
    final adIdSource = json['adId'] ?? fallbackAdId;
    final created = _parseDateTime(json['createdAt']) ??
        DateTime.fromMillisecondsSinceEpoch(0, isUtc: true);
    return ApplicationModel(
      id:             _uuidString(json['id']),
      adId:           _uuidString(adIdSource),
      applicantId:    _uuidString(json['applicantId']),
      status:         _stringField(json['status'], fallback: 'pending'),
      createdAt:      created,
      applicantName:  _nullableString(json['applicantName']),
      applicantLevel: _nullableString(json['applicantLevel']),
    );
  }

  bool get isPending  => status == 'pending';
  bool get isApproved => status == 'approved';
  bool get isRejected => status == 'rejected';

  ApplicationModel copyWith({
    String? status,
    String? applicantName,
    String? applicantLevel,
  }) =>
      ApplicationModel(
        id:             id,
        adId:           adId,
        applicantId:    applicantId,
        status:         status ?? this.status,
        createdAt:      createdAt,
        applicantName:  applicantName ?? this.applicantName,
        applicantLevel: applicantLevel ?? this.applicantLevel,
      );

  static String _uuidString(dynamic v) {
    if (v is String) return v;
    if (v == null) {
      throw const FormatException('Missing id on application JSON');
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

  static DateTime? _parseDateTime(dynamic v) {
    if (v == null) return null;
    if (v is String) return DateTime.tryParse(v);
    return null;
  }
}
