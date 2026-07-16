import 'package:flutter/material';
import 'chat_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  String _userPlan = 'FREE'; // Toggles between 'FREE' and 'PRO'
  
  // Communication Preference Toggles
  bool _notifyJobAlerts = true;
  bool _notifyMarketing = false;
  bool _notifyPromos = false;

  void _openSettingsBottomSheet() {
    showModalBottomSheet(
      context: context,
      backgroundColor: const Color(0xFF16161A),
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (BuildContext context, StateSetter setModalState) {
            return Container(
              padding: const EdgeInsets.all(20),
              child: SingleChildScrollView(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text(
                          'Account & Preferences',
                          style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: Colors.zinc),
                          onPressed: () => Navigator.pop(context),
                        )
                      ],
                    ),
                    const Divider(color: Colors.zinc),
                    const SizedBox(height: 12),

                    // Subscription Section
                    const Text('Subscription Status', style: TextStyle(color: Colors.zinc, fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.3),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.between,
                        children: [
                          Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                _userPlan == 'PRO' ? 'Pro Career Plan (\$3.99/mo)' : 'Free Tier Basic',
                                style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.bold),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                _userPlan == 'PRO' ? 'Renews automatically' : 'Limited features',
                                style: const TextStyle(color: Colors.zinc, fontSize: 10),
                              ),
                            ],
                          ),
                          _userPlan == 'PRO'
                              ? TextButton(
                                  style: TextButton.styleFrom(foregroundColor: Colors.redAccent),
                                  onPressed: () {
                                    setModalState(() {
                                      _userPlan = 'FREE';
                                    });
                                    setState(() {
                                      _userPlan = 'FREE';
                                    });
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Subscription canceled. Downgraded to Free.'),
                                        backgroundColor: Colors.redAccent,
                                      ),
                                    );
                                  },
                                  child: const Text('Cancel Plan'),
                                )
                              : ElevatedButton(
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: const Color(0xFF7C3AED),
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                                  ),
                                  onPressed: () {
                                    setModalState(() {
                                      _userPlan = 'PRO';
                                    });
                                    setState(() {
                                      _userPlan = 'PRO';
                                    });
                                    ScaffoldMessenger.of(context).showSnackBar(
                                      const SnackBar(
                                        content: Text('Upgraded to Pro (\$3.99/mo)'),
                                        backgroundColor: Colors.deepPurple,
                                      ),
                                    );
                                  },
                                  child: const Text('Go Pro', style: TextStyle(fontSize: 12, color: Colors.white)),
                                ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Preferences Section
                    const Text('Notification Preferences', style: TextStyle(color: Colors.zinc, fontSize: 12, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 8),

                    // Job Match Alerts Switch
                    SwitchListTile(
                      title: const Text('Job Match Alerts', style: TextStyle(color: Colors.white, fontSize: 13)),
                      subtitle: const Text('Notify when resume matches target jobs', style: TextStyle(color: Colors.zinc, fontSize: 10)),
                      value: _notifyJobAlerts,
                      activeColor: const Color(0xFF7C3AED),
                      onChanged: (bool val) {
                        setModalState(() {
                          _notifyJobAlerts = val;
                        });
                        setState(() {
                          _notifyJobAlerts = val;
                        });
                      },
                    ),

                    // Email Campaigns Switch
                    SwitchListTile(
                      title: const Text('Email Campaigns & Newsletters', style: TextStyle(color: Colors.white, fontSize: 13)),
                      subtitle: const Text('Receive career progression updates', style: TextStyle(color: Colors.zinc, fontSize: 10)),
                      value: _notifyMarketing,
                      activeColor: const Color(0xFF7C3AED),
                      onChanged: (bool val) {
                        setModalState(() {
                          _notifyMarketing = val;
                        });
                        setState(() {
                          _notifyMarketing = val;
                        });
                      },
                    ),

                    // Promos & Adverts Switch
                    SwitchListTile(
                      title: const Text('Promos & Advertisements', style: TextStyle(color: Colors.white, fontSize: 13)),
                      subtitle: const Text('Special discounts and marketing offers', style: TextStyle(color: Colors.zinc, fontSize: 10)),
                      value: _notifyPromos,
                      activeColor: const Color(0xFF7C3AED),
                      onChanged: (bool val) {
                        setModalState(() {
                          _notifyPromos = val;
                        });
                        setState(() {
                          _notifyPromos = val;
                        });
                      },
                    ),
                    
                    const SizedBox(height: 12),
                    SizedBox(
                      width: double.infinity,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF1F1F23),
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text('Preferences saved successfully!'),
                              backgroundColor: Colors.green,
                            ),
                          );
                        },
                        child: const Text('Save & Apply', style: TextStyle(color: Colors.white)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  void _onPremiumFeatureClick(String featureName) {
    if (_userPlan == 'FREE') {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: const Color(0xFF16161A),
          title: Row(
            children: [
              const Icon(Icons.lock_outline, color: Colors.deepPurpleAccent),
              const SizedBox(width: 8),
              Text(featureName, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: const Text(
            'This premium feature is locked on the Free tier. Upgrade to the Pro Career plan for just \$3.99/mo to unlock unlimited AI optimizations, portfolios, and LinkedIn audits.',
            style: TextStyle(color: Colors.zinc, fontSize: 13, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Maybe Later', style: TextStyle(color: Colors.zinc)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C3AED),
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                Navigator.pop(context);
                setState(() {
                  _userPlan = 'PRO';
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Successfully upgraded to Pro Career plan (\$3.99/mo)'),
                    backgroundColor: Colors.deepPurple,
                  ),
                );
              },
              child: const Text('Upgrade - \$3.99'),
            ),
          ],
        ),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Opening $featureName... (Pro Plan Active)')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text(
          'CVNiche AI',
          style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
        ),
        actions: [
          // Profile avatar opens settings panel
          GestureDetector(
            onTap: _openSettingsBottomSheet,
            child: Container(
              margin: const EdgeInsets.only(right: 16),
              alignment: Alignment.center,
              child: Stack(
                alignment: Alignment.bottomRight,
                children: [
                  CircleAvatar(
                    radius: 16,
                    backgroundColor: Colors.zinc[800],
                    child: const Icon(Icons.settings, size: 18, color: Colors.white70),
                  ),
                  Container(
                    padding: const EdgeInsets.all(2),
                    decoration: BoxDecoration(
                      color: _userPlan == 'PRO' ? Colors.green : Colors.zinc,
                      shape: BoxShape.circle,
                    ),
                    child: Text(
                      _userPlan == 'PRO' ? 'P' : 'F',
                      style: const TextStyle(fontSize: 6, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                  ),
                ],
              ),
            ),
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text(
                        'Welcome back, John!',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, py: 2),
                        decoration: BoxDecoration(
                          color: _userPlan == 'PRO' ? Colors.green[800] : Colors.zinc[700],
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '$_userPlan PLAN',
                          style: const TextStyle(fontSize: 8, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Your career DNA score is in the top 12% of software engineers. Continue your roadmap to unlock matching roles.',
                    style: TextStyle(fontSize: 12, color: Colors.white70, height: 1.4),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Upgrade Banner for Free Users
            if (_userPlan == 'FREE')
              Container(
                margin: const EdgeInsets.only(bottom: 24),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF7C3AED).withOpacity(0.1),
                  border: Border.all(color: const Color(0xFF7C3AED).withOpacity(0.3)),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.stars, color: Colors.deepPurpleAccent),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text('Unlock AI Superpowers', style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.bold)),
                          Text('Get unlimited resume tailoring, LinkedIn audits, and custom portfolios for only \$3.99/mo.', style: TextStyle(color: Colors.zinc[400], fontSize: 10, height: 1.3)),
                        ],
                      ),
                    ),
                    TextButton(
                      onPressed: () {
                        setState(() {
                          _userPlan = 'PRO';
                        });
                      },
                      child: const Text('Upgrade', style: TextStyle(color: Colors.deepPurpleAccent, fontSize: 12, fontWeight: FontWeight.bold)),
                    )
                  ],
                ),
              ),

            // Scoreboard Title
            const Text(
              'Your Readiness Scores',
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: Colors.zinc),
            ),
            const SizedBox(height: 12),

            // Scores Grid with tap interactions
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: [
                const ScoreCard(title: 'Resume Quality', score: '90%', change: '+3%'),
                const ScoreCard(title: 'ATS Match', score: '88%', change: '+1%'),
                GestureDetector(
                  onTap: () => _onPremiumFeatureClick('LinkedIn Optimization'),
                  child: ScoreCard(
                    title: 'LinkedIn Optimization', 
                    score: '82%', 
                    change: '+5%', 
                    isLocked: _userPlan == 'FREE',
                  ),
                ),
                GestureDetector(
                  onTap: () => _onPremiumFeatureClick('Portfolio Website'),
                  child: ScoreCard(
                    title: 'Portfolio Website', 
                    score: '91%', 
                    change: '+2%', 
                    isLocked: _userPlan == 'FREE',
                  ),
                ),
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
  final bool isLocked;

  const ScoreCard({
    super.key,
    required this.title,
    required this.score,
    required this.change,
    this.isLocked = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14.0),
      decoration: BoxDecoration(
        color: const Color(0xFF16161A),
        border: Border.all(color: isLocked ? Colors.deepPurpleAccent.withOpacity(0.3) : const Color(0xFF27272A)),
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
              if (isLocked)
                const Icon(Icons.lock, size: 10, color: Colors.deepPurpleAccent)
              else
                Text(
                  change,
                  style: const TextStyle(fontSize: 9, color: Colors.green, fontWeight: FontWeight.bold),
                ),
            ],
          ),
          Text(
            score,
            style: TextStyle(
              fontSize: 24, 
              fontWeight: FontWeight.bold, 
              color: isLocked ? Colors.white30 : Colors.white,
            ),
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
