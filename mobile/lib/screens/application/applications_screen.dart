import 'package:flutter/material.dart';

class ApplicationsScreen extends StatelessWidget {
  const ApplicationsScreen({super.key, required this.adId});
  final String adId;

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(child: Text('Applications for $adId — TODO')),
      );
}
