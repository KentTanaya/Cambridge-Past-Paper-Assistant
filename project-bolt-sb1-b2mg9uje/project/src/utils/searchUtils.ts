export interface Question {
  id: string;
  subject: string;
  year: number;
  session: string;
  paper_number: string;
  question_text: string;
  mark_scheme: string;
  keywords: string[];
  created_at: string;
}

export function calculateSimilarity(query: string, questionText: string, keywords: string[]): number {
  const queryLower = query.toLowerCase();
  const questionLower = questionText.toLowerCase();
  
  // Exact phrase match gets highest score
  if (questionLower.includes(queryLower)) {
    return 0.9;
  }
  
  // Split into words for keyword matching
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 2);
  const questionWords = questionLower.split(/\s+/);
  const keywordWords = keywords.map(k => k.toLowerCase());
  
  let matchScore = 0;
  let totalWords = queryWords.length;
  
  if (totalWords === 0) return 0;
  
  // Check word matches in question text
  for (const queryWord of queryWords) {
    if (questionWords.some(qWord => qWord.includes(queryWord) || queryWord.includes(qWord))) {
      matchScore += 0.6;
    }
  }
  
  // Check keyword matches (higher weight)
  for (const queryWord of queryWords) {
    if (keywordWords.some(keyword => keyword.includes(queryWord) || queryWord.includes(keyword))) {
      matchScore += 0.8;
    }
  }
  
  return Math.min(matchScore / totalWords, 1.0);
}

export function searchQuestions(query: string, questions: Question[], subjectFilter?: string): Question[] {
  if (!query.trim()) return [];
  
  let filteredQuestions = questions;
  
  // Apply subject filter
  if (subjectFilter && subjectFilter !== 'all') {
    filteredQuestions = questions.filter(q => 
      q.subject.toLowerCase() === subjectFilter.toLowerCase()
    );
  }
  
  // Calculate similarity scores and filter
  const results = filteredQuestions
    .map(question => ({
      ...question,
      similarity: calculateSimilarity(query, question.question_text, question.keywords)
    }))
    .filter(result => result.similarity > 0.2)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 10); // Limit to top 10 results
  
  return results;
}

export const CAMBRIDGE_SUBJECTS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Economics',
  'Business Studies',
  'Computer Science',
  'English Literature',
  'History',
  'Geography',
  'Psychology',
  'Sociology'
];