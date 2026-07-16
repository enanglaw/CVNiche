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

  void _sendMessage() {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'content': text});
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
