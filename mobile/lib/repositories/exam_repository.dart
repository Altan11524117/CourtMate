import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/exam_model.dart';
import '../services/api_client.dart';

final examRepositoryProvider = Provider<ExamRepository>(
  (ref) => ExamRepository(ref.read(apiClientProvider)),
);

final class ExamRepository {
  const ExamRepository(this._client);
  final ApiClient _client;

  Future<List<ExamQuestionModel>> getQuestions() async {
    try {
      final res = await _client.get<List<dynamic>>(
        '/exams/placement/questions',
      );
      return (res.data ?? [])
          .map((j) => ExamQuestionModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<ExamResultModel> submitExam(
    List<ExamAnswerPayload> answers,
  ) async {
    try {
      final res = await _client.post<Map<String, dynamic>>(
        '/exams/placement/submit',
        data: {'answers': answers.map((a) => a.toJson()).toList()},
      );
      return ExamResultModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<String> analyzeExam(List<Map<String, dynamic>> answers) async {
    try {
      final res = await _client.post<Map<String, dynamic>>(
        '/exams/analyze',
        data: {'answers': answers},
      );
      return res.data!['analysis'] as String;
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }
}
