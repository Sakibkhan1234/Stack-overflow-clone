import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

router.post('/question', async (req, res) => {
    try {
        let { question } = req.body;
        console.log("Received question:", question);
        question = question.toLowerCase();
        const result = await Question.findOne({ question: { $regex: new RegExp(question, 'i') } });
        if (result) {
            console.log("Found answer:", result.answer);
            res.status(200).json({ answer: result.answer });
        } else {
            console.log("Answer not found for question:", question);
            res.status(404).json({ message: 'Answer not found for this question' });
        }
    } catch (error) {
        console.error("Error in /question route:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const { question, answer } = req.body;
        console.log("Adding question:", question, "with answer:", answer);
        const newQuestion = new Question({ question, answer });
        await newQuestion.save();
        res.status(201).json({ message: 'Question added successfully' });
    } catch (error) {
        console.error("Error in /add route:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
