import 'package:flutter/material.dart';
import '../core/theme.dart';

// ─────────────────────────────────────────────────────────────────────────────
// CmLogo — top-left brand mark
// ─────────────────────────────────────────────────────────────────────────────

class CmLogo extends StatelessWidget {
  const CmLogo({super.key, this.size = 'normal'});
  final String size;

  @override
  Widget build(BuildContext context) {
    final iconSize = size == 'small' ? 28.0 : 36.0;
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Container(
          width: iconSize,
          height: iconSize,
          decoration: BoxDecoration(
            color: AppColors.primary,
            borderRadius: BorderRadius.circular(8),
          ),
          child: Icon(
            Icons.sports_tennis_rounded,
            color: Colors.white,
            size: iconSize * 0.6,
          ),
        ),
        const SizedBox(width: 8),
        RichText(
          text: TextSpan(
            children: [
              TextSpan(
                text: 'Court',
                style: AppTypography.headingMedium.copyWith(
                  fontSize: size == 'small' ? 16 : 20,
                ),
              ),
              TextSpan(
                text: 'Mate',
                style: AppTypography.headingMedium.copyWith(
                  fontSize: size == 'small' ? 16 : 20,
                  color: AppColors.accent,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CmButton — primary / outlined / danger variants
// ─────────────────────────────────────────────────────────────────────────────

enum CmButtonVariant { primary, outlined, danger }

class CmButton extends StatelessWidget {
  const CmButton({
    super.key,
    required this.label,
    this.onPressed,
    this.isLoading = false,
    this.variant = CmButtonVariant.primary,
    this.icon,
    this.fullWidth = true,
  });

  final String label;
  final VoidCallback? onPressed;
  final bool isLoading;
  final CmButtonVariant variant;
  final IconData? icon;
  final bool fullWidth;

  @override
  Widget build(BuildContext context) {
    Widget child = isLoading
        ? const SizedBox(
            width: 20,
            height: 20,
            child: CircularProgressIndicator(
              strokeWidth: 2,
              valueColor: AlwaysStoppedAnimation(Colors.white),
            ),
          )
        : Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              if (icon != null) ...[
                Icon(icon, size: 18),
                const SizedBox(width: 8),
              ],
              Text(label, style: AppTypography.button),
            ],
          );

    final button = switch (variant) {
      CmButtonVariant.primary => ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          child: child,
        ),
      CmButtonVariant.outlined => OutlinedButton(
          onPressed: isLoading ? null : onPressed,
          child: child,
        ),
      CmButtonVariant.danger => ElevatedButton(
          onPressed: isLoading ? null : onPressed,
          style: ElevatedButton.styleFrom(
            backgroundColor: AppColors.danger,
            foregroundColor: Colors.white,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            padding:
                const EdgeInsets.symmetric(horizontal: 24, vertical: 14),
          ),
          child: child,
        ),
    };

    return fullWidth
        ? SizedBox(width: double.infinity, child: button)
        : button;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CmTextField — styled input field
// ─────────────────────────────────────────────────────────────────────────────

class CmTextField extends StatelessWidget {
  const CmTextField({
    super.key,
    required this.controller,
    required this.label,
    this.hint,
    this.validator,
    this.keyboardType,
    this.obscureText = false,
    this.prefixIcon,
    this.suffixIcon,
    this.onSuffixTap,
    this.maxLines = 1,
    this.enabled = true,
    this.onChanged,
  });

  final TextEditingController controller;
  final String label;
  final String? hint;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;
  final bool obscureText;
  final IconData? prefixIcon;
  final IconData? suffixIcon;
  final VoidCallback? onSuffixTap;
  final int maxLines;
  final bool enabled;
  final ValueChanged<String>? onChanged;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: AppTypography.labelLarge),
        const SizedBox(height: 8),
        TextFormField(
          controller: controller,
          validator: validator,
          keyboardType: keyboardType,
          obscureText: obscureText,
          maxLines: maxLines,
          enabled: enabled,
          onChanged: onChanged,
          style: AppTypography.bodyLarge,
          decoration: InputDecoration(
            hintText: hint,
            prefixIcon: prefixIcon != null ? Icon(prefixIcon) : null,
            suffixIcon: suffixIcon != null
                ? GestureDetector(
                    onTap: onSuffixTap,
                    child: Icon(suffixIcon),
                  )
                : null,
          ),
        ),
      ],
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CategoryChip — filter chip for listings
// ─────────────────────────────────────────────────────────────────────────────

class CategoryChip extends StatelessWidget {
  const CategoryChip({
    super.key,
    required this.label,
    required this.selected,
    required this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding:
            const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: BoxDecoration(
          color: selected
              ? AppColors.primary.withOpacity(0.15)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: selected ? AppColors.primary : AppColors.surfaceBorder,
            width: selected ? 1.5 : 1,
          ),
        ),
        child: Text(
          label,
          style: AppTypography.labelLarge.copyWith(
            color: selected ? AppColors.primary : AppColors.textSecondary,
          ),
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CmEmptyState — empty list placeholder
// ─────────────────────────────────────────────────────────────────────────────

class CmEmptyState extends StatelessWidget {
  const CmEmptyState({
    super.key,
    required this.title,
    this.subtitle,
    this.icon = Icons.sports_tennis_rounded,
    this.action,
    this.actionLabel,
  });

  final String title;
  final String? subtitle;
  final IconData icon;
  final VoidCallback? action;
  final String? actionLabel;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: AppColors.surfaceBorder),
                ),
                child: Icon(icon, size: 40, color: AppColors.textMuted),
              ),
              const SizedBox(height: 20),
              Text(title,
                  style: AppTypography.headingSmall,
                  textAlign: TextAlign.center),
              if (subtitle != null) ...[
                const SizedBox(height: 8),
                Text(subtitle!,
                    style: AppTypography.bodyMedium,
                    textAlign: TextAlign.center),
              ],
              if (action != null && actionLabel != null) ...[
                const SizedBox(height: 24),
                CmButton(
                  label: actionLabel!,
                  onPressed: action,
                  fullWidth: false,
                ),
              ],
            ],
          ),
        ),
      );
}

// ─────────────────────────────────────────────────────────────────────────────
// CmErrorState — error display with retry
// ─────────────────────────────────────────────────────────────────────────────

class CmErrorState extends StatelessWidget {
  const CmErrorState({super.key, required this.message, this.onRetry});
  final String message;
  final VoidCallback? onRetry;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.error_outline_rounded,
                  size: 48, color: AppColors.error),
              const SizedBox(height: 16),
              Text('Something went wrong',
                  style: AppTypography.headingSmall),
              const SizedBox(height: 8),
              Text(message,
                  style: AppTypography.bodyMedium,
                  textAlign: TextAlign.center),
              if (onRetry != null) ...[
                const SizedBox(height: 24),
                CmButton(
                  label: 'Try Again',
                  onPressed: onRetry,
                  fullWidth: false,
                ),
              ],
            ],
          ),
        ),
      );
}
