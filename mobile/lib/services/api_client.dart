import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:pretty_dio_logger/pretty_dio_logger.dart';
import '../core/constants.dart';

// Re-export so repositories can import parseApiError from one place
export '../core/error_handler.dart';

/// Resolves the correct API base URL based on the running platform.
/// Web and iOS use localhost; Android emulator requires 10.0.2.2.
String _resolveBaseUrl() {
  if (kIsWeb) return AppConstants.apiBaseUrlIos; // localhost for web
  // Only import dart:io on non-web targets
  try {
    // defaultTargetPlatform is safe on all platforms
    if (defaultTargetPlatform == TargetPlatform.android) {
      return AppConstants.apiBaseUrl; // 10.0.2.2
    }
  } catch (_) {}
  return AppConstants.apiBaseUrlIos; // iOS / desktop / fallback
}

// ── Provider ──────────────────────────────────────────────────────────────────

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

// ── Client ────────────────────────────────────────────────────────────────────

final class ApiClient {
  ApiClient() {
    _dio = Dio(BaseOptions(
      baseUrl: _resolveBaseUrl(),
      connectTimeout: AppConstants.apiConnectTimeout,
      receiveTimeout: AppConstants.apiTimeout,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    // Auth interceptor runs before every request — injects JWT if present.
    // Placed BEFORE logger so logs show the Authorization header.
    _dio.interceptors.add(_AuthInterceptor(_storage));

    // Pretty logger: required for homework — visually shows request → response
    // Only active in debug/profile builds to avoid leaking tokens in production.
    if (kDebugMode) {
      _dio.interceptors.add(PrettyDioLogger(
        requestHeader: true,
        requestBody: true,
        responseBody: true,
        responseHeader: false,
        error: true,
        compact: false,
      ));
    }
  }

  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  // ── HTTP verbs ────────────────────────────────────────────────

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
  }) =>
      _dio.get<T>(path, queryParameters: queryParameters, options: options);

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Options? options,
  }) =>
      _dio.post<T>(path, data: data, options: options);

  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Options? options,
  }) =>
      _dio.patch<T>(path, data: data, options: options);

  Future<Response<T>> delete<T>(
    String path, {
    Options? options,
  }) =>
      _dio.delete<T>(path, options: options);
}

// ── Auth Interceptor ──────────────────────────────────────────────────────────

/// Injects JWT on every outbound request.
/// On 401 response: clears stored token and rethrows so GoRouter redirect
/// guard can redirect to login. Does NOT attempt token refresh — backend
/// issues 72h tokens, refresh is out of scope.
final class _AuthInterceptor extends Interceptor {
  const _AuthInterceptor(this._storage);

  final FlutterSecureStorage _storage;

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _storage.read(key: AppConstants.keyAuthToken);
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401) {
      // Token expired or invalid — clear credentials so auth guard fires
      await _storage.deleteAll();
    }
    handler.next(err);
  }
}
