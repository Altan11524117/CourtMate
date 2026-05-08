import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key, required this.userId});
  final String userId;

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(child: Text('Profile: $userId — TODO')),
      );
}
