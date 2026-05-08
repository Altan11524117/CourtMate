import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme.dart';
import '../../providers/user_provider.dart';
import '../../providers/auth_provider.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key, required this.userId});
  final String userId;

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _bioController = TextEditingController();
  String? _selectedHand;
  bool _isLoading = false;
  bool _initialized = false;

  @override
  void dispose() {
    _nameController.dispose();
    _bioController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    await ref.read(userProfileProvider(widget.userId).notifier).update(
          fullName: _nameController.text.trim(),
          preferredHand: _selectedHand,
          bio: _bioController.text.trim(),
        );

    if (mounted) {
      setState(() => _isLoading = false);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated!')),
      );
      context.pop();
    }
  }

  Future<void> _confirmDeleteAccount() async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceElevated,
        title: Text('Delete Account', style: AppTypography.headingSmall),
        content: Text(
          'This action is permanent and cannot be undone. All your data, listings, and applications will be removed.',
          style: AppTypography.bodyMedium,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: const Text('Cancel'),
          ),
          TextButton(
            onPressed: () => Navigator.pop(ctx, true),
            child: Text('Delete Account',
                style: AppTypography.labelLarge
                    .copyWith(color: AppColors.danger)),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await ref
          .read(userProfileProvider(widget.userId).notifier)
          .deleteAccount();
      await ref.read(authProvider.notifier).logout();
      if (mounted) context.go('/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    final profileState = ref.watch(userProfileProvider(widget.userId));

    // Initialize form fields once when data loads
    profileState.whenData((user) {
      if (!_initialized) {
        _nameController.text = user.fullName;
        _bioController.text = user.bio ?? '';
        _selectedHand = user.preferredHand;
        _initialized = true;
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: const Text('Edit Profile'),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => context.pop(),
        ),
        actions: [
          TextButton(
            onPressed: _isLoading ? null : _save,
            child: _isLoading
                ? const SizedBox(
                    width: 18,
                    height: 18,
                    child: CircularProgressIndicator(
                        strokeWidth: 2, color: AppColors.primary),
                  )
                : Text('Save',
                    style: AppTypography.labelLarge
                        .copyWith(color: AppColors.primary)),
          ),
        ],
      ),
      body: profileState.when(
        loading: () => const Center(
          child: CircularProgressIndicator(color: AppColors.primary),
        ),
        error: (e, _) => Center(
          child: Text('Error: $e', style: AppTypography.bodyMedium),
        ),
        data: (user) => Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(24),
            children: [
              // Avatar preview
              Center(
                child: Container(
                  width: 80,
                  height: 80,
                  decoration: BoxDecoration(
                    color: AppColors.primary.withValues(alpha: 0.2),
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: AppColors.primary.withValues(alpha: 0.5),
                      width: 2,
                    ),
                  ),
                  child: Center(
                    child: Text(
                      _nameController.text.isNotEmpty
                          ? _nameController.text[0].toUpperCase()
                          : '?',
                      style: AppTypography.displayMedium
                          .copyWith(color: AppColors.primary),
                    ),
                  ),
                ),
              ),
              const SizedBox(height: 32),

              // Full Name
              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person_outlined),
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Name is required'
                    : null,
              ),
              const SizedBox(height: 20),

              // Preferred Hand
              DropdownButtonFormField<String>(
                initialValue: _selectedHand,
                decoration: const InputDecoration(
                  labelText: 'Preferred Hand',
                  prefixIcon: Icon(Icons.back_hand_outlined),
                ),
                dropdownColor: AppColors.surfaceElevated,
                items: const [
                  DropdownMenuItem(value: 'Right', child: Text('Right')),
                  DropdownMenuItem(value: 'Left', child: Text('Left')),
                  DropdownMenuItem(
                      value: 'Ambidextrous', child: Text('Ambidextrous')),
                ],
                onChanged: (v) => setState(() => _selectedHand = v),
              ),
              const SizedBox(height: 20),

              // Bio
              TextFormField(
                controller: _bioController,
                maxLines: 4,
                maxLength: 300,
                decoration: const InputDecoration(
                  labelText: 'Bio',
                  hintText: 'Tell others about your playing style...',
                  prefixIcon: Padding(
                    padding: EdgeInsets.only(bottom: 60),
                    child: Icon(Icons.info_outline_rounded),
                  ),
                  alignLabelWithHint: true,
                ),
              ),
              const SizedBox(height: 40),

              // Current level (read-only)
              if (user.hasLevel)
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.surfaceBorder),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.leaderboard_outlined,
                          color: AppColors.primary),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Current Level',
                                style: AppTypography.overline),
                            const SizedBox(height: 4),
                            Text(user.level!,
                                style: AppTypography.headingSmall),
                          ],
                        ),
                      ),
                      Text('Via Exam', style: AppTypography.bodySmall),
                    ],
                  ),
                ),

              const SizedBox(height: 48),

              // Danger zone
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: AppColors.danger.withValues(alpha: 0.06),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(
                    color: AppColors.danger.withValues(alpha: 0.2),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('DANGER ZONE', style: AppTypography.overline),
                    const SizedBox(height: 12),
                    Text(
                      'Deleting your account will permanently remove all your data.',
                      style: AppTypography.bodySmall,
                    ),
                    const SizedBox(height: 16),
                    SizedBox(
                      width: double.infinity,
                      child: OutlinedButton.icon(
                        onPressed: _confirmDeleteAccount,
                        icon: const Icon(Icons.delete_forever_rounded,
                            color: AppColors.danger),
                        label: Text('Delete Account',
                            style: AppTypography.labelLarge
                                .copyWith(color: AppColors.danger)),
                        style: OutlinedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          side: BorderSide(
                            color: AppColors.danger.withValues(alpha: 0.4),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
