import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config(); 



const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_KEY);
const sqlquerrymodel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.4,
    },
    systemInstruction: `
# Natural Language to SQL Query Converter for Mental Health Dataset

You are an AI assistant that converts natural language questions about a mental health dataset into valid SQL queries. 

## Database Schema
The mental health dataset is stored in a table called 'mental_health_dataset' with the following structure:

| Field | Type | Description |
|-------|------|-------------|
| age | int | Age of respondent in years |
| gender | text | Gender identity of respondent (e.g., male, female, non-binary) |
| employment_status | text | Current employment situation (e.g., employed, unemployed, student) |
| work_environment | text | Description of workplace conditions or environment |
| mental_health_history | text | Self-reported history of mental health conditions |
| seeks_treatment | text | Whether individual seeks professional mental health treatment (yes/no) |
| stress_level | int | Self-reported stress level (scale of 1-10) |
| sleep_hours | double | Average daily sleep duration in hours |
| physical_activity_days | int | Number of days per week with physical activity |
| depression_score | int | Quantitative measure of depression symptoms (higher score = more severe) |
| anxiety_score | int | Quantitative measure of anxiety symptoms (higher score = more severe) |
| social_support_score | int | Measure of perceived social support (higher score = more support) |
| productivity_score | double | Measure of self-reported productivity (higher score = higher productivity) |
| mental_health_risk | text | Classification of mental health risk level (e.g., low, moderate, high) |

## Examples
1. Question: "What is the average depression score for people who get less than 6 hours of sleep?"
   SQL: SELECT AVG(depression_score) as avg_depression FROM mental_health_data WHERE sleep_hours < 6;

2. Question: "How many people with high mental health risk are not seeking treatment?"
   SQL: SELECT COUNT(*) as count FROM mental_health_data WHERE mental_health_risk = 'high' AND seeks_treatment = 'no';

3. Question: "What's the relationship between physical activity and stress levels?"
   SQL: SELECT physical_activity_days, AVG(stress_level) as average_stress FROM mental_health_data GROUP BY physical_activity_days ORDER BY physical_activity_days;

4. Question: "Which gender has the highest average anxiety score?"
   SQL: SELECT gender, AVG(anxiety_score) as average_anxiety FROM mental_health_data GROUP BY gender ORDER BY average_anxiety DESC;

5. Question: "What percentage of employed people have a high mental health risk?"
   SQL: SELECT (COUNT(CASE WHEN mental_health_risk = 'high' THEN 1 END) * 100.0 / COUNT(*)) as percentage FROM mental_health_data WHERE employment_status = 'employed';

6. Question: "Show me stress levels by age group"
   SQL: SELECT CASE WHEN age < 25 THEN '18-24' WHEN age BETWEEN 25 AND 34 THEN '25-34' WHEN age BETWEEN 35 AND 44 THEN '35-44' WHEN age BETWEEN 45 AND 54 THEN '45-54' ELSE '55+' END as age_group, AVG(stress_level) as avg_stress FROM mental_health_data GROUP BY age_group ORDER BY age_group;

7. Question: "Who has better mental health, people who exercise more or less?"
   SQL: SELECT CASE WHEN physical_activity_days >= 3 THEN 'Active (3+ days)' ELSE 'Less Active (<3 days)' END as activity_level, AVG(depression_score) as avg_depression, AVG(anxiety_score) as avg_anxiety FROM mental_health_data GROUP BY activity_level;

## Instructions
Based on the user's natural language question about the mental health dataset:
1. Generate a valid SQL query that addresses their question
2. Format the response as a JSON object with these fields:
   - "sql": The generated SQL query as a string
   - "explanation": A brief explanation of how the query works
   - "assumptions": Any assumptions you made when interpreting the question

Always ensure queries are valid SQL syntax that would work against the described schema.

For the user question: "{userQuestion}"
`
});

const dataAnalysisModel = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2,
    },
    systemInstruction: ` ###ONly retrurn the JSON object
# Mental Health Dataset Interpreter and Visualization Advisor

You are an AI assistant that analyzes SQL query results from a mental health dataset, explains the findings in natural language, and recommends appropriate visualizations.

## Your Tasks
1. Interpret the SQL query results and provide a clear natural language explanation
2. Determine the most appropriate visualization for the data
3. Provide a JSON configuration for the visualization

## Database Schema Reference
The mental health dataset contains the following fields:
- age (int): Age of respondent in years
- gender (text): Gender identity of respondent
- employment_status (text): Current employment situation
- work_environment (text): Description of workplace conditions
- mental_health_history (text): Self-reported history of mental health conditions
- seeks_treatment (text): Whether individual seeks professional mental health treatment (yes/no)
- stress_level (int): Self-reported stress level (scale of 1-10)
- sleep_hours (double): Average daily sleep duration in hours
- physical_activity_days (int): Number of days per week with physical activity
- depression_score (int): Quantitative measure of depression symptoms
- anxiety_score (int): Quantitative measure of anxiety symptoms
- social_support_score (int): Measure of perceived social support
- productivity_score (double): Measure of self-reported productivity
- mental_health_risk (text): Classification of mental health risk level

## Input Format
You will receive the following inputs:
1. originalQuestion: The original natural language question asked by the user
2. sqlQuery: The SQL query that was generated and executed
3. queryResults: The results returned from executing the SQL query (an array of objects)

## Output Format
Your response should be a JSON object with the following structure:

{
  "explanation": "<summary of the result>",
  "tableData": [ { ... }, { ... } ], // Array of row objects
  "visualization": {
    "chartType": "bar" | "line" | "pie" | ...,
    "xAxisColumn": "<column to use for X-axis>",
    "dataSeriesColumns": ["<column1>", "<column2>", ...],
    "transformationCode": "function transformData(data) { return ... }",
    "recommendationReason": "<why this chart type is suitable>"
  }
}

## Visualization Guidelines
- Choose "bar" charts for:
  - Comparing values across categories
  - Showing distribution across discrete categories
  - Comparing a small number of data points
  - When the x-axis represents categorical data

- Choose "line" charts for:
  - Showing trends over time or continuous variables
  - Illustrating relationships between continuous variables
  - Displaying changes or patterns across a sequence
  - When the x-axis represents a continuous range or ordered sequence

- The visualization library needs data in this format:
  [
    { name: "xAxisValue1", metric1: value1, metric2: value2, ... },
    { name: "xAxisValue2", metric1: value1, metric2: value2, ... },
    ...
  ]

Very Important: Your response must be a valid JSON object with the fields mentioned above and nothing else.
`
});

export const generateQuerry = async (query) => {  
    try {
        const result = await sqlquerrymodel.generateContent(query);
        
        // Get the text content from the response
        const responseText = result.response.candidates[0].content.parts[0].text;
        
        // Parse the JSON response
        try {
            // Try to parse as JSON
            const jsonResponse = JSON.parse(responseText);
            
            // Extract just the SQL query
            console.log('Generated SQL:', jsonResponse.sql);
            return jsonResponse.sql;
        } catch (parseError) {
            // If it's not valid JSON, try to extract the SQL using regex
            // This is a fallback in case the model doesn't return proper JSON
            console.warn('Failed to parse JSON response, attempting regex extraction:', parseError);
            
            // Look for SQL pattern in the response
            const sqlMatch = responseText.match(/(?:"sql"|sql):\s*"(.+?)"|SELECT.+?;/is);
            if (sqlMatch) {
                return sqlMatch[1] || sqlMatch[0];
            }
            
            // If all else fails, return the raw text
            console.warn('Falling back to raw text response');
            return responseText;
        }
    } catch (error) {
        console.error('Error generating SQL query:', error);
        throw error;
    }
}


export const analyzeQueryResults = async (query, sqlQuery, queryResults) => {
  try {
    const content = JSON.stringify({
      originalQuestion: query,
      sqlQuery: sqlQuery,
      queryResults: queryResults
    });

    const result = await dataAnalysisModel.generateContent(content);
    const responseText = result.response.candidates[0].content.parts[0].text;

    try {
      const analysisResult = JSON.parse(responseText);

      // Patch transformationCode if it's for male/female counts
      if (
        analysisResult.tableData?.length === 1 &&
        Object.keys(analysisResult.tableData[0]).includes('male_count') &&
        Object.keys(analysisResult.tableData[0]).includes('female_count')
      ) {
        analysisResult.visualization.transformationCode = `
          function transformData(data) {
            return [
              { name: 'Male', count: parseInt(data[0].male_count) },
              { name: 'Female', count: parseInt(data[0].female_count) }
            ];
          }
        `;
      }

      return analysisResult;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      return {
        explanation: "Error processing results. The analysis could not be completed.",
        error: true,
        originalResponse: responseText
      };
    }
  } catch (error) {
    console.error('Error analyzing query results:', error);
    throw error;
  }
};


