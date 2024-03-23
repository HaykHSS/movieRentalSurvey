import { collection, getDocs, Firestore, QueryDocumentSnapshot } from 'firebase/firestore';
import { IQuestion } from '../components/Question';

export const getQuestions = async (db: Firestore): Promise<IQuestion[]> => {
  const questionsCol = collection(db, 'questions');
  const questionSnapshot = await getDocs(questionsCol);
  const questionList = questionSnapshot.docs.map((doc: QueryDocumentSnapshot) => ({
    id: doc.id,
    ...doc.data(),
  })) as IQuestion[];
  return questionList;
};
