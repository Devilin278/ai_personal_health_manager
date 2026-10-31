import React, { useState } from 'react';
import {
  BotMessageSquare,
  Sparkles,
  HelpCircle,
  FileSearch,
  ShieldAlert,
  Send,
  Volume2,
  CheckCircle2,
  ArrowRight,
  Pill,
  BookOpen,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  category?: 'explanation' | 'questions' | 'safety';
  suggestedQuestions?: string[];
}

export const AssistantView: React.FC = () => {
  const { profile, medications, appointments, healthRecords, speakText } = useHealth();

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${profile.preferredName}! I am your CareCompanion Health Information Assistant. I am here to help translate dense medical lab jargon into simple language, generate thoughtful questions for your upcoming doctor appointments, and explain general health terms.`,
      time: 'Just now',
    },
    {
      id: 'msg-2',
      sender: 'assistant',
      text: `You have an upcoming appointment with ${appointments[0]?.providerName || 'your doctor'}. Would you like me to prepare a tailored question checklist for that visit? Or would you like me to explain any terms from your recent lab bloodwork?`,
      time: 'Just now',
      suggestedQuestions: [
        'Prepare 5 questions for my upcoming cardiology appointment',
        'Explain my HbA1c 6.2% and LDL 84 mg/dL test results in plain terms',
        'What should I ask my pharmacist about my supplements?',
        'What is an ACE inhibitor and why was Lisinopril prescribed?',
      ],
    },
  ]);

  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputQuery).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    // AI Response Simulation with clinical grounding & safety guardrails
    setTimeout(() => {
      let reply = '';
      const textLower = text.toLowerCase();

      if (textLower.includes('cardiology') || textLower.includes('question') || textLower.includes('appointment')) {
        reply = `Here are 4 focused questions tailored for your visit with Dr. Robert Vance:

1. **Blood Pressure Range:** "My home morning blood pressure averages around 124/78 mmHg. Is that right where you want it, or would you like me to target anything different?"
2. **Medication Tolerance:** "I have been taking Lisinopril 10mg every morning and Metformin with dinner. Are there any specific signs of dizziness or side effects I should watch for?"
3. **Knee Joint Comfort:** "I have noticed a bit of morning knee stiffness when getting out of bed. Does that align with my mild osteoarthritis, and are there safe stretches you recommend?"
4. **Routine Immunizations:** "Are any routine booster vaccines due for me this season?"

💡 *Tip:* You can check these off in your **Doctor Appointments** checklist tab!`;
      } else if (textLower.includes('hba1c') || textLower.includes('bloodwork') || textLower.includes('ldl') || textLower.includes('lab')) {
        reply = `Here is a plain-language explanation of your recent lab report from Memorial Health:

• **HbA1c (6.2%):** This represents your average blood sugar over the past 2 to 3 months. Normal is under 5.7%, and pre-diabetes is between 5.7% and 6.4%. Your 6.2% reading shows good, steady management within your target range!
• **LDL Bad Cholesterol (84 mg/dL):** This measures "low-density lipoprotein," often called the cholesterol that can build plaque. Doctors recommend older adults stay under 100 mg/dL, so 84 is a very positive result showing your medication is effective.
• **eGFR Kidney Filtration (78 mL/min):** This measures how efficiently your kidneys filter waste from your bloodstream. Above 60 is considered healthy kidney function for older adults.

*Important:* Always review official laboratory reports directly with Dr. Vance at your visit.`;
      } else if (textLower.includes('pharmacist') || textLower.includes('supplement') || textLower.includes('interaction')) {
        reply = `**Safe Pharmacist Consultation Guide:**

General AI assistants should never be relied upon to approve drug safety or declare supplement combinations safe. Clinical references maintained by pharmacists are the gold standard.

Here are 3 essential questions to ask your pharmacist at Walgreens:
1. "I am currently taking Lisinopril for blood pressure, Metformin for blood sugar, and CoQ10 plus Calcium D3 supplements. Do any of these interfere with each other or with my meals?"
2. "Should I separate my calcium supplement from my morning blood pressure medication by a couple of hours?"
3. "Are there any over-the-counter pain relievers or cold medicines I should avoid taking with my prescriptions?"`;
      } else if (textLower.includes('lisinopril') || textLower.includes('ace inhibitor')) {
        reply = `**What is Lisinopril and how does it help?**

Lisinopril belongs to a trusted class of medicines called **ACE inhibitors** (Angiotensin-Converting Enzyme inhibitors). 

• **How it works:** It gently relaxes and widens your blood vessels so your heart doesn't have to pump against high resistance. This lowers your blood pressure and protects your kidneys and heart over the long term.
• **Common guidance:** Take it once daily in the morning with a full glass of water. If you ever feel lightheaded when standing up quickly, take a few seconds to sit on the edge of the bed before rising.`;
      } else {
        reply = `Thank you for asking, ${profile.preferredName}. Here is educational context on that topic:

When reviewing your personal health information, remember that gradual, steady habits—like your morning walk, drinking 6 to 8 glasses of water, and taking medications at consistent hours—are the foundation of feeling energetic and independent.

If you are experiencing any new, uncomfortable, or changing symptoms, please note them in your **Appointments checklist** to discuss directly with Dr. Vance or call his clinic at ${profile.primaryDoctor.phone}.`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <BotMessageSquare className="w-8 h-8 text-teal-600" />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            AI Health Information Companion
          </h2>
        </div>
        <p className="text-slate-600 text-sm sm:text-base mt-1">
          Empowering educational explanations, appointment question preparation, and document translation into plain language.
        </p>
      </div>

      {/* Critical Medical Disclaimer Guardrail */}
      <div className="bg-amber-50 border-2 border-amber-300 rounded-3xl p-5 text-amber-950 space-y-2">
        <div className="flex items-center gap-2 text-amber-900 font-extrabold text-base">
          <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0" />
          <span>Clinical Safety & Medication Guardrails</span>
        </div>
        <p className="text-xs sm:text-sm text-amber-900 font-medium leading-relaxed">
          The CareCompanion AI Assistant provides general health education and appointment preparation. <strong>It is not a doctor and cannot diagnose conditions, prescribe treatments, or determine if combining specific medications is safe.</strong> Always consult your licensed physician or pharmacist for medical decisions and medication interactions.
        </p>
      </div>

      {/* Main Chat & Interactive Explorer */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[65vh] min-h-[420px] max-h-[700px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-sm">
                    <Sparkles className="w-5 h-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed ${
                    isUser
                      ? 'bg-teal-700 text-white font-medium shadow-sm'
                      : 'bg-slate-50 border border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="whitespace-pre-line">{msg.text}</div>

                  {!isUser && (
                    <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                      <span>Educational Assistant</span>
                      <button
                        onClick={() => speakText(msg.text.replace(/[*#]/g, ''))}
                        className="text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Listen to answer</span>
                      </button>
                    </div>
                  )}

                  {/* Suggested Quick Prompt Buttons */}
                  {msg.suggestedQuestions && (
                    <div className="mt-4 pt-3 border-t border-slate-200 space-y-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                        Tap a suggested question to ask:
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {msg.suggestedQuestions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSendMessage(q)}
                            className="text-left text-xs sm:text-sm font-semibold text-teal-800 bg-white hover:bg-teal-100/70 p-2.5 rounded-xl border border-teal-200 transition-colors flex items-center justify-between"
                          >
                            <span>{q}</span>
                            <ArrowRight className="w-3.5 h-3.5 text-teal-600 shrink-0 ml-2" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 rounded-2xl p-4 text-sm text-slate-500 font-semibold animate-pulse">
                Reviewing health records and formulating clear plain-language explanation...
              </div>
            </div>
          )}
        </div>

        {/* Query Input Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask a question about your health terms, lab results, or doctor visits..."
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-slate-300 focus:border-teal-600 focus:outline-hidden text-base bg-white font-medium"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-6 py-3 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-bold rounded-2xl flex items-center gap-2 shadow-md transition-all active:scale-95 text-base"
            >
              <Send className="w-5 h-5" />
              <span className="hidden sm:inline">Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

