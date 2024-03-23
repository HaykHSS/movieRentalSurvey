import { useState, useEffect } from "react";
import { db } from "./config/firebaseConfig";
import { getQuestions } from "./config/getQuestions";
import { doc, updateDoc } from "firebase/firestore";
import Question, { IQuestion, IAnswer } from "./components/Question";

function App() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{
    [key: string]: string | number | string[];
  }>({});

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      const currentQuestionId = questions[currentQuestionIndex].id;
      setAnswers((prev) => {
        const newAnswers = { ...prev };
        delete newAnswers[currentQuestionId];
        return newAnswers;
      });
    }
  };

  const handleAnswer = (answer: IAnswer) => {
    setAnswers({ ...answers, [answer.questionId]: answer.userAnswer });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      const updatePromises = Object.entries(answers).map(
        ([questionId, userAnswer]) => {
          const questionDocRef = doc(db, "questions", questionId);
          return updateDoc(questionDocRef, { userAnswer });
        }
      );

      await Promise.all(updatePromises);
      window.location.reload();
    } catch (error) {
      console.error("Error submitting answers:", error);
    }
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      const loadedQuestions = await getQuestions(db);
      setQuestions(loadedQuestions as IQuestion[]);
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
  }, [answers]);

  const isContinueDisabled =
    currentQuestionIndex < questions.length &&
    (!answers[questions[currentQuestionIndex].id] ||
      (Array.isArray(answers[questions[currentQuestionIndex].id]) &&
        (answers[questions[currentQuestionIndex].id] as string[]).some(
          (answer) => answer === '' 
        )));

  return (
    <>
      {questions.length > 0 && (
        <form
          onSubmit={handleSubmit}
          className="relative h-dvh flex items-center justify-center flex-col"
        >
          <Question
            key={questions[currentQuestionIndex].id}
            question={questions[currentQuestionIndex]}
            onAnswer={handleAnswer}
          />
          <div className="flex gap-2">
            {currentQuestionIndex > 0 && (
              <button
                className="p-1 border-red-600 border-2 rounded-md"
                type="button"
                onClick={handleBack}
              >
                Back
              </button>
            )}
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                disabled={isContinueDisabled}
                type="button"
                onClick={() => setModalOpen(true)}
                className="p-1 border-green-600 border-2 rounded-md"
              >
                Submit Answers
              </button>
            ) : (
              <button
                className="p-1 border-green-600 border-2 rounded-md"
                type="button"
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
                disabled={isContinueDisabled}
              >
                Continue
              </button>
            )}
          </div>
          {modalOpen && (
            <div className="absolute flex flex-col gap-4 rounded-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 bg-blue-200 p-4">
              <h3 className="text-xl font-bold">
                are you sure you want to submit these answers?
              </h3>
              <div>
                {Object.entries(answers).map(([questionId, userAnswer]) => (
                  <p key={questionId}>{`${
                    questions[+questionId - 1].questionLabel
                  }: ${userAnswer}`}</p>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  className="p-1 border-red-600 border-2 rounded-md"
                  type="button"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="p-1 border-green-600 border-2 rounded-md"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </div>
          )}
        </form>
      )}
    </>
  );
}

export default App;
