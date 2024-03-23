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
      const newAnswers = Array.isArray(answer) ? [...answer] : [];
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
        />
      );
      break;
    case "number":
      inputElement = (
        <input
          type="number"
          value={answer as number}
          onChange={handleAnswerChange}
        />
      );
      break;
    case "radio":
      inputElement = question.options?.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name={question.id}
            value={option}
            checked={answer === option}
            onChange={handleAnswerChange}
          />
          {option}
        </label>
      ));
      break;
    case "select":
      inputElement = (
        <select value={answer as string} onChange={handleAnswerChange}>
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
        <input type="date" value={answer} onChange={handleAnswerChange} />
      );
      break;
    case "text-multi":
      inputElement = question.options?.map((option, index) => (
        <label key={index}>
          {option}
          <input
            type="text"
            value={Array.isArray(answer) ? answer[index] || "" : ""}
            onChange={(e) => handleAnswerChange(e, index)}
          />
        </label>
      ));
      break;
    default:
      inputElement = <div>Unsupported answer format</div>;
  }

  return (
    <div>
      <p>{question.questionLabel}</p>
      {inputElement}
    </div>
  );
};

export default QuestionComponent;
