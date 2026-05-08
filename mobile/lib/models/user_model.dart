// Matches: models/user.go → User struct JSON output

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
  final String email;
  final bool isActive;
  final String? level;        // null = no exam taken yet
  final String? preferredHand;
  final String? bio;
  final DateTime? createdAt;
  final DateTime? updatedAt;

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
        id:            json['id'] as String,
        fullName:      json['fullName'] as String,
        email:         json['email'] as String,
        isActive:      json['isActive'] as bool? ?? true,
        level:         json['level'] as String?,
        preferredHand: json['preferredHand'] as String?,
        bio:           json['bio'] as String?,
        createdAt:     json['createdAt'] != null
            ? DateTime.tryParse(json['createdAt'] as String)
            : null,
        updatedAt:     json['updatedAt'] != null
            ? DateTime.tryParse(json['updatedAt'] as String)
            : null,
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
}
