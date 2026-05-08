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

  factory AdModel.fromJson(Map<String, dynamic> json) => AdModel(
        id:            json['id'] as String,
        ownerId:       json['ownerId'] as String,
        title:         json['title'] as String,
        location:      json['location'] as String,
        matchDate:     DateTime.parse(json['matchDate'] as String),
        status:        json['status'] as String? ?? 'open',
        viewCount:     json['viewCount'] as int? ?? 0,
        createdAt:     DateTime.parse(json['createdAt'] as String),
        category:      json['category'] as String?,
        requiredLevel: json['requiredLevel'] as String?,
        ownerSummary:  json['ownerProfileSummary'] != null
            ? OwnerSummary.fromJson(
                json['ownerProfileSummary'] as Map<String, dynamic>)
            : null,
      );

  bool get isOpen => status == 'open';
}

class OwnerSummary {
  const OwnerSummary({required this.fullName, this.level});

  final String fullName;
  final String? level;

  factory OwnerSummary.fromJson(Map<String, dynamic> json) => OwnerSummary(
        fullName: json['fullName'] as String,
        level:    json['level'] as String?,
      );
}
