import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants.dart';
import '../../core/theme.dart';
import '../../providers/ad_provider.dart';
import '../../providers/auth_provider.dart';
import '../../widgets/ad_card.dart';

class ListingsScreen extends ConsumerWidget {
  const ListingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final authState = ref.watch(authProvider);
    final adListState = ref.watch(adListProvider);
    final searchParams = ref.watch(adSearchParamsProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('CourtMate'),
        actions: [
          if (authState.userId != null)
            IconButton(
              icon: const Icon(Icons.person_outline),
              onPressed: () => context.push('/profile/${authState.userId}'),
            ),
        ],
      ),
      body: Column(
        children: [
          // ── Category Filters ──────────────────────────────────────
          SizedBox(
            height: 60,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              itemCount: AppConstants.adCategories.length + 1, // +1 for "All"
              itemBuilder: (context, index) {
                final isAll = index == 0;
                final category = isAll ? null : AppConstants.adCategories[index - 1];
                final isSelected = searchParams.category == category;

                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: FilterChip(
                    label: Text(isAll ? 'All' : category!),
                    selected: isSelected,
                    onSelected: (_) {
                      ref.read(adSearchParamsProvider.notifier).state =
                          searchParams.copyWith(
                        category: category,
                        clearCategory: isAll,
                      );
                    },
                    selectedColor: AppColors.primary.withValues(alpha: 0.2),
                    checkmarkColor: AppColors.primary,
                    backgroundColor: AppColors.surface,
                    side: BorderSide(
                      color: isSelected ? AppColors.primary : AppColors.surfaceBorder,
                    ),
                    labelStyle: TextStyle(
                      color: isSelected ? AppColors.primary : AppColors.textMuted,
                      fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
                    ),
                  ),
                );
              },
            ),
          ),

          // ── Ad List ───────────────────────────────────────────────
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => ref.read(adListProvider.notifier).refresh(),
              child: adListState.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (err, stack) => ListView(
                  physics: const AlwaysScrollableScrollPhysics(),
                  children: [
                    SizedBox(
                      height: MediaQuery.of(context).size.height * 0.6,
                      child: Center(
                        child: Text(
                          'Error loading ads:\n$err',
                          textAlign: TextAlign.center,
                          style: const TextStyle(color: AppColors.error),
                        ),
                      ),
                    ),
                  ],
                ),
                data: (ads) {
                  if (ads.isEmpty) {
                    return ListView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      children: [
                        SizedBox(
                          height: MediaQuery.of(context).size.height * 0.6,
                          child: const Center(
                            child: Text(
                              'No ads found in this category.\nTry creating one!',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: AppColors.textMuted),
                            ),
                          ),
                        ),
                      ],
                    );
                  }
                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: ads.length,
                    itemBuilder: (context, index) {
                      final ad = ads[index];
                      return AdCard(
                        ad: ad,
                        onTap: () => context.push('/ads/${ad.id}'),
                      );
                    },
                  );
                },
              ),
            ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/ads/new'),
        backgroundColor: AppColors.primary,
        child: const Icon(Icons.add, color: AppColors.background),
      ),
    );
  }
}
