import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';

// ═══════════════════════════════════════════════════════════════════
//  CourtMate Design System — single source of truth
//  Mirrors the web app's CSS variables exactly.
//  Contains: AppColors · AppTypography · AppTheme
// ═══════════════════════════════════════════════════════════════════

// ── Colors ──────────────────────────────────────────────────────────

/// All color references in the app MUST go through this class —
/// never hardcode hex values.
abstract final class AppColors {
  // ── Backgrounds ───────────────────────────────────────────────
  static const background      = Color(0xFF0A1A0F); // near-black forest green
  static const surface         = Color(0xFF112218); // card/modal base
  static const surfaceElevated = Color(0xFF1A2E1F); // elevated cards
  static const surfaceBorder   = Color(0xFF2A3F2F); // dividers, input borders

  // ── Brand ─────────────────────────────────────────────────────
  static const primary      = Color(0xFF3D7A4A); // main green CTA
  static const primaryLight = Color(0xFF4D9A5A); // hover/pressed state
  static const primaryDark  = Color(0xFF2D5A35); // deep press

  static const accent      = Color(0xFFD4A843); // gold — brand text
  static const accentMuted = Color(0xFFB8922E); // secondary gold

  // ── Semantic ──────────────────────────────────────────────────
  static const success = Color(0xFF4CAF50);
  static const warning = Color(0xFFF59E0B);
  static const error   = Color(0xFFE53935);
  static const danger  = Color(0xFFB84040); // danger zone (account delete)

  // ── Text ──────────────────────────────────────────────────────
  static const textPrimary   = Color(0xFFE8F0E9);
  static const textSecondary = Color(0xFFAABBAA);
  static const textMuted     = Color(0xFF7A9B80);
  static const textDisabled  = Color(0xFF4A5E4A);

  // ── Difficulty badges (exam) ───────────────────────────────────
  static const difficultyEasy   = Color(0xFF4CAF50);
  static const difficultyMedium = Color(0xFFF59E0B);
  static const difficultyHard   = Color(0xFFE53935);

  // ── Level badges ──────────────────────────────────────────────
  static const levelBeginner     = Color(0xFF7A9B80);
  static const levelIntermediate = Color(0xFF4D9A5A);
  static const levelUpperInter   = Color(0xFFD4A843);
  static const levelAdvanced     = Color(0xFFE53935);
}

// ── Typography ──────────────────────────────────────────────────────

/// Typography scale — two-font system matching the web:
/// - Display: Cormorant Garamond (serif, italic for brand moments)
/// - Body: DM Sans (clean, slightly warm sans-serif)
abstract final class AppTypography {
  // ── Display (brand serif) ─────────────────────────────────────
  static TextStyle get displayLarge => GoogleFonts.cormorantGaramond(
        fontSize: 40,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimary,
        height: 1.1,
      );

  static TextStyle get displayAccent => GoogleFonts.cormorantGaramond(
        fontSize: 36,
        fontWeight: FontWeight.w600,
        fontStyle: FontStyle.italic,
        color: AppColors.accent,
        height: 1.1,
      );

  static TextStyle get displayMedium => GoogleFonts.cormorantGaramond(
        fontSize: 28,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimary,
        height: 1.2,
      );

  // ── Headings (DM Sans) ────────────────────────────────────────
  static TextStyle get headingLarge => GoogleFonts.dmSans(
        fontSize: 22,
        fontWeight: FontWeight.w700,
        color: AppColors.textPrimary,
        letterSpacing: -0.3,
      );

  static TextStyle get headingMedium => GoogleFonts.dmSans(
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        letterSpacing: -0.2,
      );

  static TextStyle get headingSmall => GoogleFonts.dmSans(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
      );

  // ── Body ──────────────────────────────────────────────────────
  static TextStyle get bodyLarge => GoogleFonts.dmSans(
        fontSize: 16,
        fontWeight: FontWeight.w400,
        color: AppColors.textPrimary,
        height: 1.5,
      );

  static TextStyle get bodyMedium => GoogleFonts.dmSans(
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: AppColors.textSecondary,
        height: 1.5,
      );

  static TextStyle get bodySmall => GoogleFonts.dmSans(
        fontSize: 12,
        fontWeight: FontWeight.w400,
        color: AppColors.textMuted,
        height: 1.4,
      );

  // ── Labels & UI ───────────────────────────────────────────────
  static TextStyle get labelLarge => GoogleFonts.dmSans(
        fontSize: 14,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        letterSpacing: 0.1,
      );

  static TextStyle get labelSmall => GoogleFonts.dmSans(
        fontSize: 11,
        fontWeight: FontWeight.w500,
        color: AppColors.textMuted,
        letterSpacing: 0.8,
      );

  static TextStyle get overline => GoogleFonts.dmSans(
        fontSize: 10,
        fontWeight: FontWeight.w600,
        color: AppColors.textMuted,
        letterSpacing: 1.5,
      );

  // ── Button ────────────────────────────────────────────────────
  static TextStyle get button => GoogleFonts.dmSans(
        fontSize: 15,
        fontWeight: FontWeight.w600,
        color: AppColors.textPrimary,
        letterSpacing: 0.2,
      );
}

// ── Theme ────────────────────────────────────────────────────────────

/// Material [ThemeData] configured for CourtMate dark mode.
/// Usage: `theme: AppTheme.dark` in MaterialApp.
final class AppTheme {
  AppTheme._();

  static ThemeData get dark => ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primary,

        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.accent,
          surface: AppColors.surface,
          error: AppColors.error,
          onPrimary: AppColors.textPrimary,
          onSecondary: AppColors.background,
          onSurface: AppColors.textPrimary,
          onError: AppColors.textPrimary,
          outline: AppColors.surfaceBorder,
        ),

        // ── AppBar ────────────────────────────────────────────────
        appBarTheme: AppBarTheme(
          backgroundColor: AppColors.background,
          elevation: 0,
          scrolledUnderElevation: 0,
          centerTitle: false,
          systemOverlayStyle: SystemUiOverlayStyle.light,
          titleTextStyle: AppTypography.headingMedium,
          iconTheme: const IconThemeData(color: AppColors.textPrimary),
        ),

        // ── Cards ─────────────────────────────────────────────────
        cardTheme: CardThemeData(
          color: AppColors.surface,
          elevation: 0,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(color: AppColors.surfaceBorder, width: 1),
          ),
          margin: EdgeInsets.zero,
        ),

        // ── Input fields ──────────────────────────────────────────
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: AppColors.surface,
          contentPadding:
              const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: AppColors.surfaceBorder),
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: AppColors.surfaceBorder),
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide:
                const BorderSide(color: AppColors.primary, width: 1.5),
          ),
          errorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide: const BorderSide(color: AppColors.error),
          ),
          focusedErrorBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(12),
            borderSide:
                const BorderSide(color: AppColors.error, width: 1.5),
          ),
          hintStyle: AppTypography.bodyMedium,
          labelStyle: AppTypography.bodyMedium,
          errorStyle:
              AppTypography.bodySmall.copyWith(color: AppColors.error),
          prefixIconColor: AppColors.textMuted,
          suffixIconColor: AppColors.textMuted,
        ),

        // ── Elevated Button (primary CTA) ─────────────────────────
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textPrimary,
            disabledBackgroundColor: AppColors.surfaceBorder,
            disabledForegroundColor: AppColors.textDisabled,
            elevation: 0,
            padding:
                const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            textStyle: AppTypography.button,
          ),
        ),

        // ── Outlined Button (secondary) ───────────────────────────
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: AppColors.textPrimary,
            side: const BorderSide(color: AppColors.surfaceBorder),
            padding:
                const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            textStyle: AppTypography.button,
          ),
        ),

        // ── Text Button ───────────────────────────────────────────
        textButtonTheme: TextButtonThemeData(
          style: TextButton.styleFrom(
            foregroundColor: AppColors.primary,
            textStyle: AppTypography.labelLarge,
          ),
        ),

        // ── Chip (category filters) ───────────────────────────────
        chipTheme: ChipThemeData(
          backgroundColor: AppColors.surface,
          selectedColor: AppColors.primary,
          disabledColor: AppColors.surfaceBorder,
          labelStyle: AppTypography.labelLarge,
          side: const BorderSide(color: AppColors.surfaceBorder),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        ),

        // ── Bottom Navigation ─────────────────────────────────────
        navigationBarTheme: NavigationBarThemeData(
          backgroundColor: AppColors.surface,
          indicatorColor: AppColors.primary.withValues(alpha: 0.2),
          iconTheme: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return const IconThemeData(color: AppColors.primary);
            }
            return const IconThemeData(color: AppColors.textMuted);
          }),
          labelTextStyle: WidgetStateProperty.resolveWith((states) {
            if (states.contains(WidgetState.selected)) {
              return AppTypography.labelSmall
                  .copyWith(color: AppColors.primary);
            }
            return AppTypography.labelSmall;
          }),
        ),

        // ── Divider ───────────────────────────────────────────────
        dividerTheme: const DividerThemeData(
          color: AppColors.surfaceBorder,
          thickness: 1,
          space: 1,
        ),

        // ── Snackbar ──────────────────────────────────────────────
        snackBarTheme: SnackBarThemeData(
          backgroundColor: AppColors.surfaceElevated,
          contentTextStyle: AppTypography.bodyMedium.copyWith(
            color: AppColors.textPrimary,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          behavior: SnackBarBehavior.floating,
        ),

        // ── Text ──────────────────────────────────────────────────
        textTheme: GoogleFonts.dmSansTextTheme(
                ThemeData.dark().textTheme)
            .copyWith(
          displayLarge: AppTypography.displayLarge,
          displayMedium: AppTypography.displayMedium,
          headlineLarge: AppTypography.headingLarge,
          headlineMedium: AppTypography.headingMedium,
          headlineSmall: AppTypography.headingSmall,
          bodyLarge: AppTypography.bodyLarge,
          bodyMedium: AppTypography.bodyMedium,
          bodySmall: AppTypography.bodySmall,
          labelLarge: AppTypography.labelLarge,
          labelSmall: AppTypography.labelSmall,
        ),

        // ── Progress indicator ────────────────────────────────────
        progressIndicatorTheme: const ProgressIndicatorThemeData(
          color: AppColors.primary,
          linearTrackColor: AppColors.surfaceBorder,
        ),
      );
}
