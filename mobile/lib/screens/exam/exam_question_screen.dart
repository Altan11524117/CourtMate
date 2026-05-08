import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../providers/exam_provider.dart';
import '../../routes/app_router.dart';

class ExamQuestionScreen extends ConsumerWidget {
  const ExamQuestionScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final exam = ref.watch(examProvider);

    if (exam.isLoading) {
      return const Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              CircularProgressIndicator(color: AppColors.primary),
              SizedBox(height: 16),
              Text('Loading questions...', style: TextStyle(color: AppColors.textMuted)),
            ],
          ),
        ),
      );
    }

    if (exam.errorMessage != null) {
      return Scaffold(
        body: Center(
          child: Padding(
            padding: const EdgeInsets.all(32),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.error_outline_rounded,
                    color: AppColors.error, size: 48),
                const SizedBox(height: 16),
                Text('Failed to load questions',
                    style: AppTypography.headingSmall),
                const SizedBox(height: 8),
                Text(exam.errorMessage!, style: AppTypography.bodyMedium),
                const SizedBox(height: 24),
                ElevatedButton(
                  onPressed: () =>
                      ref.read(examProvider.notifier).loadQuestions(),
                  child: const Text('Retry'),
                ),
              ],
            ),
          ),
        ),
      );
    }

    final question = exam.currentQuestion;
    if (question == null) {
      return const Scaffold(
        body: Center(child: Text('No questions available')),
      );
    }

    final selectedOption = exam.selectedOptionFor(question.id);

    return Scaffold(
      body: SafeArea(
        child: Column(
          children: [
            // ── Top bar ──────────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(8, 8, 16, 0),
              child: Row(
                children: [
                  IconButton(
                    icon: const Icon(Icons.close_rounded),
                    onPressed: () => _confirmExit(context),
                  ),
                  const Spacer(),
                  _DifficultyBadge(question.difficultyLevel),
                  const SizedBox(width: 12),
                  Text(
                    '${exam.currentIndex + 1} / ${exam.questions.length}',
                    style: AppTypography.labelLarge,
                  ),
                ],
              ),
            ),

            // ── Progress bar ─────────────────────────────────────
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 0),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: LinearProgressIndicator(
                  value: exam.progressFraction,
                  minHeight: 6,
                  backgroundColor: AppColors.surfaceBorder,
                  valueColor:
                      const AlwaysStoppedAnimation<Color>(AppColors.primary),
                ),
              ),
            ),

            // ── Question ─────────────────────────────────────────
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(24, 32, 24, 24),
                children: [
                  Text(
                    question.text,
                    style: AppTypography.headingLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    '${question.pointValue.toStringAsFixed(0)} points',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.accent,
                    ),
                  ),
                  const SizedBox(height: 32),

                  // ── Options ──────────────────────────────────
                  ...question.options.asMap().entries.map((entry) {
                    final idx = entry.key;
                    final option = entry.value;
                    final isSelected = selectedOption == option.id;
                    final letter = String.fromCharCode(65 + idx); // A, B, C...

                    return Padding(
                      padding: const EdgeInsets.only(bottom: 12),
                      child: GestureDetector(
                        onTap: () => ref
                            .read(examProvider.notifier)
                            .selectAnswer(question.id, option.id),
                        child: AnimatedContainer(
                          duration: const Duration(milliseconds: 200),
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppColors.primary.withValues(alpha: 0.12)
                                : AppColors.surface,
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(
                              color: isSelected
                                  ? AppColors.primary
                                  : AppColors.surfaceBorder,
                              width: isSelected ? 2 : 1,
                            ),
                          ),
                          child: Row(
                            children: [
                              // Letter circle
                              Container(
                                width: 36,
                                height: 36,
                                decoration: BoxDecoration(
                                  color: isSelected
                                      ? AppColors.primary
                                      : AppColors.surfaceBorder,
                                  shape: BoxShape.circle,
                                ),
                                child: Center(
                                  child: Text(
                                    letter,
                                    style: AppTypography.labelLarge.copyWith(
                                      color: isSelected
                                          ? Colors.white
                                          : AppColors.textMuted,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 14),
                              Expanded(
                                child: Text(
                                  option.text,
                                  style: AppTypography.bodyLarge.copyWith(
                                    color: isSelected
                                        ? AppColors.textPrimary
                                        : AppColors.textSecondary,
                                  ),
                                ),
                              ),
                              if (isSelected)
                                const Icon(Icons.check_circle_rounded,
                                    color: AppColors.primary, size: 22),
                            ],
                          ),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),

            // ── Bottom nav ───────────────────────────────────────
            Container(
              padding: const EdgeInsets.fromLTRB(24, 12, 24, 16),
              decoration: const BoxDecoration(
                border: Border(
                  top: BorderSide(color: AppColors.surfaceBorder),
                ),
              ),
              child: Row(
                children: [
                  // Previous
                  if (exam.currentIndex > 0)
                    Expanded(
                      child: OutlinedButton.icon(
                        onPressed: () =>
                            ref.read(examProvider.notifier).previousQuestion(),
                        icon: const Icon(Icons.arrow_back_rounded, size: 18),
                        label: const Text('Previous'),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          side: const BorderSide(color: AppColors.surfaceBorder),
                        ),
                      ),
                    )
                  else
                    const Spacer(),

                  const SizedBox(width: 12),

                  // Next / Submit
                  Expanded(
                    child: exam.isLastQuestion
                        ? ElevatedButton(
                            onPressed: exam.allAnswered && !exam.isSubmitting
                                ? () => _submitExam(context, ref)
                                : null,
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                            child: exam.isSubmitting
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                        strokeWidth: 2, color: Colors.white),
                                  )
                                : Text(
                                    exam.allAnswered
                                        ? 'Submit Exam'
                                        : 'Answer All (${exam.answeredCount}/${exam.questions.length})',
                                    style: AppTypography.button,
                                  ),
                          )
                        : ElevatedButton.icon(
                            onPressed: selectedOption != null
                                ? () => ref
                                    .read(examProvider.notifier)
                                    .nextQuestion()
                                : null,
                            icon: const Text('Next'),
                            label:
                                const Icon(Icons.arrow_forward_rounded, size: 18),
                            style: ElevatedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(12),
                              ),
                            ),
                          ),
                  ),
                ],
              ),
            ),

            // ── Question dots ────────────────────────────────────
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(
                  exam.questions.length,
                  (i) => GestureDetector(
                    onTap: () =>
                        ref.read(examProvider.notifier).goToQuestion(i),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      width: i == exam.currentIndex ? 24 : 10,
                      height: 10,
                      margin: const EdgeInsets.symmetric(horizontal: 3),
                      decoration: BoxDecoration(
                        color: i == exam.currentIndex
                            ? AppColors.primary
                            : exam.isAnswered(exam.questions[i].id)
                                ? AppColors.primary.withValues(alpha: 0.4)
                                : AppColors.surfaceBorder,
                        borderRadius: BorderRadius.circular(5),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Future<void> _submitExam(BuildContext context, WidgetRef ref) async {
    final result = await ref.read(examProvider.notifier).submitExam();
    if (result != null && context.mounted) {
      context.go(AppRoutes.examResult);
    }
  }

  void _confirmExit(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        title: Text('Quit Exam?', style: AppTypography.headingSmall),
        content: Text(
          'Your progress will be lost if you leave now.',
          style: AppTypography.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Continue Exam'),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.pop();
            },
            child: const Text('Quit',
                style: TextStyle(color: AppColors.danger)),
          ),
        ],
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
class _DifficultyBadge extends StatelessWidget {
  const _DifficultyBadge(this.level);
  final String level;

  Color get _color => switch (level.toLowerCase()) {
        'easy' => AppColors.difficultyEasy,
        'medium' => AppColors.difficultyMedium,
        'hard' => AppColors.difficultyHard,
        _ => AppColors.textMuted,
      };

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
        decoration: BoxDecoration(
          color: _color.withValues(alpha: 0.12),
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: _color.withValues(alpha: 0.3)),
        ),
        child: Text(
          level[0].toUpperCase() + level.substring(1),
          style: AppTypography.bodySmall.copyWith(
            color: _color,
            fontWeight: FontWeight.w600,
          ),
        ),
      );
}
