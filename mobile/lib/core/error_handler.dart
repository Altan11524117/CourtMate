import 'package:dio/dio.dart';

/// Converts raw DioException into a human-readable message.
/// Backend always returns {"error": "..."} on failure per controllers.
String parseApiError(DioException e) {
  final data = e.response?.data;
  if (data is Map && data.containsKey('error')) {
    return data['error'] as String;
  }
  return switch (e.type) {
    DioExceptionType.connectionTimeout  => 'Connection timed out. Check your network.',
    DioExceptionType.receiveTimeout     => 'Server took too long to respond.',
    DioExceptionType.connectionError    => 'Cannot reach the server. Check your network.',
    DioExceptionType.badResponse        => 'Server error (${e.response?.statusCode}).',
    _                                   => 'An unexpected error occurred.',
  };
}
