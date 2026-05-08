import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/exam_model.dart';
import '../repositories/exam_repository.dart';

class ExamState {
  const ExamState({
    this.questions = const [],
    this.currentIndex = 0,
    this.answers = const {},
    this.result,
    this.aiAnalysis,
    this.isLoading = false,
    this.isSubmitting = false,
    this.errorMessage,
  });

  final List<ExamQuestionModel> questions;
  final int currentIndex;
  final Map<String, String> answers; // questionId → optionId
  final ExamResultModel? result;
  final String? aiAnalysis;
  final bool isLoading;
  final bool isSubmitting;
  final String? errorMessage;

  ExamQuestionModel? get currentQuestion =>
      questions.isEmpty ? null : questions[currentIndex];

  bool get isLastQuestion =>
      questions.isNotEmpty && currentIndex == questions.length - 1;

  bool get allAnswered => answers.length == questions.length;

  int get answeredCount => answers.length;

  bool isAnswered(String questionId) => answers.containsKey(questionId);

  String? selectedOptionFor(String questionId) => answers[questionId];

  double get progressFraction =>
      questions.isEmpty ? 0 : (currentIndex + 1) / questions.length;

  ExamState copyWith({
    List<ExamQuestionModel>? questions,
    int? currentIndex,
    Map<String, String>? answers,
    ExamResultModel? result,
    String? aiAnalysis,
    bool? isLoading,
    bool? isSubmitting,
    String? errorMessage,
  }) =>
      ExamState(
        questions:    questions    ?? this.questions,
        currentIndex: currentIndex ?? this.currentIndex,
        answers:      answers      ?? this.answers,
        result:       result       ?? this.result,
        aiAnalysis:   aiAnalysis   ?? this.aiAnalysis,
        isLoading:    isLoading    ?? this.isLoading,
        isSubmitting: isSubmitting ?? this.isSubmitting,
        errorMessage: errorMessage,
      );
}

final examProvider =
    StateNotifierProvider<ExamNotifier, ExamState>((ref) {
  return ExamNotifier(ref.read(examRepositoryProvider));
});

class ExamNotifier extends StateNotifier<ExamState> {
  ExamNotifier(this._repo) : super(const ExamState());

  final ExamRepository _repo;

  Future<void> loadQuestions() async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final questions = await _repo.getQuestions();
      state = state.copyWith(
        questions: questions,
        isLoading: false,
        currentIndex: 0,
        answers: {},
      );
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void selectAnswer(String questionId, String optionId) {
    final updated = Map<String, String>.from(state.answers);
    updated[questionId] = optionId;
    state = state.copyWith(answers: updated);
  }

  void nextQuestion() {
    if (state.currentIndex < state.questions.length - 1) {
      state = state.copyWith(currentIndex: state.currentIndex + 1);
    }
  }

  void previousQuestion() {
    if (state.currentIndex > 0) {
      state = state.copyWith(currentIndex: state.currentIndex - 1);
    }
  }

  void goToQuestion(int index) {
    if (index >= 0 && index < state.questions.length) {
      state = state.copyWith(currentIndex: index);
    }
  }

  Future<ExamResultModel?> submitExam() async {
    if (!state.allAnswered) return null;

    state = state.copyWith(isSubmitting: true);
    try {
      final payload = state.answers.entries
          .map((e) => ExamAnswerPayload(questionId: e.key, optionId: e.value))
          .toList();

      final result = await _repo.submitExam(payload);
      state = state.copyWith(isSubmitting: false, result: result);

      // Fire AI analysis asynchronously — doesn't block result display
      _analyzeAsync();

      return result;
    } catch (e) {
      state = state.copyWith(isSubmitting: false, errorMessage: e.toString());
      return null;
    }
  }

  Future<void> _analyzeAsync() async {
    try {
      // Build analysis payload from questions + chosen options
      final analysisPayload = state.answers.entries.map((entry) {
        final question = state.questions.firstWhere(
          (q) => q.id == entry.key,
          orElse: () => throw Exception('Question not found'),
        );
        final option = question.options.firstWhere(
          (o) => o.id == entry.value,
          orElse: () => throw Exception('Option not found'),
        );
        // We don't have isCorrect client-side (backend strips it) — backend
        // determines correctness during submit. Send what we have for AI context.
        return {
          'questionText': question.text,
          'selectedText': option.text,
          'isCorrect':    false, // placeholder — AI uses text context anyway
        };
      }).toList();

      final analysis = await _repo.analyzeExam(analysisPayload);
      state = state.copyWith(aiAnalysis: analysis);
    } catch (_) {
      // AI analysis failure is non-fatal — exam result already shown
    }
  }

  void reset() => state = const ExamState();
}
