import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../providers/auth_provider.dart';

// Screen imports
import '../screens/auth/login_screen.dart';
import '../screens/auth/register_screen.dart';
import '../screens/auth/forgot_password_screen.dart';
import '../screens/auth/reset_password_screen.dart';
import '../screens/home/listings_screen.dart';
import '../screens/ad/ad_detail_screen.dart';
import '../screens/ad/post_ad_screen.dart';
import '../screens/exam/exam_intro_screen.dart';
import '../screens/exam/exam_question_screen.dart';
import '../screens/exam/exam_result_screen.dart';
import '../screens/profile/profile_screen.dart';
import '../screens/profile/edit_profile_screen.dart';
import '../screens/application/applications_screen.dart';

// ── Route name constants ───────────────────────────────────────────────────

abstract final class AppRoutes {
  static const login           = '/login';
  static const register        = '/register';
  static const forgotPassword  = '/forgot-password';
  static const resetPassword   = '/reset-password';
  static const listings        = '/';
  static const adDetail        = '/ads/:adId';
  static const postAd          = '/ads/new';
  static const editAd          = '/ads/:adId/edit';
  static const examIntro       = '/exam';
  static const examQuestion    = '/exam/questions';
  static const examResult      = '/exam/result';
  static const profile         = '/profile/:userId';
  static const editProfile     = '/profile/:userId/edit';
  static const applications    = '/ads/:adId/applications';
}

// ── Router provider ───────────────────────────────────────────────────────────

final routerProvider = Provider<GoRouter>((ref) {
  final authState = ref.watch(authProvider);

  return GoRouter(
    initialLocation: AppRoutes.listings,
    debugLogDiagnostics: true,
    redirect: (context, state) {
      final status = authState.status;

      // Still checking secure storage — show nothing
      if (status == AuthStatus.unknown) return null;

      final isAuthRoute = state.matchedLocation == AppRoutes.login      ||
                          state.matchedLocation == AppRoutes.register    ||
                          state.matchedLocation == AppRoutes.forgotPassword;

      if (status == AuthStatus.unauthenticated && !isAuthRoute) {
        return AppRoutes.login;
      }
      if (status == AuthStatus.authenticated && isAuthRoute) {
        return AppRoutes.listings;
      }
      return null;
    },
    routes: [
      // ── Auth ──────────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.login,
        name: 'login',
        builder: (_, __) => const LoginScreen(),
      ),
      GoRoute(
        path: AppRoutes.register,
        name: 'register',
        builder: (_, __) => const RegisterScreen(),
      ),
      GoRoute(
        path: AppRoutes.forgotPassword,
        name: 'forgotPassword',
        builder: (_, __) => const ForgotPasswordScreen(),
      ),
      GoRoute(
        path: AppRoutes.resetPassword,
        name: 'resetPassword',
        builder: (context, state) {
          final token = state.uri.queryParameters['token'] ?? '';
          return ResetPasswordScreen(token: token);
        },
      ),

      // ── Listings (home) ───────────────────────────────────────
      GoRoute(
        path: AppRoutes.listings,
        name: 'listings',
        builder: (_, __) => const ListingsScreen(),
      ),

      // ── Ad ────────────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.postAd,
        name: 'postAd',
        builder: (_, __) => const PostAdScreen(),
      ),
      GoRoute(
        path: AppRoutes.editAd,
        name: 'editAd',
        builder: (context, state) {
          final adId = state.pathParameters['adId']!;
          return PostAdScreen(editAdId: adId);
        },
      ),
      GoRoute(
        path: AppRoutes.adDetail,
        name: 'adDetail',
        builder: (context, state) {
          final adId = state.pathParameters['adId']!;
          return AdDetailScreen(adId: adId);
        },
      ),

      // ── Applications ──────────────────────────────────────────
      GoRoute(
        path: AppRoutes.applications,
        name: 'applications',
        builder: (context, state) {
          final adId = state.pathParameters['adId']!;
          return ApplicationsScreen(adId: adId);
        },
      ),

      // ── Exam ──────────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.examIntro,
        name: 'examIntro',
        builder: (_, __) => const ExamIntroScreen(),
      ),
      GoRoute(
        path: AppRoutes.examQuestion,
        name: 'examQuestion',
        builder: (_, __) => const ExamQuestionScreen(),
      ),
      GoRoute(
        path: AppRoutes.examResult,
        name: 'examResult',
        builder: (_, __) => const ExamResultScreen(),
      ),

      // ── Profile ───────────────────────────────────────────────
      GoRoute(
        path: AppRoutes.profile,
        name: 'profile',
        builder: (context, state) {
          final userId = state.pathParameters['userId']!;
          return ProfileScreen(userId: userId);
        },
      ),
      GoRoute(
        path: AppRoutes.editProfile,
        name: 'editProfile',
        builder: (context, state) {
          final userId = state.pathParameters['userId']!;
          return EditProfileScreen(userId: userId);
        },
      ),
    ],

    errorBuilder: (context, state) => const Scaffold(
      backgroundColor: Color(0xFF0A1A0F),
      body: Center(
        child: Text(
          'Page not found',
          style: TextStyle(color: Colors.white70),
        ),
      ),
    ),
  );
});
