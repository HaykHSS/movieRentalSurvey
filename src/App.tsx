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
    // if (currentQuestionIndex < questions.length - 1) {
    //   setCurrentQuestionIndex(currentQuestionIndex + 1);
    // }
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
    console.log(answers, "answers");
  }, [answers]);

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
              <button type="button" onClick={handleBack}>
                Back
              </button>
            )}
            {currentQuestionIndex === questions.length - 1 ? (
              <button type="button" onClick={() => setModalOpen(true)}>
                Submit Answers
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCurrentQuestionIndex(currentQuestionIndex + 1)
                }
              >
                Continue
              </button>
            )}
          </div>
          {modalOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4">
              <p>are you sure you want to submit these answers?</p>
              <div>
                {Object.entries(answers).map(([questionId, userAnswer]) => (
                  <p key={questionId}>{`${questionId}: ${userAnswer}`}</p>
                ))}
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit">Submit</button>
              </div>
            </div>
          )}
        </form>
      )}
    </>
  );
}

export default App;
