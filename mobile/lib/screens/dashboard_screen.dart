import 'package:flutter/material';
import 'chat_screen.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'CVNiche AI',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_none, color: Colors.zinc),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Welcome Card
            Container(
              padding: const EdgeInsets.all(20.0),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF5B21B6), Color(0xFF312E81)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Welcome back, John!',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Your career DNA score is in the top 12% of software engineers. Continue your roadmap to unlock matching roles.',
                    style: TextStyle(fontSize: 12, color: Colors.white70, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Scoreboard Title
            const Text(
              'Your Readiness Scores',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.zinc),
            ),
            const SizedBox(height: 12),

            // Scores Grid
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: const [
                ScoreCard(title: 'Resume Quality', score: '90%', change: '+3%'),
                ScoreCard(title: 'ATS Match', score: '88%', change: '+1%'),
                ScoreCard(title: 'LinkedIn optimization', score: '82%', change: '+5%'),
                ScoreCard(title: 'Portfolio readiness', score: '91%', change: '+2%'),
              ],
            ),
            const SizedBox(height: 24),

            // Skill Gaps
            const Text(
              'Target Skill Gaps',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.zinc),
            ),
            const SizedBox(height: 12),
            const GapItem(skill: 'Kubernetes', gap: 0.85, level: 'Critical'),
            const GapItem(skill: 'GraphQL APIs', gap: 0.60, level: 'Medium'),
            const GapItem(skill: 'System Design', gap: 0.90, level: 'Critical'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF7C3AED),
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => const ChatScreen()),
          );
        },
        child: const Icon(Icons.chat_bubble_outline, color: Colors.white),
      ),
    );
  }
}

class ScoreCard extends StatelessWidget {
  final String title;
  final String score;
  final String change;

  const ScoreCard({
    super.key,
    required this.title,
    required this.score,
    required this.change,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: const Color(0xFF16161A),
        border: Border.all(color: const Color(0xFF27272A)),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              Expanded(
                child: Text(
                  title,
                  style: const TextStyle(fontSize: 10, color: Colors.zinc, fontWeight: FontWeight.bold),
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              Text(
                change,
                style: const TextStyle(fontSize: 9, color: Colors.green, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          Text(
            score,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white),
          ),
        ],
      ),
    );
  }
}

class GapItem extends StatelessWidget {
  final String skill;
  final double gap;
  final String level;

  const GapItem({
    super.key,
    required this.skill,
    required this.gap,
    required this.level,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8.0),
      padding: const EdgeInsets.all(12.0),
      decoration: BoxDecoration(
        color: const Color(0xFF16161A),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.between,
        children: [
          Text(
            skill,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
          ),
          Row(
            children: [
              SizedBox(
                width: 80,
                child: LinearProgressIndicator(
                  value: gap,
                  backgroundColor: Colors.zinc[900],
                  valueColor: const AlwaysStoppedAnimation<Color>(Colors.redAccent),
                  minHeight: 4,
                ),
              ),
              const SizedBox(width: 10),
              Text(
                level,
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: level == 'Critical' ? Colors.redAccent : Colors.orangeAccent,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
