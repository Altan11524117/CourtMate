import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../models/user_model.dart';
import '../services/api_client.dart';
import '../core/constants.dart';
import '../core/error_handler.dart';

final authRepositoryProvider = Provider<AuthRepository>(
  (ref) => AuthRepository(ref.read(apiClientProvider)),
);

final class AuthRepository {
  const AuthRepository(this._client);
  final ApiClient _client;
  final _storage = const FlutterSecureStorage();

  Future<void> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    try {
      await _client.post('/auth/register', data: {
        'fullName': fullName,
        'email':    email,
        'password': password,
      });
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  /// Returns the authenticated user's ID extracted from the login response token.
  /// Persists token + userId to secure storage for subsequent requests.
  Future<String> login({
    required String email,
    required String password,
  }) async {
    try {
      final res = await _client.post<Map<String, dynamic>>(
        '/auth/login',
        data: {'email': email, 'password': password},
      );
      final token = res.data!['token'] as String;

      // Persist JWT — interceptor reads this on every subsequent request.
      await _storage.write(key: AppConstants.keyAuthToken, value: token);

      // Fetch profile to get userId for storage and return.
      final meRes = await _client.get<Map<String, dynamic>>('/users/me');
      final userId = meRes.data!['userID'] as String;
      await _storage.write(key: AppConstants.keyUserId, value: userId);

      return userId;
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<void> logout() async {
    // Backend logout is stateless — just clear local credentials.
    await _storage.deleteAll();
  }

  Future<void> requestPasswordReset(String email) async {
    try {
      await _client.post('/auth/reset-password', data: {'email': email});
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<void> confirmPasswordReset({
    required String token,
    required String newPassword,
  }) async {
    try {
      await _client.post('/auth/reset-password/confirm', data: {
        'token':       token,
        'newPassword': newPassword,
      });
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<bool> get isAuthenticated async {
    final token = await _storage.read(key: AppConstants.keyAuthToken);
    return token != null;
  }

  Future<String?> get storedUserId async =>
      _storage.read(key: AppConstants.keyUserId);
}
