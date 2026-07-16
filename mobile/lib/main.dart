import 'package:flutter/material';
import 'screens/dashboard_screen.dart';

void main() {
  runApp(const CVNicheApp());
}

class CVNicheApp extends StatelessWidget {
  const CVNicheApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'CVNiche AI',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        primarySwatch: Colors.violet,
        scaffoldBackgroundColor: const Color(0xFF0C0C0E),
        cardColor: const Color(0xFF16161A),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFF16161A),
          elevation: 0,
        ),
      ),
      home: const DashboardScreen(),
    );
  }
}
