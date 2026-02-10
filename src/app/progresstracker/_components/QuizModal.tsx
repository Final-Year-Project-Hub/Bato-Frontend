"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, XCircle, Trophy, Play } from "lucide-react";
import confetti from "canvas-confetti";

type QuizQuestion = {
  id: number;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: string;
  explanation: string;
};

type QuizData = {
  questions: QuizQuestion[];
  metadata: {
    totalQuestions: number;
    estimatedTime: string;
    passingScore: number;
  };
};

type QuizModalProps = {
  isOpen: boolean;
  onClose: () => void;
  roadmapId: string;
  phaseId: string;
  topicId: string;
  topicTitle: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function QuizModal({
  isOpen,
  onClose,
  roadmapId,
  phaseId,
  topicId,
  topicTitle,
}: QuizModalProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizStatus, setQuizStatus] = useState<{
    exists: boolean;
    hasQuiz: boolean;
    topicContentId: string | null;
    bestScore: number | null;
  } | null>(null);

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      resetQuiz();
      checkStatus();
    }
  }, [isOpen, roadmapId, phaseId, topicId]);

  const resetQuiz = () => {
    setLoading(true);
    setError(null);
    setQuizData(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setShowResults(false);
    setSubmissionResult(null);
    setIsSubmitting(false);
  };

  const checkStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/quiz/status?roadmapId=${roadmapId}&phaseId=${phaseId}&topicId=${topicId}`,
        { credentials: "include" },
      );

      if (!res.ok) throw new Error("Failed to check quiz status");

      const data = await res.json();
      setQuizStatus(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const generateQuiz = async () => {
    if (!quizStatus?.topicContentId) {
      setError("Cannot generate quiz: Topic content not found.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/quiz/generate/${quizStatus.topicContentId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to generate quiz");

      const data = await res.json();
      setQuizData(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    if (quizData) return;

    if (!quizStatus?.topicContentId) return;

    // Fetch existing quiz
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/quiz/generate/${quizStatus.topicContentId}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      if (!res.ok) throw new Error("Failed to load quiz");

      const data = await res.json();
      setQuizData(data);
      setLoading(false);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleOptionSelect = (option: string) => {
    if (!quizData) return;
    const questionId = quizData.questions[currentQuestionIndex].id;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const nextQuestion = () => {
    if (!quizData) return;
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (!quizStatus?.topicContentId || !quizData) return;

    setIsSubmitting(true);
    try {
      const res = await fetch(`${baseUrl}/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          topicContentId: quizStatus.topicContentId,
          answers,
          timeSpent: 0,
        }),
      });

      if (!res.ok) throw new Error("Failed to submit quiz");

      const result = await res.json();
      setSubmissionResult(result);
      setShowResults(true);

      if (result.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-10 space-y-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading quiz data...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center space-y-4">
          <XCircle className="w-12 h-12 text-red-500" />
          <p className="text-red-500 font-medium">{error}</p>
          <Button onClick={checkStatus} variant="outline">
            Try Again
          </Button>
        </div>
      );
    }

    if (showResults && submissionResult) {
      return (
        <div className="py-6 space-y-6">
          <div className="text-center space-y-2">
            <Trophy
              className={`w-16 h-16 mx-auto ${
                submissionResult.passed
                  ? "text-yellow-500"
                  : "text-muted-foreground"
              }`}
            />
            <h3 className="text-2xl font-bold">
              {submissionResult.passed ? "Quiz Passed!" : "Keep Practicing"}
            </h3>
            <p className="text-muted-foreground">
              You scored {submissionResult.score}% (
              {submissionResult.correctAnswers}/
              {submissionResult.totalQuestions} correct)
            </p>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
            {submissionResult.feedback.map((item: any, idx: number) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border ${
                  item.isCorrect
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <p className="font-medium mb-2">Q: {item.question}</p>
                <div className="text-sm space-y-1">
                  <p
                    className={
                      item.isCorrect ? "text-green-600" : "text-red-500"
                    }
                  >
                    Your Answer: {item.userAnswer}
                  </p>
                  {!item.isCorrect && (
                    <p className="text-green-600">
                      Correct Answer: {item.correctAnswer}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {item.explanation}
                </p>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
            <Button onClick={resetQuiz}>Retake Quiz</Button>
          </div>
        </div>
      );
    }

    if (quizData) {
      const currentQuestion = quizData.questions[currentQuestionIndex];
      const selectedAnswer = answers[currentQuestion.id];

      return (
        <div className="space-y-6 py-4">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>
              Question {currentQuestionIndex + 1} of {quizData.questions.length}
            </span>
            <span>
              Progress:{" "}
              {Math.round(
                ((currentQuestionIndex + 1) / quizData.questions.length) * 100,
              )}
              %
            </span>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {currentQuestion.question}
            </h3>
            <div className="grid gap-3">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleOptionSelect(key)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedAnswer === key
                      ? "border-primary bg-primary/10 ring-2 ring-primary/20"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  <span className="font-semibold text-primary mr-2">
                    {key}.
                  </span>
                  {value}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4">
            <Button
              variant="ghost"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              onClick={nextQuestion}
              disabled={!selectedAnswer || isSubmitting}
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {currentQuestionIndex === quizData.questions.length - 1
                ? "Submit Quiz"
                : "Next Question"}
            </Button>
          </div>
        </div>
      );
    }

    // Default state: Call to action (Generate or Start)
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="p-4 bg-primary/10 rounded-full">
          <Trophy className="w-12 h-12 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">Ready to test your knowledge?</h3>
          <p className="text-muted-foreground max-w-sm mx-auto">
            Test yourself on: <br />{" "}
            <span className="font-semibold text-foreground">{topicTitle}</span>.
          </p>
        </div>

        {quizStatus?.bestScore !== null && (
          <div className="bg-muted px-4 py-2 rounded-lg">
            <p className="text-sm font-medium">
              Your Best Score:{" "}
              <span className="text-primary">{quizStatus?.bestScore}%</span>
            </p>
          </div>
        )}

        <Button
          size="lg"
          onClick={quizStatus?.hasQuiz ? startQuiz : generateQuiz}
          className="px-8"
        >
          <Play className="w-4 h-4 mr-1" />
          {quizStatus?.hasQuiz ? "Start Quiz" : "Generate Quiz"}
        </Button>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Topic Quiz</DialogTitle>
          {!showResults && !quizData && (
            <DialogDescription>
              Testing knowledge for {topicTitle}
            </DialogDescription>
          )}
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
