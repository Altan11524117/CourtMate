import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../core/constants.dart';
import '../../core/theme.dart';
import '../../models/ad_model.dart';
import '../../providers/ad_provider.dart';
import '../../repositories/ad_repository.dart';

class PostAdScreen extends ConsumerStatefulWidget {
  const PostAdScreen({super.key, this.editAdId});

  /// When set, screen loads this ad and submits as PATCH.
  final String? editAdId;

  @override
  ConsumerState<PostAdScreen> createState() => _PostAdScreenState();
}

class _PostAdScreenState extends ConsumerState<PostAdScreen> {
  final _formKey = GlobalKey<FormState>();

  final _titleController = TextEditingController();
  final _locationController = TextEditingController();

  String? _selectedCategory;
  String? _selectedLevel;
  DateTime? _selectedDate;
  TimeOfDay? _selectedTime;

  bool _isLoading = false;
  bool _loadingDraft = false;
  bool _draftScheduled = false;

  bool get _isEditing => widget.editAdId != null;

  @override
  void initState() {
    super.initState();
    if (_isEditing) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted || _draftScheduled) return;
        _draftScheduled = true;
        _loadExistingAd();
      });
    }
  }

  Future<void> _loadExistingAd() async {
    final id = widget.editAdId;
    if (id == null) return;

    setState(() => _loadingDraft = true);
    try {
      final ad = await ref.read(adRepositoryProvider).getAdDetail(id);
      if (!mounted) return;
      _titleController.text = ad.title;
      _locationController.text = ad.location;
      _selectedCategory = ad.category;
      _selectedLevel = ad.requiredLevel;
      final local = ad.matchDate.toLocal();
      _selectedDate = DateTime(local.year, local.month, local.day);
      _selectedTime = TimeOfDay(hour: local.hour, minute: local.minute);
      setState(() {});
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Could not load listing: $e'),
            backgroundColor: AppColors.danger,
          ),
        );
        context.pop();
      }
    } finally {
      if (mounted) setState(() => _loadingDraft = false);
    }
  }

  @override
  void dispose() {
    _titleController.dispose();
    _locationController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final initial = _selectedDate ??
        DateTime.now().add(const Duration(days: 1));
    final firstDate =
        _isEditing ? DateTime(now.year - 1, 1, 1) : DateTime(now.year, now.month, now.day);
    final date = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: firstDate,
      lastDate: DateTime.now().add(const Duration(days: 90)),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.dark(
            primary: AppColors.primary,
            surface: AppColors.surfaceElevated,
          ),
        ),
        child: child!,
      ),
    );
    if (date != null) setState(() => _selectedDate = date);
  }

  Future<void> _pickTime() async {
    final time = await showTimePicker(
      context: context,
      initialTime: _selectedTime ?? const TimeOfDay(hour: 18, minute: 0),
      builder: (context, child) => Theme(
        data: Theme.of(context).copyWith(
          colorScheme: const ColorScheme.dark(
            primary: AppColors.primary,
            surface: AppColors.surfaceElevated,
          ),
        ),
        child: child!,
      ),
    );
    if (time != null) setState(() => _selectedTime = time);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedDate == null || _selectedTime == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select match date and time.')),
      );
      return;
    }

    setState(() => _isLoading = true);

    final matchDate = DateTime(
      _selectedDate!.year,
      _selectedDate!.month,
      _selectedDate!.day,
      _selectedTime!.hour,
      _selectedTime!.minute,
    ).toUtc();

    final AdModel? result;
    if (_isEditing) {
      result = await ref.read(postAdProvider.notifier).updateAd(
            widget.editAdId!,
            title: _titleController.text.trim(),
            location: _locationController.text.trim(),
            matchDate: matchDate,
            category: _selectedCategory,
            requiredLevel: _selectedLevel,
          );
    } else {
      result = await ref.read(postAdProvider.notifier).createAd(
            title: _titleController.text.trim(),
            location: _locationController.text.trim(),
            matchDate: matchDate,
            category: _selectedCategory,
            requiredLevel: _selectedLevel,
          );
    }

    if (mounted) {
      setState(() => _isLoading = false);
      if (result != null) {
        ref.invalidate(adDetailProvider(widget.editAdId ?? result.id));
        ref.read(adListProvider.notifier).refresh();
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(
              _isEditing
                  ? 'Listing updated successfully.'
                  : 'Listing posted successfully.',
            ),
          ),
        );
        context.pop();
      } else {
        final err = ref.read(postAdProvider).error;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error: $err'),
            backgroundColor: AppColors.danger,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_isEditing ? 'Edit Listing' : 'Post a Listing'),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: SafeArea(
        child: _loadingDraft && _isEditing
            ? const Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              )
            : Form(
                key: _formKey,
                child: ListView(
                  padding: const EdgeInsets.all(24),
                  children: [
              Text('Match Details', style: AppTypography.headingMedium),
              const SizedBox(height: 8),
              Text(
                'Fill in the details to find your perfect tennis partner.',
                style: AppTypography.bodyMedium,
              ),
              const SizedBox(height: 32),

              // Title
              TextFormField(
                controller: _titleController,
                decoration: const InputDecoration(
                  labelText: 'Listing Title',
                  hintText: 'e.g. Looking for a hitting partner',
                  prefixIcon: Icon(Icons.sports_tennis_rounded),
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Title is required'
                    : null,
              ),
              const SizedBox(height: 20),

              // Location
              TextFormField(
                controller: _locationController,
                decoration: const InputDecoration(
                  labelText: 'Location / Court',
                  hintText: 'e.g. Central Park Tennis Center',
                  prefixIcon: Icon(Icons.location_on_outlined),
                ),
                validator: (v) => v == null || v.trim().isEmpty
                    ? 'Location is required'
                    : null,
              ),
              const SizedBox(height: 20),

              // Category Dropdown
              DropdownButtonFormField<String>(
                key: ValueKey('cat_${_selectedCategory ?? 'none'}'),
                initialValue: _selectedCategory,
                decoration: const InputDecoration(
                  labelText: 'Match Category',
                  prefixIcon: Icon(Icons.category_outlined),
                ),
                dropdownColor: AppColors.surfaceElevated,
                items: AppConstants.adCategories
                    .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                    .toList(),
                onChanged: (v) => setState(() => _selectedCategory = v),
                validator: (v) => v == null ? 'Select a category' : null,
              ),
              const SizedBox(height: 20),

              // Level Dropdown
              DropdownButtonFormField<String?>(
                key: ValueKey('lvl_${_selectedLevel ?? 'any'}'),
                initialValue: _selectedLevel,
                decoration: const InputDecoration(
                  labelText: 'Required Level (Optional)',
                  prefixIcon: Icon(Icons.leaderboard_outlined),
                ),
                dropdownColor: AppColors.surfaceElevated,
                items: [
                  const DropdownMenuItem(value: null, child: Text('Any Level')),
                  ...AppConstants.levelLabels.keys.map(
                    (l) => DropdownMenuItem(
                        value: l, child: Text(AppConstants.levelLabels[l]!)),
                  ),
                ],
                onChanged: (v) => setState(() => _selectedLevel = v),
              ),
              const SizedBox(height: 32),

              Text('Date & Time', style: AppTypography.headingMedium),
              const SizedBox(height: 16),

              Row(
                children: [
                  // Date Picker
                  Expanded(
                    child: InkWell(
                      onTap: _pickDate,
                      borderRadius: BorderRadius.circular(12),
                      child: InputDecorator(
                        decoration: InputDecoration(
                          labelText: 'Match Date',
                          errorText: _selectedDate == null &&
                                  _formKey.currentState?.validate() == false
                              ? 'Required'
                              : null,
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.calendar_today_outlined,
                                color: AppColors.primary, size: 20),
                            const SizedBox(width: 12),
                            Text(
                              _selectedDate == null
                                  ? 'Select Date'
                                  : DateFormat('MMM dd, yyyy')
                                      .format(_selectedDate!),
                              style: AppTypography.bodyLarge.copyWith(
                                color: _selectedDate == null
                                    ? AppColors.textMuted
                                    : AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 16),

                  // Time Picker
                  Expanded(
                    child: InkWell(
                      onTap: _pickTime,
                      borderRadius: BorderRadius.circular(12),
                      child: InputDecorator(
                        decoration: InputDecoration(
                          labelText: 'Match Time',
                          errorText: _selectedTime == null &&
                                  _formKey.currentState?.validate() == false
                              ? 'Required'
                              : null,
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.access_time_rounded,
                                color: AppColors.primary, size: 20),
                            const SizedBox(width: 12),
                            Text(
                              _selectedTime == null
                                  ? 'Select Time'
                                  : _selectedTime!.format(context),
                              style: AppTypography.bodyLarge.copyWith(
                                color: _selectedTime == null
                                    ? AppColors.textMuted
                                    : AppColors.textPrimary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 48),

              // Submit
              SizedBox(
                height: 54,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _submit,
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                  child: _isLoading
                      ? const SizedBox(
                          width: 24,
                          height: 24,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : Text(
                          _isEditing ? 'Save Changes' : 'Post Listing',
                          style: AppTypography.button,
                        ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
