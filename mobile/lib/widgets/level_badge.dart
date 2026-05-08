import 'package:flutter/material.dart';
import '../core/theme.dart';
import '../core/constants.dart';

class LevelBadge extends StatelessWidget {
  const LevelBadge({super.key, required this.level, this.small = false});
  final String? level;
  final bool small;

  Color get _color {
    if (level == null || level!.isEmpty) return AppColors.textMuted;
    if (level!.contains('Advanced'))    return AppColors.levelAdvanced;
    if (level!.contains('Upper'))       return AppColors.levelUpperInter;
    if (level!.contains('Intermediate')) return AppColors.levelIntermediate;
    return AppColors.levelBeginner;
  }

  String get _label {
    if (level == null || level!.isEmpty) return 'No level';
    return AppConstants.levelLabels[level] ?? level!;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: small ? 8 : 10,
        vertical:   small ? 3 : 5,
      ),
      decoration: BoxDecoration(
        color: _color.withOpacity(0.12),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _color.withOpacity(0.4)),
      ),
      child: Text(
        _label,
        style: (small ? AppTypography.bodySmall : AppTypography.labelSmall)
            .copyWith(color: _color, fontWeight: FontWeight.w600),
      ),
    );
  }
}
