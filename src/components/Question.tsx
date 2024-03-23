import React, { useState, useEffect } from "react";

export interface IQuestion {
  id: string;
  questionLabel: string;
  answerFormat: "text" | "radio" | "select" | "number" | "date" | "text-multi";
  options?: string[];
}

export interface IAnswer {
  questionId: string;
  userAnswer: string | number | string[];
}

interface QuestionComponentProps {
  question: IQuestion;
  onAnswer: (answer: IAnswer) => void;
  initialAnswer?: string | number;
}

const QuestionComponent: React.FC<QuestionComponentProps> = ({
  question,
  onAnswer,
  initialAnswer = "",
}) => {
  const [answer, setAnswer] = useState<string | number | string[]>(
    initialAnswer
  );

  useEffect(() => {
    onAnswer({ questionId: question.id, userAnswer: answer });
  }, [answer, question.id]);

  const handleAnswerChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    if (question.answerFormat === "text-multi" && typeof index === "number") {
      const newAnswers = Array.isArray(answer) ? [...answer] : ['','',''];
      newAnswers[index] = e.target.value;
      setAnswer(newAnswers);
    } else {
      setAnswer(e.target.value);
    }
  };

  let inputElement;
  switch (question.answerFormat) {
    case "text":
      inputElement = (
        <input
          type="text"
          value={answer as string}
          onChange={handleAnswerChange}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
        />
      );
      break;
    case "number":
      inputElement = (
        <input
          type="number"
          value={answer as number}
          onChange={handleAnswerChange}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
        />
      );
      break;
    case "radio":
      inputElement = question.options?.map((option) => (
        <label key={option} className="flex items-center">
          <input
            type="radio"
            name={question.id}
            value={option}
            checked={answer === option}
            onChange={handleAnswerChange}
            className="mr-2"
          />
          {option}
        </label>
      ));
      break;
    case "select":
      inputElement = (
        <select
          value={answer as string}
          onChange={handleAnswerChange}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
        >
          {question.options?.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
      break;
    case "date":
      inputElement = (
        <input
          type="date"
          value={answer}
          onChange={handleAnswerChange}
          className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500"
        />
      );
      break;
    case "text-multi":
      inputElement = question.options?.map((option, index) => (
        <label key={index} className="flex items-center justify-between">
          {option}
          <input
            type={option}
            value={Array.isArray(answer) ? answer[index] || "" : ""}
            onChange={(e) => handleAnswerChange(e, index)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:border-blue-500 ml-2"
          />
        </label>
      ));
      break;
    default:
      inputElement = <div>Unsupported answer format</div>;
  }

  return (
    <div className="mb-4 flex flex-col items-center">
      <p className="font-semibold">{question.questionLabel}</p>
      <div className="mt-2 flex flex-col gap-2">{inputElement}</div>
    </div>
  );
};

export default QuestionComponent;
