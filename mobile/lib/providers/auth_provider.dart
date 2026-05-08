import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../repositories/auth_repository.dart';

// ─────────────────────────────────────────────────────────────────────────────
// AUTH STATE
// ─────────────────────────────────────────────────────────────────────────────

enum AuthStatus { unknown, authenticated, unauthenticated }

class AuthState {
  const AuthState({
    this.status = AuthStatus.unknown,
    this.userId,
    this.errorMessage,
    this.isLoading = false,
  });

  final AuthStatus status;
  final String? userId;
  final String? errorMessage;
  final bool isLoading;

  bool get isAuthenticated => status == AuthStatus.authenticated;

  AuthState copyWith({
    AuthStatus? status,
    String? userId,
    String? errorMessage,
    bool? isLoading,
  }) =>
      AuthState(
        status:       status       ?? this.status,
        userId:       userId       ?? this.userId,
        errorMessage: errorMessage,
        isLoading:    isLoading    ?? this.isLoading,
      );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH NOTIFIER
// ─────────────────────────────────────────────────────────────────────────────

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(ref.read(authRepositoryProvider))..init();
});

class AuthNotifier extends StateNotifier<AuthState> {
  AuthNotifier(this._repo) : super(const AuthState());

  final AuthRepository _repo;

  /// Called on app start — checks secure storage for existing token.
  Future<void> init() async {
    final isAuth = await _repo.isAuthenticated;
    if (isAuth) {
      final userId = await _repo.storedUserId;
      state = AuthState(
        status: AuthStatus.authenticated,
        userId: userId,
      );
    } else {
      state = const AuthState(status: AuthStatus.unauthenticated);
    }
  }

  Future<void> register({
    required String fullName,
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _repo.register(
        fullName: fullName,
        email:    email,
        password: password,
      );
      // After register, auto-login
      await login(email: email, password: password);
    } catch (e) {
      state = state.copyWith(
        isLoading:    false,
        status:       AuthStatus.unauthenticated,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> login({
    required String email,
    required String password,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      final userId = await _repo.login(email: email, password: password);
      state = AuthState(
        status: AuthStatus.authenticated,
        userId: userId,
      );
    } catch (e) {
      state = state.copyWith(
        isLoading:    false,
        status:       AuthStatus.unauthenticated,
        errorMessage: e.toString(),
      );
    }
  }

  Future<void> logout() async {
    await _repo.logout();
    state = const AuthState(status: AuthStatus.unauthenticated);
  }

  Future<void> requestPasswordReset(String email) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _repo.requestPasswordReset(email);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  Future<void> confirmPasswordReset({
    required String token,
    required String newPassword,
  }) async {
    state = state.copyWith(isLoading: true, errorMessage: null);
    try {
      await _repo.confirmPasswordReset(token: token, newPassword: newPassword);
      state = state.copyWith(isLoading: false);
    } catch (e) {
      state = state.copyWith(isLoading: false, errorMessage: e.toString());
    }
  }

  void clearError() => state = state.copyWith(errorMessage: null);
}
