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
    String? fullName,
    String? preferredHand,
    String? bio,
  }) async {
    try {
      final res = await _client.patch<Map<String, dynamic>>(
        '/users/$userId/profile',
        data: {
          if (fullName      != null) 'fullName':      fullName,
          if (preferredHand != null) 'preferredHand': preferredHand,
          if (bio           != null) 'bio':            bio,
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
