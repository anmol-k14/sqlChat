import * as ai from '../service/aiService.js';
import * as index from '../index.js'

export const getResult = async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const { query } = req.body;
        console.log('Received query:', query);
        if (!query) {
            return res.status(400).json({ error: 'Query is required' });
        }
        const sqlQuery = await ai.generateQuerry(query);
        const queryResults= await index.db.execute(sqlQuery);
        console.log('Query results:', queryResults);
        const result = await ai.analyzeQueryResults(query, sqlQuery, queryResults);

        console.log('Processed result:', result);
        
        res.json(result);
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ 
            error: 'An error occurred processing your query',
            details: error.message
        });
    }
}