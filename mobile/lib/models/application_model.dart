// Matches: controllers/application.go → ListApplications response shape

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
  final String status;        // "pending" | "approved" | "rejected"
  final DateTime createdAt;
  final String? applicantName;
  final String? applicantLevel;

  factory ApplicationModel.fromJson(Map<String, dynamic> json) =>
      ApplicationModel(
        id:             json['id'] as String,
        adId:           json['adId'] as String,
        applicantId:    json['applicantId'] as String,
        status:         json['status'] as String,
        createdAt:      DateTime.parse(json['createdAt'] as String),
        applicantName:  json['applicantName'] as String?,
        applicantLevel: json['applicantLevel'] as String?,
      );

  bool get isPending  => status == 'pending';
  bool get isApproved => status == 'approved';
  bool get isRejected => status == 'rejected';
}
