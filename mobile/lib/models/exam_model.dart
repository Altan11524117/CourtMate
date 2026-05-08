// Matches: controllers/exam.go → GetExamQuestions + SubmitExam responses
// IsCorrect is intentionally stripped by backend on GET — only present
// after submission in ExamResult.

class ExamOptionModel {
  const ExamOptionModel({required this.id, required this.text});

  final String id;
  final String text;

  factory ExamOptionModel.fromJson(Map<String, dynamic> json) =>
      ExamOptionModel(
        id:   json['id'] as String,
        text: json['text'] as String,
      );
}

class ExamQuestionModel {
  const ExamQuestionModel({
    required this.id,
    required this.text,
    required this.difficultyLevel,
    required this.orderIndex,
    required this.pointValue,
    required this.options,
  });

  final String id;
  final String text;
  final String difficultyLevel; // "easy" | "medium" | "hard"
  final int orderIndex;
  final double pointValue;
  final List<ExamOptionModel> options;

  factory ExamQuestionModel.fromJson(Map<String, dynamic> json) =>
      ExamQuestionModel(
        id:              json['id'] as String,
        text:            json['text'] as String,
        difficultyLevel: json['difficultyLevel'] as String,
        orderIndex:      json['orderIndex'] as int,
        pointValue:      (json['pointValue'] as num).toDouble(),
        options:         (json['options'] as List<dynamic>)
            .map((o) => ExamOptionModel.fromJson(o as Map<String, dynamic>))
            .toList(),
      );
}

class ExamResultModel {
  const ExamResultModel({
    required this.assignedLevel,
    required this.totalScore,
    required this.resultId,
  });

  final String assignedLevel;
  final double totalScore;
  final String resultId;

  factory ExamResultModel.fromJson(Map<String, dynamic> json) =>
      ExamResultModel(
        assignedLevel: json['assignedLevel'] as String,
        totalScore:    (json['totalScore'] as num).toDouble(),
        resultId:      json['resultId'] as String,
      );
}

// Encapsulates a single answer: questionId → selected optionId.
// Used to build the submission payload for POST /exams/placement/submit.
class ExamAnswerPayload {
  const ExamAnswerPayload({
    required this.questionId,
    required this.optionId,
  });

  final String questionId;
  final String optionId;

  Map<String, dynamic> toJson() => {
        'questionId': questionId,
        'optionId':   optionId,
      };
}
