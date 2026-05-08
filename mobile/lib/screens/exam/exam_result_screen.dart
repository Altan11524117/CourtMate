import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../providers/exam_provider.dart';
import '../../routes/app_router.dart';

class ExamResultScreen extends ConsumerWidget {
  const ExamResultScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final exam = ref.watch(examProvider);
    final result = exam.result;

    if (result == null) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.warning_amber_rounded,
                  color: AppColors.warning, size: 48),
              const SizedBox(height: 16),
              Text('No result found', style: AppTypography.headingSmall),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => context.go(AppRoutes.listings),
                child: const Text('Go Home'),
              ),
            ],
          ),
        ),
      );
    }

    final scorePercent = result.totalScore.clamp(0, 100).toInt();

    return Scaffold(
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // ── Confetti header ───────────────────────────────────
            SliverToBoxAdapter(
              child: Container(
                margin: const EdgeInsets.fromLTRB(24, 24, 24, 0),
                padding: const EdgeInsets.all(32),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [Color(0xFF0F2318), Color(0xFF071610)],
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    color: AppColors.primary.withValues(alpha: 0.3),
                  ),
                ),
                child: Column(
                  children: [
                    // Score ring
                    SizedBox(
                      width: 140,
                      height: 140,
                      child: Stack(
                        alignment: Alignment.center,
                        children: [
                          SizedBox(
                            width: 140,
                            height: 140,
                            child: CircularProgressIndicator(
                              value: scorePercent / 100,
                              strokeWidth: 10,
                              strokeCap: StrokeCap.round,
                              backgroundColor: AppColors.surfaceBorder,
                              valueColor: AlwaysStoppedAnimation<Color>(
                                _scoreColor(scorePercent),
                              ),
                            ),
                          ),
                          Column(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                '$scorePercent%',
                                style: AppTypography.displayMedium.copyWith(
                                  color: _scoreColor(scorePercent),
                                ),
                              ),
                              Text('Score', style: AppTypography.bodySmall),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 28),

                    Text('Your Level', style: AppTypography.overline),
                    const SizedBox(height: 8),
                    Text(
                      result.assignedLevel,
                      style: AppTypography.displayAccent.copyWith(fontSize: 30),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 12),
                    Text(
                      _levelDescription(result.assignedLevel),
                      style: AppTypography.bodyMedium,
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 24)),

            // ── AI Analysis section ──────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.auto_awesome_rounded,
                            color: AppColors.accent, size: 20),
                        const SizedBox(width: 8),
                        Text('AI Analysis',
                            style: AppTypography.headingSmall
                                .copyWith(color: AppColors.accent)),
                      ],
                    ),
                    const SizedBox(height: 12),
                    Container(
                      width: double.infinity,
                      padding: const EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppColors.surfaceBorder),
                      ),
                      child: exam.aiAnalysis != null
                          ? Text(
                              exam.aiAnalysis!,
                              style: AppTypography.bodyMedium.copyWith(
                                color: AppColors.textPrimary,
                                height: 1.6,
                              ),
                            )
                          : Row(
                              children: [
                                const SizedBox(
                                  width: 18,
                                  height: 18,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: AppColors.accent,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Text(
                                    'Generating personalized analysis...',
                                    style: AppTypography.bodyMedium,
                                  ),
                                ),
                              ],
                            ),
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 32)),

            // ── Stats row ────────────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Row(
                  children: [
                    Expanded(
                      child: _StatCard(
                        icon: Icons.quiz_outlined,
                        label: 'Questions',
                        value: '${exam.questions.length}',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.check_circle_outline_rounded,
                        label: 'Answered',
                        value: '${exam.answeredCount}',
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: _StatCard(
                        icon: Icons.stars_rounded,
                        label: 'Score',
                        value: result.totalScore.toStringAsFixed(1),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 40)),

            // ── Action buttons ───────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: Column(
                  children: [
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: ElevatedButton.icon(
                        onPressed: () => context.go(AppRoutes.listings),
                        icon: const Icon(Icons.home_rounded),
                        label: Text('Browse Matches',
                            style: AppTypography.button),
                        style: ElevatedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      height: 54,
                      child: OutlinedButton.icon(
                        onPressed: () {
                          ref.read(examProvider.notifier).reset();
                          ref.read(examProvider.notifier).loadQuestions();
                          context.go(AppRoutes.examQuestion);
                        },
                        icon: const Icon(Icons.refresh_rounded),
                        label: const Text('Retake Exam'),
                        style: OutlinedButton.styleFrom(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                          ),
                          side: const BorderSide(color: AppColors.surfaceBorder),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SliverToBoxAdapter(child: SizedBox(height: 40)),
          ],
        ),
      ),
    );
  }

  Color _scoreColor(int percent) {
    if (percent >= 80) return AppColors.success;
    if (percent >= 50) return AppColors.warning;
    return AppColors.error;
  }

  String _levelDescription(String level) {
    final lower = level.toLowerCase();
    if (lower.contains('beginner')) {
      return 'You\'re starting your tennis journey — great matches await!';
    } else if (lower.contains('intermediate')) {
      return 'Solid skills! You\'re ready for competitive rallies.';
    } else if (lower.contains('upper')) {
      return 'Impressive technique — you can handle advanced play.';
    } else if (lower.contains('advanced')) {
      return 'Elite level — bring your A-game to every match!';
    }
    return 'Your level has been determined based on your answers.';
  }
}

// ─────────────────────────────────────────────────────────────────────────────
class _StatCard extends StatelessWidget {
  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
  });
  final IconData icon;
  final String label;
  final String value;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 12),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.surfaceBorder),
        ),
        child: Column(
          children: [
            Icon(icon, color: AppColors.primary, size: 22),
            const SizedBox(height: 8),
            Text(value, style: AppTypography.headingMedium),
            const SizedBox(height: 2),
            Text(label, style: AppTypography.bodySmall),
          ],
        ),
      );
}
