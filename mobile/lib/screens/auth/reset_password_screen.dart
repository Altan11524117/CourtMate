import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../routes/app_router.dart';
import '../../widgets/exam_option_tile.dart';

class ResetPasswordScreen extends ConsumerStatefulWidget {
  const ResetPasswordScreen({super.key, required this.token});
  final String token;

  @override
  ConsumerState<ResetPasswordScreen> createState() =>
      _ResetPasswordScreenState();
}

class _ResetPasswordScreenState extends ConsumerState<ResetPasswordScreen> {
  final _passwordController = TextEditingController();
  final _confirmController  = TextEditingController();
  final _formKey            = GlobalKey<FormState>();
  bool _obscure1            = true;
  bool _obscure2            = true;
  bool _done                = false;

  @override
  void dispose() {
    _passwordController.dispose();
    _confirmController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    await ref.read(authProvider.notifier).confirmPasswordReset(
          token:       widget.token,
          newPassword: _passwordController.text,
        );
    if (mounted) setState(() => _done = true);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: _done ? _buildSuccess() : _buildForm(authState),
        ),
      ),
    );
  }

  Widget _buildForm(AuthState authState) => Form(
        key: _formKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 16),
            Text('New password', style: AppTypography.displayMedium),
            const SizedBox(height: 8),
            Text('Choose a strong password.', style: AppTypography.bodyMedium),
            const SizedBox(height: 40),
            CmTextField(
              controller: _passwordController,
              label: 'New Password',
              hint: 'At least 6 characters',
              obscureText: _obscure1,
              prefixIcon: Icons.lock_outline_rounded,
              suffixIcon: _obscure1
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              onSuffixTap: () => setState(() => _obscure1 = !_obscure1),
              validator: (v) {
                if (v == null || v.isEmpty) return 'Password is required';
                if (v.length < 6) return 'At least 6 characters';
                return null;
              },
            ),
            const SizedBox(height: 16),
            CmTextField(
              controller: _confirmController,
              label: 'Confirm Password',
              hint: '••••••••',
              obscureText: _obscure2,
              prefixIcon: Icons.lock_outline_rounded,
              suffixIcon: _obscure2
                  ? Icons.visibility_outlined
                  : Icons.visibility_off_outlined,
              onSuffixTap: () => setState(() => _obscure2 = !_obscure2),
              validator: (v) {
                if (v != _passwordController.text) {
                  return 'Passwords do not match';
                }
                return null;
              },
            ),
            const SizedBox(height: 32),
            CmButton(
              label: 'Update Password',
              isLoading: authState.isLoading,
              onPressed: _submit,
            ),
          ],
        ),
      );

  Widget _buildSuccess() => Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.primary.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppColors.primary.withOpacity(0.3)),
            ),
            child: Row(
              children: [
                const Icon(Icons.check_circle_outline,
                    color: AppColors.primary, size: 24),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Password updated successfully!',
                    style: AppTypography.bodyMedium
                        .copyWith(color: AppColors.textPrimary),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 24),
          CmButton(
            label: 'Sign In',
            onPressed: () => context.go(AppRoutes.login),
          ),
        ],
      );
}
