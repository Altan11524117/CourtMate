import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/theme.dart';
import '../../core/constants.dart';
import '../../providers/user_provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/exam_provider.dart';
import '../../routes/app_router.dart';
import '../../widgets/level_badge.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key, required this.userId});
  final String userId;

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileState = ref.watch(userProfileProvider(userId));
    final authState = ref.watch(authProvider);
    final isOwnProfile = authState.userId == userId;

    return Scaffold(
      body: profileState.when(
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
              Text('Could not load profile', style: AppTypography.headingSmall),
              const SizedBox(height: 8),
              Text(e.toString(), style: AppTypography.bodyMedium),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () =>
                    ref.read(userProfileProvider(userId).notifier).fetch(),
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
        data: (user) {
          final memberSince = user.createdAt != null
              ? DateFormat(AppConstants.memberSinceFormat)
                  .format(user.createdAt!.toLocal())
              : 'Unknown';

          return CustomScrollView(
            slivers: [
              // ── Hero header ──────────────────────────────────────
              SliverToBoxAdapter(
                child: Container(
                  decoration: const BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Color(0xFF0F2318), Color(0xFF071610)],
                    ),
                  ),
                  padding: const EdgeInsets.fromLTRB(24, 56, 24, 32),
                  child: Column(
                    children: [
                      // Nav row
                      Row(
                        children: [
                          IconButton(
                            icon:
                                const Icon(Icons.arrow_back_ios_new_rounded),
                            onPressed: () => context.pop(),
                          ),
                          const Spacer(),
                          if (isOwnProfile)
                            IconButton(
                              icon: const Icon(Icons.edit_outlined),
                              onPressed: () =>
                                  context.push('/profile/$userId/edit'),
                            ),
                        ],
                      ),
                      const SizedBox(height: 24),

                      // Avatar
                      Container(
                        width: 90,
                        height: 90,
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.2),
                          shape: BoxShape.circle,
                          border: Border.all(
                            color: AppColors.primary.withValues(alpha: 0.5),
                            width: 3,
                          ),
                        ),
                        child: Center(
                          child: Text(
                            user.fullName.isNotEmpty
                                ? user.fullName[0].toUpperCase()
                                : '?',
                            style: AppTypography.displayMedium
                                .copyWith(color: AppColors.primary),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Name
                      Text(user.fullName, style: AppTypography.headingLarge),
                      const SizedBox(height: 6),
                      Text(user.email, style: AppTypography.bodyMedium),
                      const SizedBox(height: 12),

                      // Level badge
                      if (user.hasLevel)
                        LevelBadge(level: user.level, small: false),
                    ],
                  ),
                ),
              ),

              // ── Info cards ───────────────────────────────────────
              SliverPadding(
                padding: const EdgeInsets.fromLTRB(20, 24, 20, 120),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    // Stats row
                    Row(
                      children: [
                        Expanded(
                          child: _StatTile(
                            icon: Icons.calendar_month_outlined,
                            label: 'Member Since',
                            value: memberSince,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _StatTile(
                            icon: Icons.sports_tennis_rounded,
                            label: 'Preferred Hand',
                            value: user.preferredHand ?? 'Not set',
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Bio
                    if (user.bio != null && user.bio!.isNotEmpty) ...[
                      Text('ABOUT', style: AppTypography.overline),
                      const SizedBox(height: 10),
                      Container(
                        width: double.infinity,
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: AppColors.surface,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.surfaceBorder),
                        ),
                        child: Text(
                          user.bio!,
                          style: AppTypography.bodyLarge
                              .copyWith(height: 1.6),
                        ),
                      ),
                      const SizedBox(height: 20),
                    ],

                    // Level exam CTA (only if own profile and no level)
                    if (isOwnProfile && !user.hasLevel) ...[
                      const SizedBox(height: 8),
                      _ExamCta(
                        onTap: () {
                          ref.read(examProvider.notifier).reset();
                          context.push(AppRoutes.examIntro);
                        },
                      ),
                      const SizedBox(height: 20),
                    ],

                    // Logout (only own profile)
                    if (isOwnProfile) ...[
                      const SizedBox(height: 16),
                      SizedBox(
                        width: double.infinity,
                        height: 50,
                        child: OutlinedButton.icon(
                          onPressed: () async {
                            await ref.read(authProvider.notifier).logout();
                            if (context.mounted) {
                              context.go(AppRoutes.login);
                            }
                          },
                          icon: const Icon(Icons.logout_rounded,
                              color: AppColors.danger),
                          label: Text('Log Out',
                              style: AppTypography.labelLarge
                                  .copyWith(color: AppColors.danger)),
                          style: OutlinedButton.styleFrom(
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            side: BorderSide(
                              color: AppColors.danger.withValues(alpha: 0.4),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ]),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
class _StatTile extends StatelessWidget {
  const _StatTile({
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
            Icon(icon, size: 20, color: AppColors.primary),
            const SizedBox(height: 10),
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

class _ExamCta extends StatelessWidget {
  const _ExamCta({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                AppColors.primary.withValues(alpha: 0.15),
                AppColors.accent.withValues(alpha: 0.08),
              ],
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: AppColors.primary.withValues(alpha: 0.3),
            ),
          ),
          child: Row(
            children: [
              Container(
                width: 50,
                height: 50,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: const Icon(Icons.quiz_outlined,
                    color: AppColors.primary, size: 26),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Take the Level Exam',
                        style: AppTypography.headingSmall),
                    const SizedBox(height: 4),
                    Text(
                      'Discover your ITN level and get better matches.',
                      style: AppTypography.bodySmall,
                    ),
                  ],
                ),
              ),
              const Icon(Icons.arrow_forward_ios_rounded,
                  size: 16, color: AppColors.textMuted),
            ],
          ),
        ),
      );
}
