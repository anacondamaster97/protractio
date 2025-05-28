import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { ChartSelector } from '../charts';
import { IoSend } from "react-icons/io5";
import { MdKeyboardVoice } from "react-icons/md";
import { useTypewriter } from '@/hooks/useTypewriter';
import { supabase } from '@/supabaseClient';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { Navigate, useNavigate } from 'react-router';
import { Hammer } from 'lucide-react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface ChatMessage {
    content: string;
    role: 'user' | 'assistant';
}

interface TableData {
    header: string[];
    entries: (string | number)[][];
}

interface ApiResponse {
    agent_response: string;
    table?: TableData;
}

export default function MarketingAgent() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const [showIntro, setShowIntro] = useState(true);
    const introText = "  Hi! I'm your Marketing Analytics Assistant. I can help you analyze marketing data, create visualizations, and provide insights to improve your marketing strategy. Feel free to ask me anything about your marketing metrics!";
    const { displayText, isComplete } = useTypewriter(introText, 40);
    const navigate = useNavigate();
    const [isListening, setIsListening] = useState(false);
    const [silenceTimer, setSilenceTimer] = useState<NodeJS.Timeout | null>(null);
    const lastTranscriptRef = useRef('');
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (listening && transcript) {
            // Clear existing timer if there is one
            if (silenceTimer) {
                clearTimeout(silenceTimer);
            }

            // Only start a new timer if the transcript has changed
            if (transcript !== lastTranscriptRef.current) {
                lastTranscriptRef.current = transcript;
                const timer = setTimeout(() => {
                    SpeechRecognition.stopListening();
                    setIsListening(false);
                }, 5000); // 5 seconds of silence
                setSilenceTimer(timer);
            }
        }

        return () => {
            if (silenceTimer) {
                clearTimeout(silenceTimer);
            }
        };
    }, [transcript, listening]);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => {
                setShowIntro(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isComplete]);

    useEffect(() => {
        if (transcript) {
            setInput(transcript);
        }
    }, [transcript]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (userMessage: string) => {
        if (!userMessage.trim()) return;

        const newUserMessage: ChatMessage = {
            content: userMessage,
            role: 'user',
        };

        setMessages(prev => [...prev, newUserMessage]);
        
        setInput('');
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/marketing/agent`, {
                user_response: userMessage,
                history: history,
                content: messages // history: messages
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            const aiResponse: ChatMessage = {
                content: JSON.stringify({
                    text: response.data.agent_response,
                    table: response.data.table,
                    graph: response.data.graph,
                    report: response.data.report,
                    dashboard: response.data.dashboard
                }),
                role: 'assistant',
            };

            setHistory(response.data.history);
            

            setMessages(prev => [...prev, aiResponse]);
        } catch (error) {
            const errorMessage: ChatMessage = {
                content: JSON.stringify({ text: 'Sorry, there was an error processing your request.' }),
                role: 'assistant',
            };
            setMessages(prev => [...prev, errorMessage]);
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const BuildDashboard = (data: any) => {
        navigate('/app/dashboards/build', { state: { dashboard: data.dashboard } });
    }

    const renderTable = (tableData: TableData) => {
        return (
            <motion.div
                initial={{ filter: "blur(10px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-4 overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg"
            >
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {tableData.header.map((header, index) => (
                                    <th
                                        key={index}
                                        className="py-3.5 px-4 text-left text-sm font-semibold text-gray-900 first:pl-6 last:pr-6"
                                    >
                                        {header.split('_').map(word => 
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {tableData.entries.map((row, rowIndex) => (
                                <tr 
                                    key={rowIndex}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    {row.map((cell, cellIndex) => {
                                        // Determine if the cell is numeric
                                        const isNumeric = typeof cell === 'number';
                                        
                                        // Special formatting for different data types
                                        let formattedValue = cell;
                                        if (tableData.header[cellIndex] === 'bounce_rate') {
                                            formattedValue = `${(Number(cell) * 100).toFixed(1)}%`;
                                        } else if (tableData.header[cellIndex] === 'session_duration') {
                                            formattedValue = `${cell} sec`;
                                        }

                                        return (
                                            <td
                                                key={cellIndex}
                                                className={`whitespace-nowrap py-3 px-4 text-sm first:pl-6 last:pr-6
                                                    ${isNumeric ? 'text-right font-medium text-gray-900' : 'text-gray-700'}
                                                    ${tableData.header[cellIndex] === 'traffic_source' ? 'font-medium' : ''}
                                                `}
                                            >
                                               {/*  <TextGenerateEffect duration={3} stagerValue={0.01} filter={true} words={formattedValue.toString()} /> */}
                                                {formattedValue}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        );
    };

    const renderContent = (content: string) => {
        
        try {
            const data = JSON.parse(content);
            console.log(data)
            return (
                <div className="space-y-4">
                    <TextGenerateEffect duration={1} filter={false} words={data.text} />
                    {/* <p className="text-sm text-gray-900">{data.text}</p> */}
                    {data.table && 
                        data.table.map((table: any, index: number) => (
                            renderTable(table)
                        ))
                    }
                    {!data.dashboard && data.graph && (
                        <motion.div
                            initial={{ filter: "blur(10px)", opacity: 0 }}
                            animate={{ filter: "blur(0px)", opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <ChartSelector 
                                graphType={data.graph.graphType} 
                                data={data.graph.data} 
                            />
                        </motion.div>
                    )}
                    {data.dashboard && (
                        data.dashboard.data.map((dashboard: any, index: number) => (
                            <motion.div
                            initial={{ filter: "blur(10px)", opacity: 0 }}
                            animate={{ filter: "blur(0px)", opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            key={index}
                            >
                                <ChartSelector 
                                    graphType={dashboard.graphType} 
                                    data={dashboard.data} 
                                    title={dashboard.title}
                                />
                            </motion.div>
                            
                        ))
                    )}
                    {data.dashboard && (
                        <div className="flex justify-end">
                            <button onClick={() => BuildDashboard(data)} className="flex bg-white p-2 rounded-lg items-center space-x-2 text-orange-400 hover:text-orange-600 transition-colors">
                                Build Dashboard <Hammer className=" ml-2 w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            );
        } catch {
            return <p className="text-sm text-gray-900">{content}</p>;
        }
    };

    const handleVoiceInput = () => {
        if (!browserSupportsSpeechRecognition) {
            alert('Browser doesn\'t support speech recognition.');
            return;
        }

        if (!listening) {
            resetTranscript();
            lastTranscriptRef.current = '';
            SpeechRecognition.startListening({ continuous: true });
            setIsListening(true);
        } else {
            if (silenceTimer) {
                clearTimeout(silenceTimer);
                setSilenceTimer(null);
            }
            SpeechRecognition.stopListening();
            setIsListening(false);
        }
    };

    return (
        <div className="w-full h-full max-h-screen flex flex-col bg-orange-50">
            <div className="flex-1 overflow-y-auto p-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <AnimatePresence>
                        {showIntro && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-6"
                                onClick={() => setShowIntro(false)}
                            >
                                <motion.div 
                                    className="p-12 w-1/2 justify-center items-center my-auto mx-auto bg-orange-200 rounded-full text-gray-800 text-lg font-light leading-relaxed"
                                >
                                    {displayText}
                                    {!isComplete && (
                                        <span className="inline-block w-1 h-5 ml-1 bg-gray-800 animate-blink" />
                                    )}
                                    
                                </motion.div>

                                {/* <motion.div 
                                    className="p-6 bg-gray-100 rounded-lg h-32 flex items-center justify-center text-gray-500"
                                >
                                    Additional Animation Placeholder
                                </motion.div> */}
                            </motion.div>
                        )}

                        {messages.map((message, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`max-w-[80%] my-4 p-4 rounded-xl ${
                                    message.role === 'user'
                                        ? 'ml-auto bg-orange-400/80 text-white rounded-tr-sm'
                                        : 'mr-auto bg-orange-100 text-gray-900 rounded-tl-sm'
                                }`}
                            >
                                {renderContent(message.content)}
                            </motion.div>
                        ))}
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex justify-center p-4"
                            >
                                <div className="flex space-x-2">
                                    {[0, 1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.16}s` }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={chatEndRef} />
                </div>
            </div>
            
            <div className="border-t border-orange-100 bg-white">
                <div className="max-w-7xl mx-auto p-4">
                    <div className="relative flex items-center">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(input);
                                }
                            }}
                            placeholder="Type your message here..."
                            className="w-full px-4 py-2 pr-24 text-sm text-gray-700 bg-gray-50 border border-orange-200 
                                      rounded-lg resize-none focus:outline-none focus:bg-gray-100 transition-colors
                                      placeholder:text-gray-400 min-h-[44px] max-h-[44px]"
                            rows={1}
                            disabled={showIntro || isLoading}
                        />
                        <div className="absolute right-2 flex items-center space-x-2">
                            <button
                                className={`p-2 transition-colors ${
                                    isListening ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
                                }`}
                                aria-label="Voice input"
                                onClick={handleVoiceInput}
                                disabled={showIntro || isLoading}
                            >
                                <MdKeyboardVoice className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => sendMessage(input)}
                                disabled={isLoading || showIntro}
                                className="p-2 text-orange-400 hover:text-orange-600 transition-colors disabled:text-gray-300"
                                aria-label="Send message"
                            >
                                <IoSend className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
