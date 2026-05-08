import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/ad_model.dart';
import '../models/application_model.dart';
import '../repositories/ad_repository.dart';

// ─────────────────────────────────────────────────────────────────────────────
// AD PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

class AdSearchParams {
  const AdSearchParams({
    this.category,
    this.location,
    this.sort = 'newest',
  });

  final String? category;
  final String? location;
  final String sort;

  AdSearchParams copyWith({
    String? category,
    String? location,
    String? sort,
    bool clearCategory = false,
  }) =>
      AdSearchParams(
        category: clearCategory ? null : category ?? this.category,
        location: location ?? this.location,
        sort:     sort     ?? this.sort,
      );
}

// Holds search params so ListingsScreen can reactively rebuild on filter change
final adSearchParamsProvider =
    StateProvider<AdSearchParams>((ref) => const AdSearchParams());

final adListProvider =
    StateNotifierProvider<AdListNotifier, AsyncValue<List<AdModel>>>((ref) {
  final notifier = AdListNotifier(ref.read(adRepositoryProvider));
  // React to search param changes
  ref.listen<AdSearchParams>(adSearchParamsProvider, (_, params) {
    notifier.search(
      category: params.category,
      location: params.location,
      sort:     params.sort,
    );
  });
  notifier.search(); // initial load
  return notifier;
});

class AdListNotifier extends StateNotifier<AsyncValue<List<AdModel>>> {
  AdListNotifier(this._repo) : super(const AsyncLoading());

  final AdRepository _repo;

  Future<void> search({
    String? category,
    String? location,
    String sort = 'newest',
  }) async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(
      () => _repo.searchAds(category: category, location: location, sort: sort),
    );
  }

  Future<void> refresh() => search();

  /// Optimistically remove a deleted ad from the list.
  void removeAd(String adId) {
    state.whenData((ads) {
      state = AsyncData(ads.where((a) => a.id != adId).toList());
    });
  }
}

// Single ad detail
final adDetailProvider = StateNotifierProvider.family<AdDetailNotifier,
    AsyncValue<AdModel>, String>((ref, adId) {
  return AdDetailNotifier(ref.read(adRepositoryProvider), adId);
});

class AdDetailNotifier extends StateNotifier<AsyncValue<AdModel>> {
  AdDetailNotifier(this._repo, this._adId) : super(const AsyncLoading()) {
    fetch();
  }

  final AdRepository _repo;
  final String _adId;

  Future<void> fetch() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _repo.getAdDetail(_adId));
  }

  Future<bool> deleteAd() async {
    try {
      await _repo.deleteAd(_adId);
      return true;
    } catch (_) {
      return false;
    }
  }
}

// Post/Edit ad
final postAdProvider =
    StateNotifierProvider<PostAdNotifier, AsyncValue<AdModel?>>((ref) {
  return PostAdNotifier(ref.read(adRepositoryProvider));
});

class PostAdNotifier extends StateNotifier<AsyncValue<AdModel?>> {
  PostAdNotifier(this._repo) : super(const AsyncData(null));

  final AdRepository _repo;

  Future<AdModel?> createAd({
    required String title,
    required String location,
    required DateTime matchDate,
    String? category,
    String? requiredLevel,
  }) async {
    state = const AsyncLoading();
    final result = await AsyncValue.guard(
      () => _repo.createAd(
        title:         title,
        location:      location,
        matchDate:     matchDate,
        category:      category,
        requiredLevel: requiredLevel,
      ),
    );
    state = result;
    return result.valueOrNull;
  }

  void reset() => state = const AsyncData(null);
}

// ─────────────────────────────────────────────────────────────────────────────
// APPLICATION PROVIDER
// ─────────────────────────────────────────────────────────────────────────────

final applicationsProvider = StateNotifierProvider.family<
    ApplicationsNotifier,
    AsyncValue<List<ApplicationModel>>,
    String>((ref, adId) {
  return ApplicationsNotifier(
      ref.read(applicationRepositoryProvider), adId);
});

class ApplicationsNotifier
    extends StateNotifier<AsyncValue<List<ApplicationModel>>> {
  ApplicationsNotifier(this._repo, this._adId) : super(const AsyncLoading()) {
    fetch();
  }

  final ApplicationRepository _repo;
  final String _adId;

  Future<void> fetch() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _repo.listApplications(_adId));
  }

  Future<bool> applyToAd() async {
    try {
      await _repo.applyToAd(_adId);
      return true;
    } catch (_) {
      return false;
    }
  }

  Future<void> updateStatus(String applicationId, String status) async {
    try {
      final updated =
          await _repo.updateStatus(_adId, applicationId, status);
      state.whenData((apps) {
        state = AsyncData(
          apps.map((a) => a.id == applicationId ? updated : a).toList(),
        );
      });
    } catch (_) {}
  }
}
