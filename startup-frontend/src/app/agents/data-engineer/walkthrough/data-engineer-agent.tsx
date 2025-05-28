import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WelcomeScreen } from "./build-pipeline-intro";
import { QuestionBox } from "./question-box";
import { QuestionCard } from "./question-card";
import { LoadingSpinner } from "./loading-spinner";
import { Button } from "@/components/ui/button";
import { Particles } from "@/components/ui/particles";

interface Question {
  id: string;
  text: string;
}

const questionSets = {
  "data-ingestion": [
    { id: "di-1", text: "Data Ingestion" },
  ],
  "testing": [
    { id: "dp-1", text: "What type of data transformations do you need?" },
  ],
  "data-output": [
    { id: "do-1", text: "Where will the processed data be stored?" },
  ],
};

const Index = () => {
  const [step, setStep] = useState<"welcome" | "questions">("welcome");
  const [pipelineData, setPipelineData] = useState({ name: "", source: "" });
  const [activeBox, setActiveBox] = useState<keyof typeof questionSets | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({
    "data-ingestion": {},
    "testing": {},
    "data-output": {},
  });
  const [loading, setLoading] = useState(false);

  const handleWelcomeSubmit = (name: string, source: string) => {
    setPipelineData({ name, source });
    setStep("questions");
  };

  const handleBoxClick = (boxId: keyof typeof questionSets) => {
    setActiveBox(boxId);
    setCurrentQuestionIndex(0);
  };

  const handleAnswer = async (answer: string) => {
    if (!activeBox) return;

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);

    const currentQuestions = questionSets[activeBox];
    const currentQuestion = currentQuestions[currentQuestionIndex];

    setAnswers((prev) => ({
      ...prev,
      [activeBox]: {
        ...prev[activeBox],
        [currentQuestion.id]: answer,
      },
    }));

    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setActiveBox(null);
      setCurrentQuestionIndex(0);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setActiveBox(null);
    }
  };

  const isBoxCompleted = (boxId: keyof typeof questionSets) => {
    return Object.keys(answers[boxId]).length === questionSets[boxId].length;
  };

  const areAllBoxesCompleted = () => {
    return Object.keys(questionSets).every((boxId) => 
      isBoxCompleted(boxId as keyof typeof questionSets)
    );
  };

  const handleSubmitAll = () => {
    console.log("Pipeline Data:", {
      ...pipelineData,
      answers,
    });
  };

  if (step === "welcome") {
    return <WelcomeScreen onSubmit={handleWelcomeSubmit} />;
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <Particles
        className="absolute inset-0"
        quantity={2000}
        ease={80}
        color={"#000000"}
        refresh
      />
      <div className="max-w-6xl mx-auto space-y-8">
        {/* <h1 className="text-3xl font-bold text-center text-black">
          Configure Your Pipeline: {pipelineData.name}
        </h1> */}
        
        <div className="flex flex-wrap justify-center gap-8">
          {!activeBox ? (
            <div className="grid grid-cols-2 gap-16 w-full max-w-3xl">
              <div className="col-span-1">
                <QuestionBox
                  key="data-ingestion"
                  title="Data Ingestion"
                  isCompleted={isBoxCompleted("data-ingestion")}
                  onClick={() => handleBoxClick("data-ingestion")}
                />
              </div>
              <div className="col-span-1">
                <QuestionBox
                  key="testing"
                  title="Testing"
                  isCompleted={isBoxCompleted("testing")}
                  onClick={() => handleBoxClick("testing")}
                />
              </div>
              <div className="col-span-2 flex justify-center">
                <QuestionBox
                  key="data-output"
                  title="Data Output"
                  isCompleted={isBoxCompleted("data-output")}
                  onClick={() => handleBoxClick("data-output")}
                />
              </div>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center">
              {loading ? (
                <LoadingSpinner />
              ) : (
                <AnimatePresence mode="wait">
                  <QuestionCard
                    key={questionSets[activeBox][currentQuestionIndex].id}
                    question={questionSets[activeBox][currentQuestionIndex].text}
                    onAnswer={handleAnswer}
                    onBack={currentQuestionIndex > 0 ? handleBack : undefined}
                  />
                </AnimatePresence>
              )}
            </div>
          )}
        </div>

        {areAllBoxesCompleted() && !activeBox && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center"
          >
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
              onClick={handleSubmitAll}
            >
              Run Pipeline
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Index;