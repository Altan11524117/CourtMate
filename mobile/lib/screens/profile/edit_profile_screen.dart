import 'package:flutter/material.dart';

class EditProfileScreen extends StatelessWidget {
  const EditProfileScreen({super.key, required this.userId});
  final String userId;

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(child: Text('Edit Profile: $userId — TODO')),
      );
}
