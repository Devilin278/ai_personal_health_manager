import React, { useState, useEffect, useRef } from 'react';
import {
  BotMessageSquare,
  Sparkles,
  X,
  Minus,
  Send,
  Volume2,
  ShieldAlert,
  ChevronDown,
  RotateCcw,
  CheckCircle2,
  Plus,
  ListPlus,
  ArrowRight,
} from 'lucide-react';
import { useHealth } from '../context/HealthContext';

export interface PreppedQuestionItem {
  id: string;
  category: 'question' | 'symptom' | 'document';
  title: string;
  text: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  suggestedQuestions?: string[];
  actionableQuestions?: PreppedQuestionItem[];
  targetAppointmentId?: string;
  targetProviderName?: string;
}

export const FloatingAiAssistant: React.FC = () => {
  const {
    isAiChatOpen,
    openAiChat,
    closeAiChat,
    pendingAiPrompt,
    clearPendingAiPrompt,
    profile,
    appointments,
    medications,
    speakText,
    addChecklistItem,
    setActiveTab,
  } = useHealth();

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialAssistantMessages: ChatMessage[] = [
    {
      id: 'msg-welcome-1',
      sender: 'assistant',
      text: `Hello ${profile.preferredName}! I'm Scott, your Care Companion Health Information Assistant. I can help translate medical test jargon into plain language, prepare thoughtful questions for doctor appointments, and explain general health terms.`,
      time: 'Just now',
    },
    {
      id: 'msg-welcome-2',
      sender: 'assistant',
      text: `You have an upcoming visit with ${appointments[0]?.providerName || 'your doctor'}. Would you like me to prepare questions for your visit, or explain your recent lab results?`,
      time: 'Just now',
      suggestedQuestions: [
        'Prepare questions for my upcoming appointment',
        'Explain my HbA1c 6.2% and LDL 84 test results',
        'What should I ask my pharmacist about supplements?',
        'What is an ACE inhibitor and why was Lisinopril prescribed?',
      ],
    },
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialAssistantMessages);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isAiChatOpen) {
      scrollToBottom();
    }
  }, [messages, isAiChatOpen, isTyping]);

  // Handle pending AI prompt dispatched from other views
  useEffect(() => {
    if (isAiChatOpen && pendingAiPrompt) {
      const prompt = pendingAiPrompt;
      clearPendingAiPrompt();
      handleSend(prompt);
    }
  }, [isAiChatOpen, pendingAiPrompt]);

  const handleAddQuestionToList = (q: PreppedQuestionItem, aptId?: string) => {
    const targetApt = aptId ? appointments.find((a) => a.id === aptId) : appointments[0];
    if (!targetApt) return;

    const alreadyExists = targetApt.checklist.some(
      (item) => item.text.trim().toLowerCase() === q.text.trim().toLowerCase()
    );
    if (!alreadyExists) {
      addChecklistItem(targetApt.id, q.text, q.category || 'question');
    }
  };

  const handleAddAllQuestionsToList = (questions: PreppedQuestionItem[], aptId?: string) => {
    const targetApt = aptId ? appointments.find((a) => a.id === aptId) : appointments[0];
    if (!targetApt) return;

    questions.forEach((q) => {
      const alreadyExists = targetApt.checklist.some(
        (item) => item.text.trim().toLowerCase() === q.text.trim().toLowerCase()
      );
      if (!alreadyExists) {
        addChecklistItem(targetApt.id, q.text, q.category || 'question');
      }
    });
  };

  const handleSend = (textToSend?: string) => {
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

    setTimeout(() => {
      let reply = '';
      let actionableQuestions: PreppedQuestionItem[] | undefined;
      let targetAptId: string | undefined;
      let targetProviderName: string | undefined;

      const textLower = text.toLowerCase();

      // Identify best appointment match
      const matchedApt =
        appointments.find(
          (a) =>
            textLower.includes(a.providerName.toLowerCase()) ||
            textLower.includes(a.specialty.toLowerCase()) ||
            textLower.includes(a.clinicName.toLowerCase())
        ) || appointments[0];

      if (matchedApt) {
        targetAptId = matchedApt.id;
        targetProviderName = matchedApt.providerName;
      }

      if (
        textLower.includes('cardiology') ||
        textLower.includes('question') ||
        textLower.includes('appointment') ||
        textLower.includes('doctor') ||
        textLower.includes('prep')
      ) {
        reply = `Here are 4 focused questions tailored for your visit with ${targetProviderName || 'your doctor'}:

1. Blood Pressure: "My morning home readings average around 124/78 mmHg. Does this align with your target for me?"
2. Prescription Tolerance: "I have been taking Lisinopril in the morning and Metformin with dinner. Are there any subtle side effects I should monitor?"
3. Mobility & Stretches: "I notice mild morning stiffness in my knees. Are there safe daily mobility stretches you recommend?"
4. Immunizations: "Are there any seasonal boosters (flu, pneumonia, shingles) due for me?"

💡 You can add any or all of these directly to your pre-visit checklist below!`;

        actionableQuestions = [
          {
            id: 'pq-bp',
            category: 'question',
            title: 'Blood Pressure Target',
            text: 'My morning home readings average around 124/78 mmHg. Does this align with your target for me?',
          },
          {
            id: 'pq-meds',
            category: 'question',
            title: 'Prescription Tolerance',
            text: 'I have been taking Lisinopril in the morning and Metformin with dinner. Are there any subtle side effects I should monitor?',
          },
          {
            id: 'pq-mobility',
            category: 'question',
            title: 'Mobility & Stretches',
            text: 'I notice mild morning stiffness in my knees. Are there safe daily mobility stretches you recommend?',
          },
          {
            id: 'pq-vaccines',
            category: 'question',
            title: 'Immunizations',
            text: 'Are there any seasonal boosters (flu, pneumonia, shingles) due for me?',
          },
        ];
      } else if (
        textLower.includes('pharmacist') ||
        textLower.includes('supplement') ||
        textLower.includes('interaction')
      ) {
        reply = `Safe Pharmacist Consultation Guide:

General AI assistants must never determine whether combining specific medications and supplements is safe. Clinical pharmacists have specialized database tools for interaction verification.

Recommended questions to ask your pharmacist:
1. "I take Lisinopril for blood pressure, Metformin for blood sugar, plus CoQ10 and Calcium D3. Do any of these interact?"
2. "Should I take my Calcium supplement at a different time from my morning prescriptions?"
3. "Which over-the-counter pain or cold medicines should I avoid with my blood pressure pills?"

💡 You can add these questions directly to your visit checklist below!`;

        actionableQuestions = [
          {
            id: 'pq-pharm-1',
            category: 'question',
            title: 'Prescription & Supplement Interactions',
            text: 'I take Lisinopril for blood pressure, Metformin for blood sugar, plus CoQ10 and Calcium D3. Do any of these interact?',
          },
          {
            id: 'pq-pharm-2',
            category: 'question',
            title: 'Supplement Timing',
            text: 'Should I take my Calcium supplement at a different time from my morning prescriptions?',
          },
          {
            id: 'pq-pharm-3',
            category: 'question',
            title: 'OTC Medicine Precautions',
            text: 'Which over-the-counter pain or cold medicines should I avoid with my blood pressure pills?',
          },
        ];
      } else if (textLower.includes('hba1c') || textLower.includes('bloodwork') || textLower.includes('ldl') || textLower.includes('lab') || textLower.includes('result')) {
        reply = `Here is a plain-language explanation of standard lab bloodwork terms:

• HbA1c (6.2%): Measures your average blood sugar over the last 2 to 3 months. Normal is under 5.7%, and pre-diabetes is 5.7%-6.4%. Your 6.2% indicates steady management!
• LDL Bad Cholesterol (84 mg/dL): Low-density lipoprotein can form arterial plaque. Doctors generally recommend remaining under 100 mg/dL, so 84 is a very healthy result.
• eGFR Kidney Filtration (78 mL/min): Measures how well kidneys filter waste. Readings above 60 indicate good functioning for older adults.

*Note: Always review official laboratory reports directly with your physician.*`;
      } else if (textLower.includes('lisinopril') || textLower.includes('ace inhibitor')) {
        reply = `What is Lisinopril and how does it help?

Lisinopril is an ACE inhibitor (Angiotensin-Converting Enzyme inhibitor).

• How it works: It relaxes and widens blood vessels so your heart pumps with less strain, keeping blood pressure steady and protecting kidney function.
• How to take: Take once daily in the morning with a full glass of water. If you ever feel mild lightheadedness when getting up, pause for a moment on the edge of the bed before standing.`;
      } else {
        reply = `Thank you for asking, ${profile.preferredName}. Here is helpful educational guidance:

Consistent daily habits—like taking medications at set times, drinking 6 to 8 glasses of water, and doing your gentle morning walk—are key to maintaining high energy and overall independence.

If you are experiencing any new, uncomfortable, or changing symptoms, please note them in your Appointments checklist to discuss directly with ${profile.primaryDoctor.name} (${profile.primaryDoctor.phone}).`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actionableQuestions,
        targetAppointmentId: targetAptId,
        targetProviderName: targetProviderName,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  const handleReset = () => {
    setMessages(initialAssistantMessages);
  };

  // Minimized Floating Pill Button
  if (!isAiChatOpen) {
    return (
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 animate-fade-in">
        <button
          onClick={() => openAiChat()}
          className="group flex items-center gap-3 px-4 sm:px-5 py-3.5 bg-gradient-to-r from-teal-700 to-teal-800 hover:from-teal-800 hover:to-teal-900 text-white font-bold rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 border-2 border-teal-500/40"
          aria-label="Open Scott (AI Assistant)"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-teal-200 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-teal-800" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-sm font-extrabold block leading-tight">Scott (AI Assistant)</span>
            <span className="text-[11px] text-teal-200 font-medium block">Ask questions & prep visits</span>
          </div>
          <span className="text-sm font-bold sm:hidden">Scott</span>
        </button>
      </div>
    );
  }

  // Expanded Floating Chat Box
  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] md:w-[460px] h-[580px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border-2 border-slate-300 flex flex-col overflow-hidden animate-fade-in text-slate-900"
      role="dialog"
      aria-label="Scott (AI Assistant) Health Information Chat"
    >
      {/* Header with Title and Minimize / Close */}
      <div className="bg-gradient-to-r from-teal-700 to-teal-800 text-white px-5 py-3.5 flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-teal-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-base tracking-tight leading-tight">
                Scott (AI Assistant)
              </h3>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                Educational
              </span>
            </div>
            <p className="text-[11px] text-teal-100">
              Care Companion Health Information Assistant
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleReset}
            className="p-1.5 text-teal-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={closeAiChat}
            className="p-1.5 text-teal-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Minimize to bottom right"
            aria-label="Minimize to bottom right"
          >
            <Minus className="w-5 h-5" />
          </button>
          <button
            onClick={closeAiChat}
            className="p-1.5 text-teal-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title="Close"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Safety Notice Strip */}
      <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-start gap-2 shrink-0 text-amber-900 text-xs">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <p className="leading-snug">
          <strong>Educational tool only.</strong> Does not diagnose, prescribe, or verify drug-drug safety. Consult your doctor or pharmacist.
        </p>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1.5`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[88%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-xs ${isUser
                    ? 'bg-teal-700 text-white rounded-br-none'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                {!isUser && msg.actionableQuestions && msg.actionableQuestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-200 space-y-2.5">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span className="text-xs font-bold text-teal-900">
                          Prepped Questions ({msg.actionableQuestions.length}):
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleAddAllQuestionsToList(msg.actionableQuestions!, msg.targetAppointmentId)}
                        className="px-2.5 py-1 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors shrink-0 cursor-pointer"
                        title="Add all questions to visit checklist"
                      >
                        <ListPlus className="w-3.5 h-3.5" />
                        <span>Add All to List</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {msg.actionableQuestions.map((q) => {
                        const targetApt =
                          appointments.find((a) => a.id === msg.targetAppointmentId) || appointments[0];
                        const isAdded = targetApt?.checklist.some(
                          (item) => item.text.trim().toLowerCase() === q.text.trim().toLowerCase()
                        );

                        return (
                          <div
                            key={q.id}
                            className={`p-2.5 rounded-xl border transition-all text-xs flex flex-col gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-50/70 border-emerald-300 text-slate-800'
                                : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-teal-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className="font-bold text-teal-900 leading-snug">
                                {q.title}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleAddQuestionToList(q, msg.targetAppointmentId)}
                                disabled={isAdded}
                                className={`px-2 py-1 rounded-lg font-bold text-xs flex items-center gap-1 shrink-0 transition-all ${
                                  isAdded
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                                    : 'bg-white hover:bg-teal-50 border border-teal-600 text-teal-800 shadow-2xs active:scale-95 cursor-pointer'
                                }`}
                              >
                                {isAdded ? (
                                  <>
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Added ✓</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="w-3.5 h-3.5 text-teal-700" />
                                    <span>+ Add to List</span>
                                  </>
                                )}
                              </button>
                            </div>
                            <p className="text-slate-600 italic leading-snug">
                              "{q.text}"
                            </p>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        Target: <strong>{msg.targetProviderName || appointments[0]?.providerName || 'Upcoming Visit'}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('appointments');
                          closeAiChat();
                        }}
                        className="text-teal-700 hover:text-teal-900 font-bold underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View in Appointments</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}

                {!isUser && (
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <span>{msg.time}</span>
                    <button
                      onClick={() => speakText(msg.text)}
                      className="p-1 text-slate-400 hover:text-teal-700 rounded transition-colors flex items-center gap-1"
                      title="Read aloud"
                      aria-label="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Listen</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Suggested Questions Pills on welcome message */}
              {msg.suggestedQuestions && (
                <div className="space-y-1.5 mt-2 w-full max-w-[95%]">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Suggested topics:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {msg.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="text-left px-3 py-2 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-300 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
                      >
                        👉 {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-2xl border border-slate-200 max-w-[60%] text-slate-500 text-xs shadow-xs">
            <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
            <span>Scott is writing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white border-t border-slate-200 shrink-0 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          placeholder="Ask Scott a health question or topic..."
          className="flex-1 px-4 py-2.5 text-sm bg-slate-100 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white text-slate-900 placeholder:text-slate-400 font-medium"
        />
        <button
          type="submit"
          disabled={!inputQuery.trim() || isTyping}
          className="p-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-200 text-white disabled:text-slate-400 rounded-xl transition-all shadow-sm active:scale-95 shrink-0"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

