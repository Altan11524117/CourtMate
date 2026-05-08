import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants.dart';
import '../../core/theme.dart';
import '../../providers/auth_provider.dart';
import '../../providers/ad_provider.dart';
import '../../routes/app_router.dart';
import '../../widgets/ad_card.dart';


class ListingsScreen extends ConsumerStatefulWidget {
  const ListingsScreen({super.key});

  @override
  ConsumerState<ListingsScreen> createState() => _ListingsScreenState();
}

class _ListingsScreenState extends ConsumerState<ListingsScreen> {
  final _searchController = TextEditingController();
  String? _selectedCategory;
  String _selectedSort = 'newest';

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _applyFilters() {
    ref.read(adSearchParamsProvider.notifier).state = AdSearchParams(
      category: _selectedCategory,
      location: _searchController.text.trim(),
      sort: _selectedSort,
    );
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final adState = ref.watch(adListProvider);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // ── Hero Header ────────────────────────────────────────────
          SliverToBoxAdapter(
            child: Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [Color(0xFF0F2318), Color(0xFF071610)],
                ),
              ),
              padding: const EdgeInsets.fromLTRB(24, 64, 24, 32),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // ── Nav row ─────────────────────────────────────
                  Row(
                    children: [
                      _buildLogo(),
                      const Spacer(),
                      if (authState.userId != null)
                        GestureDetector(
                          onTap: () => context.push(
                            '/profile/${authState.userId}',
                          ),
                          child: _AvatarCircle(userId: authState.userId!),
                        ),
                      const SizedBox(width: 12),
                      _PostAdButton(
                        onTap: () => context.push(AppRoutes.postAd),
                      ),
                    ],
                  ),
                  const SizedBox(height: 40),

                  // ── Headline ──────────────────────────────────────
                  Text(
                    'OPEN MATCHES',
                    style: AppTypography.overline.copyWith(
                      letterSpacing: 3,
                      color: AppColors.textMuted,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('Find your next', style: AppTypography.displayLarge),
                  Text(
                    'tennis match.',
                    style: AppTypography.displayAccent.copyWith(fontSize: 38),
                  ),
                  const SizedBox(height: 32),

                  // ── Search bar ────────────────────────────────────
                  _SearchBar(
                    controller: _searchController,
                    onSearch: _applyFilters,
                  ),
                  const SizedBox(height: 16),

                  // ── Category chips ────────────────────────────────
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        ...AppConstants.adCategories.map((cat) => Padding(
                              padding: const EdgeInsets.only(right: 8),
                              child: _CategoryChip(
                                label: cat,
                                selected: _selectedCategory == cat,
                                onTap: () {
                                  setState(() {
                                    _selectedCategory =
                                        _selectedCategory == cat ? null : cat;
                                  });
                                  _applyFilters();
                                },
                              ),
                            )),
                        const SizedBox(width: 8),
                        // Sort dropdown
                        _SortDropdown(
                          value: _selectedSort,
                          onChanged: (v) {
                            setState(() => _selectedSort = v ?? 'newest');
                            _applyFilters();
                          },
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),

          // ── Listings body ──────────────────────────────────────────
          adState.when(
            loading: () => const SliverFillRemaining(
              child: Center(
                child: CircularProgressIndicator(color: AppColors.primary),
              ),
            ),
            error: (e, _) => SliverFillRemaining(
              child: _EmptyOrError(
                icon: Icons.error_outline_rounded,
                title: 'Something went wrong',
                subtitle: e.toString(),
                actionLabel: 'Try Again',
                onAction: () => ref.read(adListProvider.notifier).refresh(),
              ),
            ),
            data: (ads) => ads.isEmpty
                ? SliverFillRemaining(
                    child: _EmptyOrError(
                      icon: Icons.sports_tennis_rounded,
                      title: 'No listings found',
                      subtitle:
                          'Try adjusting your filters or be the first to post a match!',
                      actionLabel: '+ Post a Listing',
                      onAction: () => context.push(AppRoutes.postAd),
                    ),
                  )
                : SliverPadding(
                    padding: const EdgeInsets.fromLTRB(20, 24, 20, 100),
                    sliver: SliverList.builder(
                      itemCount: ads.length,
                      itemBuilder: (ctx, i) => AdCard(
                        ad: ads[i],
                        onTap: () => context.push('/ads/${ads[i].id}'),
                      ),
                    ),
                  ),
          ),
        ],
      ),

      // ── FAB ─────────────────────────────────────────────────────────
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push(AppRoutes.postAd),
        backgroundColor: AppColors.primary,
        foregroundColor: Colors.white,
        icon: const Icon(Icons.add_rounded),
        label: Text('Post a Listing', style: AppTypography.labelLarge),
        elevation: 0,
      ),
    );
  }

  Widget _buildLogo() => Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: AppColors.primary,
              borderRadius: BorderRadius.circular(8),
            ),
            child: const Icon(Icons.sports_tennis_rounded,
                color: Colors.white, size: 18),
          ),
          const SizedBox(width: 8),
          RichText(
            text: TextSpan(children: [
              TextSpan(text: 'Court', style: AppTypography.headingSmall),
              TextSpan(
                  text: 'Mate',
                  style: AppTypography.headingSmall
                      .copyWith(color: AppColors.accent)),
            ]),
          ),
        ],
      );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-widgets
// ─────────────────────────────────────────────────────────────────────────────

class _PostAdButton extends StatelessWidget {
  const _PostAdButton({required this.onTap});
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
          decoration: BoxDecoration(
            border: Border.all(color: AppColors.accent.withValues(alpha: 0.6)),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.add, color: AppColors.accent, size: 16),
              const SizedBox(width: 4),
              Text('Post Ad',
                  style: AppTypography.labelLarge
                      .copyWith(color: AppColors.accent)),
            ],
          ),
        ),
      );
}

class _AvatarCircle extends StatelessWidget {
  const _AvatarCircle({required this.userId});
  final String userId;

  @override
  Widget build(BuildContext context) => Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: AppColors.primary.withValues(alpha: 0.3),
          shape: BoxShape.circle,
          border: Border.all(color: AppColors.primary, width: 1.5),
        ),
        child: Center(
          child: Text(
            userId[0].toUpperCase(),
            style: AppTypography.labelLarge.copyWith(color: AppColors.primary),
          ),
        ),
      );
}

class _SearchBar extends StatelessWidget {
  const _SearchBar({required this.controller, required this.onSearch});
  final TextEditingController controller;
  final VoidCallback onSearch;

  @override
  Widget build(BuildContext context) => Container(
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: AppColors.surfaceBorder),
        ),
        child: Row(
          children: [
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 14),
              child: Icon(Icons.location_on_outlined,
                  color: AppColors.textMuted, size: 18),
            ),
            Expanded(
              child: TextField(
                controller: controller,
                style: AppTypography.bodyLarge,
                decoration: InputDecoration(
                  hintText: 'Search by location...',
                  hintStyle: AppTypography.bodyMedium,
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: 14),
                  filled: false,
                ),
                onSubmitted: (_) => onSearch(),
              ),
            ),
            GestureDetector(
              onTap: onSearch,
              child: Container(
                margin: const EdgeInsets.all(6),
                padding:
                    const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text('Search', style: AppTypography.button),
              ),
            ),
          ],
        ),
      );
}

class _CategoryChip extends StatelessWidget {
  const _CategoryChip({
    required this.label,
    required this.selected,
    required this.onTap,
  });
  final String label;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => GestureDetector(
        onTap: onTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: selected
                ? AppColors.primary.withValues(alpha: 0.15)
                : Colors.transparent,
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

class _SortDropdown extends StatelessWidget {
  const _SortDropdown({required this.value, required this.onChanged});
  final String value;
  final ValueChanged<String?> onChanged;

  @override
  Widget build(BuildContext context) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.surfaceBorder),
        ),
        child: DropdownButtonHideUnderline(
          child: DropdownButton<String>(
            value: value,
            dropdownColor: AppColors.surfaceElevated,
            style: AppTypography.labelLarge,
            icon: const Icon(Icons.keyboard_arrow_down_rounded,
                color: AppColors.textMuted, size: 16),
            items: AppConstants.sortOptions.entries
                .map((e) => DropdownMenuItem(
                      value: e.key,
                      child: Text(e.value),
                    ))
                .toList(),
            onChanged: onChanged,
          ),
        ),
      );
}

class _EmptyOrError extends StatelessWidget {
  const _EmptyOrError({
    required this.icon,
    required this.title,
    this.subtitle,
    this.actionLabel,
    this.onAction,
  });
  final IconData icon;
  final String title;
  final String? subtitle;
  final String? actionLabel;
  final VoidCallback? onAction;

  @override
  Widget build(BuildContext context) => Center(
        child: Padding(
          padding: const EdgeInsets.all(40),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.surfaceBorder),
                ),
                child: Icon(icon, size: 40, color: AppColors.textMuted),
              ),
              const SizedBox(height: 20),
              Text(title,
                  style: AppTypography.headingMedium,
                  textAlign: TextAlign.center),
              if (subtitle != null) ...[
                const SizedBox(height: 8),
                Text(subtitle!,
                    style: AppTypography.bodyMedium,
                    textAlign: TextAlign.center),
              ],
              if (onAction != null && actionLabel != null) ...[
                const SizedBox(height: 28),
                GestureDetector(
                  onTap: onAction,
                  child: Container(
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 14),
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(actionLabel!, style: AppTypography.button),
                  ),
                ),
              ],
            ],
          ),
        ),
      );
}
