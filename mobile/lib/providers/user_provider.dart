import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../repositories/user_repository.dart';

final userProfileProvider = StateNotifierProvider.family<UserProfileNotifier,
    AsyncValue<UserModel>, String>((ref, userId) {
  return UserProfileNotifier(ref.read(userRepositoryProvider), userId);
});

class UserProfileNotifier extends StateNotifier<AsyncValue<UserModel>> {
  UserProfileNotifier(this._repo, this._userId) : super(const AsyncLoading()) {
    fetch();
  }

  final UserRepository _repo;
  final String _userId;

  Future<void> fetch() async {
    state = const AsyncLoading();
    state = await AsyncValue.guard(() => _repo.getProfile(_userId));
  }

  Future<void> update({
    required String fullName,
    String? preferredHand,
    required String bio,
  }) async {
    try {
      final updated = await _repo.updateProfile(
        _userId,
        fullName:      fullName,
        preferredHand: preferredHand,
        bio:           bio,
      );
      state = AsyncData(updated);
    } catch (e, st) {
      state = AsyncError(e, st);
    }
  }

  Future<void> deleteAccount() async {
    await _repo.deleteAccount(_userId);
  }
}
