import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';
import '../../providers/auth_provider.dart';
import '../../providers/ad_provider.dart';
import '../../widgets/level_badge.dart';

class AdDetailScreen extends ConsumerWidget {
  const AdDetailScreen({super.key, required this.adId});
  final String adId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final adState  = ref.watch(adDetailProvider(adId));
    final authState = ref.watch(authProvider);

    return Scaffold(
      body: adState.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (e, _) => Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded,
                  color: AppColors.error, size: 48),
              const SizedBox(height: 16),
              Text('Could not load listing', style: AppTypography.headingSmall),
              const SizedBox(height: 8),
              Text(e.toString(), style: AppTypography.bodyMedium),
            ],
          ),
        ),
        data: (ad) {
          final isOwner   = authState.userId == ad.ownerId;
          final dateStr   = DateFormat(AppConstants.matchDateFormat)
              .format(ad.matchDate.toLocal());

          return CustomScrollView(
            slivers: [
              // ── Hero ─────────────────────────────────────────────
              SliverAppBar(
                expandedHeight: 220,
                pinned: true,
                backgroundColor: AppColors.background,
                leading: IconButton(
                  icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  onPressed: () => context.pop(),
                ),
                actions: [
                  if (isOwner)
                    IconButton(
                      icon: const Icon(Icons.delete_outline_rounded,
                          color: AppColors.danger),
                      onPressed: () => _confirmDelete(context, ref),
                    ),
                ],
                flexibleSpace: FlexibleSpaceBar(
                  background: Container(
                    decoration: const BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                        colors: [Color(0xFF0F2318), Color(0xFF071610)],
                      ),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(24, 80, 24, 24),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        mainAxisAlignment: MainAxisAlignment.end,
                        children: [
                          // Category + Level row
                          Row(
                            children: [
                              if (ad.category != null)
                                _CategoryTag(ad.category!),
                              const SizedBox(width: 8),
                              if (ad.requiredLevel != null)
                                LevelBadge(level: ad.requiredLevel, small: true),
                              const Spacer(),
                              Row(
                                children: [
                                  const Icon(Icons.remove_red_eye_outlined,
                                      size: 13, color: AppColors.textMuted),
                                  const SizedBox(width: 4),
                                  Text('${ad.viewCount}',
                                      style: AppTypography.bodySmall),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(ad.title, style: AppTypography.displayMedium),
                        ],
                      ),
                    ),
                  ),
                ),
              ),

              // ── Body ─────────────────────────────────────────────
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 120),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([

                    // ── Info cards ──────────────────────────────
                    _InfoGrid(dateStr: dateStr, location: ad.location),
                    const SizedBox(height: 24),

                    // ── Owner card ──────────────────────────────
                    if (ad.ownerSummary != null) ...[
                      Text('Posted by', style: AppTypography.overline),
                      const SizedBox(height: 10),
                      _OwnerCard(
                        name:    ad.ownerSummary!.fullName,
                        level:   ad.ownerSummary!.level,
                        ownerId: ad.ownerId,
                        onTap:   () => context.push('/profile/${ad.ownerId}'),
                      ),
                      const SizedBox(height: 24),
                    ],

                    // ── Applications section (owner only) ───────
                    if (isOwner) ...[
                      const _SectionDivider(label: 'Applications'),
                      const SizedBox(height: 12),
                      _ApplicationsPreview(
                        adId: adId,
                        onViewAll: () =>
                            context.push('/ads/$adId/applications'),
                      ),
                    ],
                  ]),
                ),
              ),
            ],
          );
        },
      ),

      // ── Bottom CTA ───────────────────────────────────────────────
      bottomNavigationBar: adState.whenOrNull(
        data: (ad) {
          final isOwner = authState.userId == ad.ownerId;
          if (isOwner) return null;
          return _ApplyBar(adId: adId);
        },
      ),
    );
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        title: Text('Delete Listing', style: AppTypography.headingSmall),
        content: Text(
          'This will permanently remove your listing and all applications.',
          style: AppTypography.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text('Delete',
                style: AppTypography.labelLarge
                    .copyWith(color: AppColors.danger)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      final deleted =
          await ref.read(adDetailProvider(adId).notifier).deleteAd();
      if (deleted && context.mounted) {
        ref.read(adListProvider.notifier).removeAd(adId);
        context.pop();
      }
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-widgets
// ─────────────────────────────────────────────────────────────────────────────

class _InfoGrid extends StatelessWidget {
  const _InfoGrid({required this.dateStr, required this.location});
  final String dateStr;
  final String location;

  @override
  Widget build(BuildContext context) => Column(
        children: [
          Row(
            children: [
              Expanded(
                child: _InfoTile(
                  icon: Icons.calendar_today_outlined,
                  label: 'Match Date',
                  value: dateStr,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _InfoTile(
                  icon: Icons.location_on_outlined,
                  label: 'Location',
                  value: location,
                ),
              ),
            ],
          ),
        ],
      );
}

class _InfoTile extends StatelessWidget {
  const _InfoTile({
    required this.icon,
    required this.label,
    required this.value,
  });
  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.surfaceBorder),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Icon(icon, size: 18, color: AppColors.primary),
            const SizedBox(height: 8),
            Text(label, style: AppTypography.overline),
            const SizedBox(height: 4),
            Text(value,
                style: AppTypography.labelLarge,
                maxLines: 2,
                overflow: TextOverflow.ellipsis),
          ],
        ),
      );
}

class _OwnerCard extends StatelessWidget {
  const _OwnerCard({
    required this.name,
    required this.ownerId,
    required this.onTap,
    this.level,
  });
  final String name;
  final String ownerId;
  final String? level;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: AppColors.surfaceBorder),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.2),
                  shape: BoxShape.circle,
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
                ),
                child: Center(
                  child: Text(
                    name.isNotEmpty ? name[0].toUpperCase() : '?',
                    style: AppTypography.headingMedium
                        .copyWith(color: AppColors.primary),
                  ),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: AppTypography.labelLarge),
                    if (level != null) ...[
                      const SizedBox(height: 4),
                      LevelBadge(level: level!, small: true),
                    ],
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded,
                  size: 14, color: AppColors.textMuted),
            ],
          ),
        ),
      );
}

class _SectionDivider extends StatelessWidget {
  const _SectionDivider({required this.label});
  final String label;

  @override
  Widget build(BuildContext context) => Row(
        children: [
          Text(label.toUpperCase(), style: AppTypography.overline),
          const SizedBox(width: 12),
          const Expanded(child: Divider(color: AppColors.surfaceBorder)),
        ],
      );
}

class _ApplicationsPreview extends ConsumerWidget {
  const _ApplicationsPreview({required this.adId, required this.onViewAll});
  final String adId;
  final VoidCallback onViewAll;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appsState = ref.watch(applicationsProvider(adId));

    return appsState.when(
      loading: () => const Center(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
      ),
      error: (_, __) => const SizedBox.shrink(),
      data: (apps) {
        if (apps.isEmpty) {
          return Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: AppColors.surfaceBorder),
            ),
            child: Center(
              child: Text('No applications yet',
                  style: AppTypography.bodyMedium),
            ),
          );
        }

        return Column(
          children: [
            ...apps.take(3).map((app) => Padding(
                  padding: const EdgeInsets.only(bottom: 8),
                  child: Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: AppColors.surfaceBorder),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 36,
                          height: 36,
                          decoration: BoxDecoration(
                            color: AppColors.primary.withValues(alpha: 0.15),
                            shape: BoxShape.circle,
                          ),
                          child: Center(
                            child: Text(
                              (app.applicantName ?? '?')[0].toUpperCase(),
                              style: AppTypography.labelLarge
                                  .copyWith(color: AppColors.primary),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(app.applicantName ?? 'Unknown',
                                  style: AppTypography.labelLarge),
                              if (app.applicantLevel != null)
                                LevelBadge(
                                    level: app.applicantLevel!, small: true),
                            ],
                          ),
                        ),
                        _StatusBadge(app.status),
                      ],
                    ),
                  ),
                )),
            if (apps.length > 3)
              TextButton(
                onPressed: onViewAll,
                child: Text(
                  'View all ${apps.length} applications →',
                  style: AppTypography.labelLarge
                      .copyWith(color: AppColors.primary),
                ),
              ),
          ],
        );
      },
    );
  }
}

class _StatusBadge extends StatelessWidget {
  const _StatusBadge(this.status);
  final String status;

  Color get _color => switch (status) {
        'approved' => AppColors.success,
        'rejected' => AppColors.danger,
        _          => AppColors.accent,
      };

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
        decoration: BoxDecoration(
          color: _color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: _color.withValues(alpha: 0.3)),
        ),
        child: Text(
          status[0].toUpperCase() + status.substring(1),
          style: AppTypography.bodySmall.copyWith(
            color: _color,
            fontWeight: FontWeight.w600,
          ),
        ),
      );
}

class _ApplyBar extends ConsumerStatefulWidget {
  const _ApplyBar({required this.adId});
  final String adId;

  @override
  ConsumerState<_ApplyBar> createState() => _ApplyBarState();
}

class _ApplyBarState extends ConsumerState<_ApplyBar> {
  bool _loading = false;
  bool _applied = false;

  Future<void> _apply() async {
    setState(() => _loading = true);
    final success =
        await ref.read(applicationsProvider(widget.adId).notifier).applyToAd();
    if (mounted) {
      setState(() {
        _loading = false;
        _applied = success;
      });
      if (success) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('🎾 Application sent!')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(20, 12, 20, 16),
          child: SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton(
              onPressed: (_loading || _applied) ? null : _apply,
              style: ElevatedButton.styleFrom(
                backgroundColor:
                    _applied ? AppColors.surfaceBorder : AppColors.primary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(14)),
              ),
              child: _loading
                  ? const SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(
                          strokeWidth: 2, color: Colors.white),
                    )
                  : Text(
                      _applied ? '✓ Applied' : '🎾 Apply to Join',
                      style: AppTypography.button,
                    ),
            ),
          ),
        ),
      );
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
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: _color.withValues(alpha: 0.12),
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
