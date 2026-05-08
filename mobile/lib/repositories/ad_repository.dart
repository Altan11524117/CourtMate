import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ad_model.dart';
import '../models/application_model.dart';
import '../services/api_client.dart';
import '../core/constants.dart';

// ─────────────────────────────────────────────────────────────────────────────
// AD REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

final adRepositoryProvider = Provider<AdRepository>(
  (ref) => AdRepository(ref.read(apiClientProvider)),
);

final class AdRepository {
  const AdRepository(this._client);
  final ApiClient _client;

  Future<List<AdModel>> searchAds({
    String? category,
    String? location,
    String sort = 'newest',
  }) async {
    try {
      final res = await _client.get<List<dynamic>>(
        '/ads/search',
        queryParameters: {
          if (category != null && category.isNotEmpty) 'category': category,
          if (location != null && location.isNotEmpty) 'location': location,
          'sort': sort,
        },
      );
      return (res.data ?? [])
          .map((j) => AdModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<List<AdModel>> listAds({
    int limit  = AppConstants.defaultPageLimit,
    int offset = AppConstants.defaultPageOffset,
  }) async {
    try {
      final res = await _client.get<List<dynamic>>(
        '/ads',
        queryParameters: {'limit': limit, 'offset': offset},
      );
      return (res.data ?? [])
          .map((j) => AdModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<AdModel> getAdDetail(String adId) async {
    try {
      final res = await _client.get<Map<String, dynamic>>('/ads/$adId');
      return AdModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<AdModel> createAd({
    required String title,
    required String location,
    required DateTime matchDate,
    String? category,
    String? requiredLevel,
  }) async {
    try {
      final res = await _client.post<Map<String, dynamic>>(
        '/ads',
        data: {
          'title':         title,
          'location':      location,
          'matchDate':     matchDate.toUtc().toIso8601String(),
          if (category      != null) 'category':      category,
          if (requiredLevel != null) 'requiredLevel': requiredLevel,
        },
      );
      return AdModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<AdModel> updateAd(
    String adId, {
    required String title,
    required String location,
    required DateTime matchDate,
    String? category,
    String? requiredLevel,
  }) async {
    try {
      final res = await _client.patch<Map<String, dynamic>>(
        '/ads/$adId',
        data: {
          'title':         title,
          'location':      location,
          'matchDate':     matchDate.toUtc().toIso8601String(),
          if (category      != null) 'category':      category,
          if (requiredLevel != null) 'requiredLevel': requiredLevel,
        },
      );
      return AdModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<void> deleteAd(String adId) async {
    try {
      await _client.delete('/ads/$adId');
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION REPOSITORY
// ─────────────────────────────────────────────────────────────────────────────

final applicationRepositoryProvider = Provider<ApplicationRepository>(
  (ref) => ApplicationRepository(ref.read(apiClientProvider)),
);

final class ApplicationRepository {
  const ApplicationRepository(this._client);
  final ApiClient _client;

  Future<ApplicationModel> applyToAd(String adId) async {
    try {
      final res = await _client.post<Map<String, dynamic>>(
        '/ads/$adId/applications',
      );
      return ApplicationModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<List<ApplicationModel>> listApplications(String adId) async {
    try {
      final res = await _client.get<List<dynamic>>(
        '/ads/$adId/applications',
      );
      return (res.data ?? [])
          .map((j) => ApplicationModel.fromJson(j as Map<String, dynamic>))
          .toList();
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }

  Future<ApplicationModel> updateStatus(
    String adId,
    String applicationId,
    String status, // "approved" | "rejected"
  ) async {
    try {
      final res = await _client.patch<Map<String, dynamic>>(
        '/ads/$adId/applications/$applicationId',
        data: {'status': status},
      );
      return ApplicationModel.fromJson(res.data!);
    } on DioException catch (e) {
      throw parseApiError(e);
    }
  }
}
