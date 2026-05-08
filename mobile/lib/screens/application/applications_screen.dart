import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/theme.dart';
import '../../providers/ad_provider.dart';
import '../../widgets/level_badge.dart';

class ApplicationsScreen extends ConsumerWidget {
  const ApplicationsScreen({super.key, required this.adId});
  final String adId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appsState = ref.watch(applicationsProvider(adId));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Applications'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: appsState.when(
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
              Text('Could not load applications',
                  style: AppTypography.headingSmall),
              const SizedBox(height: 8),
              Text(e.toString(), style: AppTypography.bodyMedium),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () =>
                    ref.read(applicationsProvider(adId).notifier).fetch(),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (apps) {
          if (apps.isEmpty) {
            return Center(
              child: Padding(
                padding: const EdgeInsets.all(40),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(24),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: AppColors.surfaceBorder),
                      ),
                      child: const Icon(Icons.people_outline_rounded,
                          size: 40, color: AppColors.textMuted),
                    ),
                    const SizedBox(height: 20),
                    Text('No applications yet',
                        style: AppTypography.headingMedium),
                    const SizedBox(height: 8),
                    Text(
                      'When players apply to your listing, they\'ll appear here.',
                      style: AppTypography.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            );
          }

          return ListView.separated(
            padding: const EdgeInsets.all(20),
            itemCount: apps.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final app = apps[index];
              return _ApplicationCard(
                app: app,
                onApprove: () => ref
                    .read(applicationsProvider(adId).notifier)
                    .updateStatus(app.id, 'approved'),
                onReject: () => ref
                    .read(applicationsProvider(adId).notifier)
                    .updateStatus(app.id, 'rejected'),
                onViewProfile: () =>
                    context.push('/profile/${app.applicantId}'),
              );
            },
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
class _ApplicationCard extends StatelessWidget {
  const _ApplicationCard({
    required this.app,
    required this.onApprove,
    required this.onReject,
    required this.onViewProfile,
  });

  final dynamic app;
  final VoidCallback onApprove;
  final VoidCallback onReject;
  final VoidCallback onViewProfile;

  @override
  Widget build(BuildContext context) {
    final dateStr = DateFormat('dd MMM yyyy').format(app.createdAt.toLocal());

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.surfaceBorder),
      ),
      child: Column(
        children: [
          // ── User row ─────────────────────────────────────────
          GestureDetector(
            onTap: onViewProfile,
            child: Row(
              children: [
                // Avatar
                Container(
                  width: 48,
                  height: 48,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.15),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.primary.withValues(alpha: 0.3),
                    ),
                  ),
                  child: Center(
                    child: Text(
                      (app.applicantName ?? '?')[0].toUpperCase(),
                      style: AppTypography.headingMedium
                          .copyWith(color: AppColors.primary),
                    ),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(app.applicantName ?? 'Unknown',
                          style: AppTypography.labelLarge),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          if (app.applicantLevel != null) ...[
                            LevelBadge(
                                level: app.applicantLevel, small: true),
                            const SizedBox(width: 8),
                          ],
                          Text('Applied $dateStr',
                              style: AppTypography.bodySmall),
                        ],
                      ),
                    ],
                  ),
                ),
                _StatusChip(app.status),
              ],
            ),
          ),

          // ── Action buttons (only for pending) ────────────────
          if (app.isPending) ...[
            const SizedBox(height: 16),
            const Divider(color: AppColors.surfaceBorder, height: 1),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: onReject,
                    icon: const Icon(Icons.close_rounded,
                        size: 18, color: AppColors.danger),
                    label: Text('Reject',
                        style: AppTypography.labelLarge
                            .copyWith(color: AppColors.danger)),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                      side: BorderSide(
                        color: AppColors.danger.withValues(alpha: 0.4),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton.icon(
                    onPressed: onApprove,
                    icon: const Icon(Icons.check_rounded, size: 18),
                    label: Text('Approve', style: AppTypography.button),
                    style: ElevatedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }
}

class _StatusChip extends StatelessWidget {
  const _StatusChip(this.status);
  final String status;

  Color get _color => switch (status) {
        'approved' => AppColors.success,
        'rejected' => AppColors.danger,
        _ => AppColors.accent,
      };

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: _color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(8),
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
