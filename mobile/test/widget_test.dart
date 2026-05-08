import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile/main.dart';

void main() {
  testWidgets('CourtMateApp smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(
      const ProviderScope(child: CourtMateApp()),
    );

    // App should render without errors
    expect(find.byType(CourtMateApp), findsOneWidget);
  });
}
