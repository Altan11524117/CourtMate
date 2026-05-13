import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/api_client.dart';

final userRepositoryProvider = Provider<UserRepository>(
  (ref) => UserRepository(ref.read(apiClientProvider)),
);

final class UserRepository {
  const UserRepository(this._client);
  final ApiClient _client;

  Future<UserModel> getProfile(String userId) async {
    try {
      final res = await _client.get<Map<String, dynamic>>(
        '/users/$userId/profile',
      );
      return UserModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<UserModel> updateProfile(
    String userId, {
    required String fullName,
    String? preferredHand,
    required String bio,
  }) async {
    try {
      final res = await _client.patch<Map<String, dynamic>>(
        '/users/$userId/profile',
        data: {
          'fullName':      fullName,
          'preferredHand': preferredHand ?? '',
          'bio':           bio,
        },
      );
      return UserModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<void> deleteAccount(String userId) async {
    try {
      await _client.delete('/users/$userId');
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }
}
