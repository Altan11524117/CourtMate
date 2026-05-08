import 'package:flutter/material.dart';

class AdDetailScreen extends StatelessWidget {
  const AdDetailScreen({super.key, required this.adId});
  final String adId;

  @override
  Widget build(BuildContext context) => Scaffold(
        body: Center(child: Text('Ad Detail: $adId — TODO')),
      );
}
