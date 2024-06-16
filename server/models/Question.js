import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

const Question = mongoose.model('QuestionChatBot', questionSchema);

export default Question;
