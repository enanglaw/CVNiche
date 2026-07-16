import 'package:flutter/material';

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final List<Map<String, String>> _messages = [
    {
      'role': 'model',
      'content': 'Hello John! I am NicheCoach, your mobile career advisor. How can I help you optimize your resume, prepare for interviews, or check skill gaps today?'
    }
  ];
  final TextEditingController _controller = TextEditingController();
  
  // Enforces feature segregation in AI Coach chat
  int _userMessageCount = 0;
  bool _isPro = false;

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    if (!_isPro && _userMessageCount >= 2) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          backgroundColor: const Color(0xFF16161A),
          title: Row(
            children: [
              const Icon(Icons.lock_outline, color: Colors.deepPurpleAccent),
              const SizedBox(width: 8),
              const Text('AI Limit Reached', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
            ],
          ),
          content: const Text(
            'You have reached your Free daily limit of 2 messages with NicheCoach. Upgrade to the Pro Career plan for \$3.99/mo to unlock unlimited AI consulting.',
            style: TextStyle(color: Colors.zinc, fontSize: 13, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close', style: TextStyle(color: Colors.zinc)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF7C3AED),
                foregroundColor: Colors.white,
              ),
              onPressed: () {
                Navigator.pop(context);
                setState(() {
                  _isPro = true;
                });
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('Upgraded to Pro Career plan (\$3.99/mo)'),
                    backgroundColor: Colors.deepPurple,
                  ),
                );
              },
              child: const Text('Upgrade - \$3.99'),
            ),
          ],
        ),
      );
      return;
    }

    setState(() {
      _messages.add({'role': 'user', 'content': text});
      _userMessageCount++;
      _controller.clear();
    });

    // Simulate AI response delay
    Future.delayed(const Duration(milliseconds: 1000), () {
      setState(() {
        if (text.toLowerCase().contains('amazon')) {
          _messages.add({
            'role': 'model',
            'content': 'To prepare for Amazon interviews, you need to study Leadership Principles (LPs) like Customer Obsession and Ownership. Master STAR format templates for behavioral scenarios.'
          });
        } else {
          _messages.add({
            'role': 'model',
            'content': 'That sounds like a great question. Let\'s evaluate your skill metrics and map out target actions to improve in that area.'
          });
        }
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('NicheCoach AI', style: TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            alignment: Alignment.center,
            child: Text(
              _isPro ? 'PRO ACTIVE' : 'FREE VERSION',
              style: TextStyle(
                fontSize: 9, 
                fontWeight: FontWeight.bold, 
                color: _isPro ? Colors.green : Colors.orangeAccent
              ),
            ),
          )
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16.0),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12.0),
                    padding: const EdgeInsets.symmetric(horizontal: 14.0, vertical: 10.0),
                    decoration: BoxDecoration(
                      color: isUser ? const Color(0xFF7C3AED) : const Color(0xFF16161A),
                      borderRadius: BorderRadius.only(
                        topLeft: const Radius.circular(12),
                        topRight: const Radius.circular(12),
                        bottomLeft: isUser ? const Radius.circular(12) : Radius.zero,
                        bottomRight: isUser ? Radius.zero : const Radius.circular(12),
                      ),
                      border: isUser ? null : Border.all(color: const Color(0xFF27272A)),
                    ),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
                    child: Text(
                      msg['content']!,
                      style: const TextStyle(fontSize: 12, color: Colors.white, height: 1.4),
                    ),
                  ),
                );
              },
            ),
          ),
          
          // Input bar
          Container(
            padding: const EdgeInsets.all(12.0),
            color: const Color(0xFF16161A),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      decoration: const InputDecoration(
                        hintText: 'Ask NicheCoach...',
                        hintStyle: TextStyle(color: Colors.zinc, fontSize: 12),
                        border: InputBorder.none,
                      ),
                      style: const TextStyle(color: Colors.white, fontSize: 12),
                      onSubmitted: (_) => _sendMessage(),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send, color: Color(0xFF7C3AED)),
                    onPressed: _sendMessage,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
