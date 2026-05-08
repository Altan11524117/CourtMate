import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../core/theme.dart';
import '../core/constants.dart';
import '../models/ad_model.dart';
import 'level_badge.dart';

class AdCard extends StatelessWidget {
  const AdCard({
    super.key,
    required this.ad,
    required this.onTap,
  });

  final AdModel ad;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final dateStr = DateFormat(AppConstants.matchDateFormat).format(ad.matchDate.toLocal());

    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 12),
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.surfaceBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // ── Header row ──────────────────────────────────
            Row(
              children: [
                if (ad.category != null) ...[
                  _CategoryTag(ad.category!),
                  const SizedBox(width: 8),
                ],
                if (ad.requiredLevel != null)
                  LevelBadge(level: ad.requiredLevel, small: true),
                const Spacer(),
                Icon(
                  Icons.remove_red_eye_outlined,
                  size: 12,
                  color: AppColors.textMuted,
                ),
                const SizedBox(width: 4),
                Text('${ad.viewCount}', style: AppTypography.bodySmall),
              ],
            ),
            const SizedBox(height: 10),

            // ── Title ────────────────────────────────────────
            Text(ad.title, style: AppTypography.headingSmall),
            const SizedBox(height: 8),

            // ── Location & date ───────────────────────────────
            Row(
              children: [
                const Icon(Icons.location_on_outlined,
                    size: 13, color: AppColors.textMuted),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    ad.location,
                    style: AppTypography.bodySmall,
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 4),
            Row(
              children: [
                const Icon(Icons.access_time_rounded,
                    size: 13, color: AppColors.textMuted),
                const SizedBox(width: 4),
                Text(dateStr, style: AppTypography.bodySmall),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _CategoryTag extends StatelessWidget {
  const _CategoryTag(this.category);
  final String category;

  Color get _color => switch (category.toLowerCase()) {
        'singles'    => const Color(0xFF4D9A5A),
        'doubles'    => const Color(0xFFD4A843),
        'training'   => const Color(0xFF5B8FD4),
        'tournament' => const Color(0xFFD46B5B),
        _            => AppColors.textMuted,
      };

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: _color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(6),
        ),
        child: Text(
          category,
          style: AppTypography.bodySmall.copyWith(
            color: _color,
            fontWeight: FontWeight.w600,
          ),
        ),
      );
}
